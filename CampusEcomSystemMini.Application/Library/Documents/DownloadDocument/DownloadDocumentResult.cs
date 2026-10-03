namespace CampusEcomSystemMini.Application.Library.Documents.DownloadDocument;

public sealed record DownloadDocumentResult(
    DownloadDocumentOutcome Outcome,
    DownloadDocumentResponse? Response,
    string? ErrorMessage)
{
    public static DownloadDocumentResult Downloaded(
        DownloadDocumentResponse response)
    {
        return new DownloadDocumentResult(
            DownloadDocumentOutcome.Success,
            response,
            null);
    }

    public static DownloadDocumentResult Failed(
        DownloadDocumentOutcome outcome,
        string errorMessage)
    {
        return new DownloadDocumentResult(
            outcome,
            null,
            errorMessage);
    }
}
