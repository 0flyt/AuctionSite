using AuctionSite.Api.Data.Entities;
using AuctionSite.Api.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuctionSite.Api.Data.Repos;

public class UserRepo : IUserRepo
{
    private readonly AppDbContext _context;

    public UserRepo(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email) =>
        await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<User?> GetByIdAsync(int id) =>
        await _context.Users.FindAsync(id);

    public async Task<IEnumerable<User>> SearchByUsernameAsync(string? username)
    {
        var query = _context.Users.AsQueryable();
        if (!string.IsNullOrEmpty(username))
            query = query.Where(u => u.Username.Contains(username));
        return await query.ToListAsync();
    }

    public async Task AddAsync(User user) =>
        await _context.Users.AddAsync(user);

    public async Task SaveChangesAsync() =>
        await _context.SaveChangesAsync();
}