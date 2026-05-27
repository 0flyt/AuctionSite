using AuctionSite.Api.Core.DTOs.Bid;
using AuctionSite.Api.Core.Models;
using AuctionSite.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AuctionSite.Api.Controllers;

[ApiController]
[Route("api/auctions/{auctionId}/bids")]
public class BidsController : ControllerBase
{
    private readonly AppDbContext _context;

    public BidsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetBids(int auctionId)
    {
        var bids = await _context.Bids
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

        return Ok(bids);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateBid(int auctionId, CreateBidDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var auction = await _context.Auctions.FindAsync(auctionId);

        if (auction == null || !auction.IsActive || auction.EndDate <= DateTime.UtcNow)
            return BadRequest("Auktionen är inte öppen.");

        if (auction.UserId == userId)
            return BadRequest("Du kan inte bjuda på din egen auktion.");

        var highestBid = await _context.Bids
            .Where(b => b.AuctionId == auctionId)
            .MaxAsync(b => (decimal?)b.Amount) ?? auction.StartingPrice;

        if (dto.Amount <= highestBid)
            return BadRequest($"Ditt bud måste vara högre än det nuvarande högsta budet ({highestBid} kr).");

        var bid = new Bid
        {
            Amount = dto.Amount,
            PlacedAt = DateTime.UtcNow,
            AuctionId = auctionId,
            UserId = userId
        };

        _context.Bids.Add(bid);
        await _context.SaveChangesAsync();

        return Ok(new BidResponseDto
        {
            Id = bid.Id,
            Amount = bid.Amount,
            PlacedAt = bid.PlacedAt,
            Username = (await _context.Users.FindAsync(userId))!.Username
        });
    }

    [HttpDelete("{bidId}")]
    [Authorize]
    public async Task<IActionResult> DeleteBid(int auctionId, int bidId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var auction = await _context.Auctions.FindAsync(auctionId);

        if (auction == null || auction.EndDate <= DateTime.UtcNow)
            return BadRequest("Auktionen är avslutad.");

        var latestBid = await _context.Bids
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.Amount)
            .FirstOrDefaultAsync();

        if (latestBid == null || latestBid.Id != bidId)
            return BadRequest("Du kan bara ångra det senaste budet.");

        if (latestBid.UserId != userId)
            return Forbid();

        _context.Bids.Remove(latestBid);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
