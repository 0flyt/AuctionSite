using AuctionSite.Api.Core.DTOs.Auth;
using AuctionSite.Api.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AuctionSite.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;

    public AuthController(IAuthService service)
    {
        _service = service;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequestDto dto)
    {
        var (user, error) = await _service.RegisterAsync(dto);
        if (error != null) return BadRequest(error);
        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto dto)
    {
        var (token, user, error) = await _service.LoginAsync(dto);
        if (error != null) return Unauthorized(error);
        return Ok(new { token, user });
    }
}