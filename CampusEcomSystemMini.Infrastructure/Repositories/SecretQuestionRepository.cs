using CampusEcomSystemMini.Application.Interfaces;
using CampusEcomSystemMini.Domain.Entities;
using CampusEcomSystemMini.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampusEcomSystemMini.Infrastructure.Repositories;

public class SecretQuestionRepository : ISecretQuestionRepository
{
    private readonly AppDbContext _context;

    public SecretQuestionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SecretQuestion?> GetByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken)
    {
        return await _context.SecretQuestions
            .FirstOrDefaultAsync(
                x => x.PostId == postId,
                cancellationToken);
    }

    public async Task AddAsync(
        SecretQuestion secretQuestion,
        CancellationToken cancellationToken)
    {
        await _context.SecretQuestions.AddAsync(
            secretQuestion,
            cancellationToken);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}