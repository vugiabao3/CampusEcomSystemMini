using CampusEcomSystemMini.Domain.Entities;

namespace CampusEcomSystemMini.Application.Interfaces;

public interface ILostFoundRepository
{
    Task<List<LostFoundRecord>> GetAllAsync(
        CancellationToken cancellationToken);
}