using AuctionSite.Api.Core.DTOs.Auth;
using AuctionSite.Api.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuctionSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers([FromQuery] string? username)
    {
        var users = await _service.SearchUsersAsync(username);
        return Ok(users);
    }

    [HttpPut("{id}/password")]
    [Authorize]
    public async Task<IActionResult> UpdatePassword(int id, UpdatePasswordDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var (success, error) = await _service.UpdatePasswordAsync(id, dto, userId);
        if (!success) return BadRequest(error);
        return Ok("Lösenordet är uppdaterat.");
    }

    [HttpPatch("{id}/deactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeactivateUser(int id)
    {
        var result = await _service.DeactivateUserAsync(id);
        if (!result) return NotFound();
        return Ok();
    }
}