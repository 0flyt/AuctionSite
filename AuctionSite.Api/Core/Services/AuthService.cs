using AuctionSite.Api.Core.DTOs.Auth;
using AuctionSite.Api.Core.Interfaces;
using AuctionSite.Api.Data.Entities;
using AuctionSite.Api.Data.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuctionSite.Api.Core.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepo _userRepo;
    private readonly IAdminRepo _adminRepo;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepo userRepo, IAdminRepo adminRepo, IConfiguration configuration)
    {
        _userRepo = userRepo;
        _adminRepo = adminRepo;
        _configuration = configuration;
    }

    public async Task<(string? token, UserResponseDto? user, string? error)> LoginAsync(LoginRequestDto dto)
    {
        var admin = await _adminRepo.GetByEmailAsync(dto.Email);
        if (admin != null && BCrypt.Net.BCrypt.Verify(dto.Password, admin.Password))
        {
            var adminToken = GenerateAdminToken(admin);
            return (adminToken, new UserResponseDto { Id = admin.Id, Username = "Admin", Email = admin.Email }, null);
        }

        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            return (null, null, "Felaktig e-post eller lösenord.");

        if (!user.IsActive)
            return (null, null, "Kontot är inaktiverat.");

        var token = GenerateToken(user);
        return (token, new UserResponseDto { Id = user.Id, Username = user.Username, Email = user.Email }, null);
    }

    public async Task<(UserResponseDto? user, string? error)> RegisterAsync(RegisterRequestDto dto)
    {
        var existing = await _userRepo.GetByEmailAsync(dto.Email);
        if (existing != null)
            return (null, "E-postadressen används redan.");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        await _userRepo.AddAsync(user);
        await _userRepo.SaveChangesAsync();

        return (new UserResponseDto { Id = user.Id, Username = user.Username, Email = user.Email }, null);
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateAdminToken(Admin admin)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
            new Claim(ClaimTypes.Email, admin.Email),
            new Claim(ClaimTypes.Name, "Admin"),
            new Claim(ClaimTypes.Role, "Admin")
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}