using AuctionSite.Api.Core.DTOs.Bid;
using AuctionSite.Api.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuctionSite.Api.Controllers;

[ApiController]
[Route("api/auctions/{auctionId}/bids")]
public class BidsController : ControllerBase
{
    private readonly IBidService _service;

    public BidsController(IBidService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetBids(int auctionId)
    {
        var bids = await _service.GetBidsAsync(auctionId);
        return Ok(bids);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateBid(int auctionId, CreateBidDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var (bid, error) = await _service.CreateBidAsync(auctionId, dto, userId);
        if (error != null) return BadRequest(error);
        return Ok(bid);
    }

    [HttpDelete("{bidId}")]
    [Authorize]
    public async Task<IActionResult> DeleteBid(int auctionId, int bidId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var (success, error) = await _service.DeleteBidAsync(auctionId, bidId, userId);
        if (!success) return BadRequest(error);
        return Ok();
    }
}