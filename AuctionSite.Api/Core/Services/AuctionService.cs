using AuctionSite.Api.Core.DTOs.Auction;
using AuctionSite.Api.Core.Interfaces;
using AuctionSite.Api.Data.Entities;
using AuctionSite.Api.Data.Interfaces;

namespace AuctionSite.Api.Core.Services;

public class AuctionService : IAuctionService
{
    private readonly IAuctionRepo _repo;
    private readonly IUserRepo _userRepo;

    public AuctionService(IAuctionRepo repo, IUserRepo userRepo)
    {
        _repo = repo;
        _userRepo = userRepo;
    }

    public async Task<IEnumerable<AuctionResponseDto>> GetAuctionsAsync(string? title, bool closed) =>
        await _repo.GetAuctionsAsync(title, closed);

    public async Task<AuctionResponseDto?> GetAuctionByIdAsync(int id) =>
        await _repo.GetAuctionByIdAsync(id);

    public async Task<AuctionResponseDto> CreateAuctionAsync(CreateAuctionDto dto, int userId)
    {
        var auction = new Auction
        {
            Title = dto.Title,
            Description = dto.Description,
            StartingPrice = dto.StartingPrice,
            StartDate = DateTime.UtcNow,
            EndDate = dto.EndDate.ToUniversalTime(),
            UserId = userId
        };

        await _repo.AddAuctionAsync(auction);
        var user = await _userRepo.GetByIdAsync(userId);

        return new AuctionResponseDto
        {
            Id = auction.Id,
            Title = auction.Title,
            Description = auction.Description,
            StartingPrice = auction.StartingPrice,
            StartDate = auction.StartDate,
            EndDate = auction.EndDate,
            IsActive = auction.IsActive,
            UserId = auction.UserId,
            Username = user?.Username ?? ""
        };
    }

    public async Task<AuctionResponseDto?> UpdateAuctionAsync(int id, UpdateAuctionDto dto, int userId)
    {
        var auction = await _repo.GetAuctionEntityByIdAsync(id);
        if (auction == null || auction.UserId != userId) return null;

        auction.Title = dto.Title;
        auction.Description = dto.Description;
        auction.EndDate = dto.EndDate.ToUniversalTime();

        if (!auction.Bids.Any())
            auction.StartingPrice = dto.StartingPrice;

        await _repo.SaveChangesAsync();

        var user = await _userRepo.GetByIdAsync(userId);
        return new AuctionResponseDto
        {
            Id = auction.Id,
            Title = auction.Title,
            Description = auction.Description,
            StartingPrice = auction.StartingPrice,
            StartDate = auction.StartDate,
            EndDate = auction.EndDate,
            IsActive = auction.IsActive,
            UserId = auction.UserId,
            Username = user?.Username ?? "",
            HighestBid = auction.Bids.Any() ? auction.Bids.Max(b => b.Amount) : null
        };
    }

    public async Task<bool> DeactivateAuctionAsync(int id)
    {
        var auction = await _repo.GetAuctionEntityByIdAsync(id);
        if (auction == null) return false;

        auction.IsActive = !auction.IsActive;
        await _repo.SaveChangesAsync();
        return true;
    }

    public async Task<string?> UploadImageAsync(int id, IFormFile file, int userId)
    {
        var auction = await _repo.GetAuctionEntityByIdAsync(id);
        if (auction == null || auction.UserId != userId) return null;

        var uploadsFolder = Path.Combine("wwwroot", "images");
        Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        auction.ImageUrl = $"/images/{fileName}";
        await _repo.SaveChangesAsync();

        return auction.ImageUrl;
    }
}