using AuctionSite.Api.Core.DTOs.Auth;

namespace AuctionSite.Api.Core.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> SearchUsersAsync(string? username);
    Task<(bool success, string? error)> UpdatePasswordAsync(int id, UpdatePasswordDto dto, int userId);
    Task<bool> DeactivateUserAsync(int id);
}