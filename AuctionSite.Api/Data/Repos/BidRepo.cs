using AuctionSite.Api.Core.DTOs.Bid;
using AuctionSite.Api.Data.Entities;
using AuctionSite.Api.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuctionSite.Api.Data.Repos;

public class BidRepo : IBidRepo
{
    private readonly AppDbContext _context;

    public BidRepo(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BidResponseDto>> GetBidsAsync(int auctionId)
    {
        return await _context.Bids
            .Include(b => b.User)
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.Amount)
            .Select(b => new BidResponseDto
            {
                Id = b.Id,
                Amount = b.Amount,
                PlacedAt = b.PlacedAt,
                Username = b.User.Username
            }).ToListAsync();
    }

    public async Task<Bid?> GetHighestBidAsync(int auctionId)
    {
        return await _context.Bids
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.Amount)
            .FirstOrDefaultAsync();
    }

    public async Task<Bid> AddBidAsync(Bid bid)
    {
        _context.Bids.Add(bid);
        await _context.SaveChangesAsync();
        return bid;
    }

    public async Task DeleteBidAsync(Bid bid)
    {
        _context.Bids.Remove(bid);
        await _context.SaveChangesAsync();
    }

    public async Task SaveChangesAsync() =>
        await _context.SaveChangesAsync();
}