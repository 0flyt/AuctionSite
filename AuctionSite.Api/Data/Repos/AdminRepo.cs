using AuctionSite.Api.Data.Entities;
using AuctionSite.Api.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuctionSite.Api.Data.Repos;

public class AdminRepo : IAdminRepo
{
    private readonly AppDbContext _context;

    public AdminRepo(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Admin?> GetByEmailAsync(string email) =>
        await _context.Admins.FirstOrDefaultAsync(a => a.Email == email);
}