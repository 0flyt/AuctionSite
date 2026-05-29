using AuctionSite.Api.Core.DTOs.Auction;

namespace AuctionSite.Api.Core.Interfaces;

public interface IAuctionService
{
    Task<IEnumerable<AuctionResponseDto>> GetAuctionsAsync(string? title, bool closed);
    Task<AuctionResponseDto?> GetAuctionByIdAsync(int id);
    Task<AuctionResponseDto> CreateAuctionAsync(CreateAuctionDto dto, int userId);
    Task<AuctionResponseDto?> UpdateAuctionAsync(int id, UpdateAuctionDto dto, int userId);
    Task<bool> DeactivateAuctionAsync(int id);
    Task<string?> UploadImageAsync(int id, IFormFile file, int userId);
}