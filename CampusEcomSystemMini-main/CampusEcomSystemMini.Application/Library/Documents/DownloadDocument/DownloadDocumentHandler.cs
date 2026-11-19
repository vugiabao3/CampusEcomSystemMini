using CampusEcomSystemMini.Application.Interfaces;
using MediatR;

namespace CampusEcomSystemMini.Application.Library.Documents.DownloadDocument;

// Tải tài liệu — MODULE 4 / BATCH 3 (DOWNLOAD + WATERMARK).
//
// Flow:
//   JWT -> Document -> Pricing -> Balance -> Transaction -> Watermark
//       -> Commit -> Download
//
// Nếu watermark hoặc bước quan trọng thất bại thì dừng lại,
// không trừ điểm và không trả file.
public class DownloadDocumentHandler
    : IRequestHandler<DownloadDocumentQuery, DownloadDocumentResult>
{
    private const string PdfContentType = "application/pdf";

    private const string DocxContentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    private readonly IDocumentRepository _documentRepository;
    private readonly IDocumentStorage _documentStorage;
    private readonly IDocumentWatermarkService _documentWatermarkService;
    private readonly IPointService _pointService;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;

    public DownloadDocumentHandler(
        IDocumentRepository documentRepository,
        IDocumentStorage documentStorage,
        IDocumentWatermarkService documentWatermarkService,
        IPointService pointService,
        IUserRepository userRepository,
        ICurrentUserService currentUserService)
    {
        _documentRepository = documentRepository;
        _documentStorage = documentStorage;
        _documentWatermarkService = documentWatermarkService;
        _pointService = pointService;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DownloadDocumentResult> Handle(
        DownloadDocumentQuery request,
        CancellationToken cancellationToken)
    {
        // Người tải lấy từ người dùng đang đăng nhập,
        // không nhận userId từ frontend.
        var userId = _currentUserService.UserId;

        var document = await _documentRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (document is null)
        {
            return DownloadDocumentResult.Failed(
                DownloadDocumentOutcome.NotFound,
                "Document not found.");
        }

        // File gốc nằm ngoài database nên phải tồn tại mới tải được.
        var content = await _documentStorage.GetContentAsync(
            document.StoredFileName,
            cancellationToken);

        if (content is null || content.Length == 0)
        {
            return DownloadDocumentResult.Failed(
                DownloadDocumentOutcome.FileMissing,
                "The document file is no longer available.");
        }

        var isPaid = DocumentInput.PricingTypeToLabel(
            document.PricingType) == DocumentInput.PaidPricingType;

        // Người đăng tải lại tài liệu của chính mình thì không mất điểm.
        var isOwner = document.UserId == userId;

        var price = (int)Math.Round(document.Price, MidpointRounding.AwayFromZero);

        var charged = false;

        int? remainingBalance = null;

        // 1. Kiểm tra pricing và số dư trước khi làm bất cứ việc gì tốn kém.
        if (isPaid && !isOwner)
        {
            if (price <= 0)
            {
                return DownloadDocumentResult.Failed(
                    DownloadDocumentOutcome.NotFound,
                    "Document not found.");
            }

            // Kiểm tra số dư và trừ điểm.
            // Hệ thống điểm thuộc Module 6, nếu chưa sẵn sàng
            // thì không cho tải tài liệu trả phí thay vì trả file miễn phí.
            var pointResult = await _pointService.TryPurchaseAsync(
                new PointPurchase(
                    userId,
                    document.UserId,
                    price,
                    $"Download document: {document.Title}"),
                cancellationToken);

            if (pointResult.Status == PointServiceStatus.InsufficientBalance)
            {
                return DownloadDocumentResult.Failed(
                    DownloadDocumentOutcome.InsufficientPoints,
                    pointResult.Message ??
                    "Not enough points to download this document.");
            }

            if (pointResult.Status == PointServiceStatus.Unavailable)
            {
                return DownloadDocumentResult.Failed(
                    DownloadDocumentOutcome.PointsUnavailable,
                    pointResult.Message ??
                    "The points system is not available yet.");
            }

            if (pointResult.Status != PointServiceStatus.Completed)
            {
                return DownloadDocumentResult.Failed(
                    DownloadDocumentOutcome.PointTransactionFailed,
                    pointResult.Message ??
                    "The points transaction failed.");
            }

            charged = true;
            remainingBalance = pointResult.BuyerBalance;
        }

        var downloader = await _userRepository.GetByIdAsync(
            userId,
            cancellationToken);

        // 2. Đóng dấu watermark trước khi trả file.
        var watermark = await _documentWatermarkService.ApplyAsync(
            new DocumentWatermarkRequest(
                content,
                document.FileType,
                downloader?.FullName ?? string.Empty,
                downloader?.Email ?? string.Empty,
                DateTimeOffset.UtcNow),
            cancellationToken);

        // Watermark thất bại thì dừng lại, không trả file gốc.
        if (!watermark.Success || watermark.Content is null)
        {
            // Rollback: hoàn lại giao dịch điểm nếu đã trừ,
            // để không xảy ra trường hợp mất điểm nhưng không nhận file.
            await RollbackPurchaseAsync(
                isPaid && !isOwner,
                userId,
                document.UserId,
                price,
                cancellationToken);

            return DownloadDocumentResult.Failed(
                DownloadDocumentOutcome.WatermarkFailed,
                watermark.ErrorMessage ??
                "Could not watermark the document.");
        }

        return DownloadDocumentResult.Downloaded(
            new DownloadDocumentResponse(
                watermark.Content,
                BuildDownloadFileName(
                    document.FileName,
                    document.Title,
                    document.FileType),
                ResolveContentType(document.FileType),
                remainingBalance,
                charged));
    }

    // Giao dịch điểm đã hoàn tất trước khi watermark chạy,
    // nếu watermark lỗi thì phải hoàn lại điểm.
    // Khi hệ thống điểm chưa triển khai thì không có gì để hoàn lại.
    private async Task RollbackPurchaseAsync(
        bool charged,
        Guid buyerId,
        Guid sellerId,
        int amount,
        CancellationToken cancellationToken)
    {
        if (!charged || amount <= 0)
        {
            return;
        }

        try
        {
            await _pointService.RefundAsync(
                new PointPurchase(
                    buyerId,
                    sellerId,
                    amount,
                    "Rollback: watermark failed"),
                cancellationToken);
        }
        catch
        {
            // Không ném lỗi để che mất nguyên nhân watermark,
            // handler vẫn trả lỗi cho người dùng.
        }
    }

    private static string ResolveContentType(string? fileType)
    {
        return string.Equals(
            fileType,
            "docx",
            StringComparison.OrdinalIgnoreCase)
            ? DocxContentType
            : PdfContentType;
    }

    // Tên file tải về giữ đuôi file gốc để mở được,
    // nếu tên file thiếu hoặc sai đuôi thì dựng lại từ FileType.
    private static string BuildDownloadFileName(
        string? fileName,
        string? title,
        string? fileType)
    {
        var name = (fileName ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            name = (title ?? string.Empty).Trim();
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            name = "document";
        }

        name = Path.GetFileName(name);

        if (string.IsNullOrWhiteSpace(name))
        {
            name = "document";
        }

        if (!name.Contains('.'))
        {
            var extension = string.Equals(
                fileType,
                "docx",
                StringComparison.OrdinalIgnoreCase)
                ? "docx"
                : "pdf";

            name = $"{name}.{extension}";
        }

        return name;
    }
}
