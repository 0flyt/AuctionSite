using AuctionSite.Api.Core.DTOs.Auth;
using AuctionSite.Api.Core.Interfaces;
using AuctionSite.Api.Data.Interfaces;

namespace AuctionSite.Api.Core.Services;

public class UserService : IUserService
{
    private readonly IUserRepo _repo;

    public UserService(IUserRepo repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<UserResponseDto>> SearchUsersAsync(string? username)
    {
        var users = await _repo.SearchByUsernameAsync(username);
        return users.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            IsActive = u.IsActive
        });
    }

    public async Task<(bool success, string? error)> UpdatePasswordAsync(int id, UpdatePasswordDto dto, int userId)
    {
        if (userId != id) return (false, "Du kan inte ändra någon annans lösenord.");

        var user = await _repo.GetByIdAsync(id);
        if (user == null) return (false, "Användaren hittades inte.");

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.Password))
            return (false, "Nuvarande lösenord är felaktigt.");

        user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _repo.SaveChangesAsync();
        return (true, null);
    }

    public async Task<bool> DeactivateUserAsync(int id)
    {
        var user = await _repo.GetByIdAsync(id);
        if (user == null) return false;

        user.IsActive = !user.IsActive;
        await _repo.SaveChangesAsync();
        return true;
    }
}