using AuctionSite.Api.Core.DTOs.Auth;

namespace AuctionSite.Api.Core.Interfaces;

public interface IAuthService
{
    Task<(string? token, UserResponseDto? user, string? error)> LoginAsync(LoginRequestDto dto);
    Task<(UserResponseDto? user, string? error)> RegisterAsync(RegisterRequestDto dto);
}