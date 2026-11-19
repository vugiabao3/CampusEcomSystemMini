using CampusEcomSystemMini.Application.Interfaces;
using Microsoft.AspNetCore.Identity;
using CampusEcomSystemMini.Infrastructure.Data;
namespace CampusEcomSystemMini.Infrastructure.Security;

public class PasswordHasher : IPasswordHasher
{
    
     private readonly AppDbContext _context;

    public PasswordHasher(AppDbContext context)
    {
        _context=context;
    }

    public string Hash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);

    }
    public bool Verify(string password, string PassWordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password,PassWordHash);
    }
}
