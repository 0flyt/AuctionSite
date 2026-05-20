using AuctionSite.Api.Core.DTOs.Auth;
using AuctionSite.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AuctionSite.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    //[HttpGet]
    //public async Task<IActionResult> GetUsers()
    //{
    //    var users = await _context.Users.ToListAsync();
    //    return Ok(users);
    //}

    [HttpPut("{id}/password")]
    [Authorize]
    public async Task<IActionResult> UpdatePassword(int id, UpdatePasswordDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (userId != id)
            return Forbid();

        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.Password))
            return BadRequest("Nuvarande lösenord är fel.");

        user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _context.SaveChangesAsync();

        return Ok("Lösenord uppdaterat.");
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers([FromQuery] string? username)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(username))
            query = query.Where(u => u.Username.Contains(username));

        var users = await query.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            IsActive = u.IsActive
        }).ToListAsync();

        return Ok(users);
    }

    [HttpPatch("{id}/deactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeactivateUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null) return NotFound();

        user.IsActive = !user.IsActive;

        await _context.SaveChangesAsync();

        return Ok(new { isActive = user.IsActive});
    }
}