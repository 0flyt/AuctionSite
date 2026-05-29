using AuctionSite.Api.Core.DTOs.Auction;
using AuctionSite.Api.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuctionSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuctionsController : ControllerBase
{
    private readonly IAuctionService _service;

    public AuctionsController(IAuctionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAuctions([FromQuery] string? title, [FromQuery] bool closed = false)
    {
        var auctions = await _service.GetAuctionsAsync(title, closed);
        return Ok(auctions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAuction(int id)
    {
        var auction = await _service.GetAuctionByIdAsync(id);
        if (auction == null) return NotFound();
        return Ok(auction);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateAuction(CreateAuctionDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var auction = await _service.CreateAuctionAsync(dto, userId);
        return Ok(auction);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateAuction(int id, UpdateAuctionDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _service.UpdateAuctionAsync(id, dto, userId);
        if (result == null) return Forbid();
        return Ok(result);
    }

    [HttpPatch("{id}/deactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeactivateAuction(int id)
    {
        var result = await _service.DeactivateAuctionAsync(id);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpPost("{id}/image")]
    [Authorize]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var imageUrl = await _service.UploadImageAsync(id, file, userId);
        if (imageUrl == null) return Forbid();
        return Ok(new { imageUrl });
    }
}