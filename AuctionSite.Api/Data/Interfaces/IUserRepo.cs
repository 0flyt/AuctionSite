using AuctionSite.Api.Data.Entities;

namespace AuctionSite.Api.Data.Interfaces;

public interface IUserRepo
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(int id);
    Task<IEnumerable<User>> SearchByUsernameAsync(string? username);
    Task AddAsync(User user);
    Task SaveChangesAsync();
}