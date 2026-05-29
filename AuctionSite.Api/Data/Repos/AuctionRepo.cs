using AuctionSite.Api.Core.DTOs.Auction;
using AuctionSite.Api.Data.Entities;
using AuctionSite.Api.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuctionSite.Api.Data.Repos;

public class AuctionRepo : IAuctionRepo
{
    private readonly AppDbContext _context;

    public AuctionRepo(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AuctionResponseDto>> GetAuctionsAsync(string? title, bool closed)
    {
        var query = _context.Auctions
            .Include(a => a.User)
            .Include(a => a.Bids)
            .Where(a => a.IsActive);

        if (closed)
            query = query.Where(a => a.EndDate <= DateTime.UtcNow);
        else
            query = query.Where(a => a.EndDate > DateTime.UtcNow);

        if (!string.IsNullOrEmpty(title))
            query = query.Where(a => a.Title.Contains(title));

        return await query.Select(a => new AuctionResponseDto
        {
            Id = a.Id,
            Title = a.Title,
            Description = a.Description,
            StartingPrice = a.StartingPrice,
            StartDate = a.StartDate,
            EndDate = a.EndDate,
            IsActive = a.IsActive,
            UserId = a.UserId,
            Username = a.User.Username,
            HighestBid = a.Bids.Any() ? a.Bids.Max(b => b.Amount) : null,
            ImageUrl = a.ImageUrl
        }).ToListAsync();
    }

    public async Task<AuctionResponseDto?> GetAuctionByIdAsync(int id)
    {
        return await _context.Auctions
            .Include(a => a.User)
            .Include(a => a.Bids)
            .Where(a => a.Id == id)
            .Select(a => new AuctionResponseDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                StartingPrice = a.StartingPrice,
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                IsActive = a.IsActive,
                UserId = a.UserId,
                Username = a.User.Username,
                HighestBid = a.Bids.Any() ? a.Bids.Max(b => b.Amount) : null,
                ImageUrl = a.ImageUrl
            }).FirstOrDefaultAsync();
    }

    public async Task<Auction> AddAuctionAsync(Auction auction)
    {
        _context.Auctions.Add(auction);
        await _context.SaveChangesAsync();
        return auction;
    }

    public async Task<Auction?> GetAuctionEntityByIdAsync(int id)
    {
        return await _context.Auctions
            .Include(a => a.Bids)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task SaveChangesAsync() =>
        await _context.SaveChangesAsync();
}