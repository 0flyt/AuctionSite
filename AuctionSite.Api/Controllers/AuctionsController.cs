using AuctionSite.Api.Core.DTOs.Auction;
using AuctionSite.Api.Core.Models;
using AuctionSite.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AuctionSite.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuctionsController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public AuctionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAuctions([FromQuery] string? title)
    {
        var query = _context.Auctions
            .Include(a => a.User)
            .Where(a => a.IsActive && a.EndDate > DateTime.UtcNow);

        if (!string.IsNullOrEmpty(title)) query = query.Where(a => a.Title.Contains(title));

        var auctions = await query.Select(a => new AuctionResponseDto
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
            HighestBid = a.Bids.Any() ? a.Bids.Max(b => b.Amount) : (decimal?)null

        }).ToListAsync();

        return Ok(auctions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAuction(int id)
    {
        var auction = await _context.Auctions
            .Include(a => a.User)
            .Include(a => a.Bids)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (auction == null) return NotFound();

        return Ok(new AuctionResponseDto
        {
            Id = auction.Id,
            Title = auction.Title,
            Description = auction.Description,
            StartingPrice = auction.StartingPrice,
            StartDate = auction.StartDate,
            EndDate = auction.EndDate,
            IsActive = auction.IsActive,
            UserId = auction.UserId,
            Username = auction.User.Username,
            HighestBid = auction.Bids.Any() ? auction.Bids.Max(b => b.Amount) : (decimal?)null
        });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateAuction(CreateAuctionDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var auction = new Auction
        {
            Title = dto.Title,
            Description = dto.Description,
            StartingPrice = dto.StartingPrice,
            StartDate = DateTime.UtcNow,
            EndDate = dto.EndDate,
            UserId = userId
        };

        _context.Auctions.Add(auction);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(userId);

        return Ok(new AuctionResponseDto
        {
            Id = auction.Id,
            Title = auction.Title,
            Description = auction.Description,
            StartingPrice = auction.StartingPrice,
            StartDate = auction.StartDate,
            EndDate = auction.EndDate,
            IsActive = auction.IsActive,
            UserId = auction.UserId,
            Username = user?.Username ?? ""
        });
    }

    [HttpPatch("{id}/deactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeactivateAuction(int id)
    {
        var auction = await _context.Auctions.FindAsync(id);

        if (auction == null) return NotFound();

        auction.IsActive = !auction.IsActive;

        await _context.SaveChangesAsync();

        return Ok(new { isActive = auction.IsActive });
    }
}
