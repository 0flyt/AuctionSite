using AuctionSite.Api.Core.DTOs.Bid;
using AuctionSite.Api.Core.Interfaces;
using AuctionSite.Api.Data.Entities;
using AuctionSite.Api.Data.Interfaces;

namespace AuctionSite.Api.Core.Services;

public class BidService : IBidService
{
    private readonly IBidRepo _bidRepo;
    private readonly IAuctionRepo _auctionRepo;
    private readonly IUserRepo _userRepo;

    public BidService(IBidRepo bidRepo, IAuctionRepo auctionRepo, IUserRepo userRepo)
    {
        _bidRepo = bidRepo;
        _auctionRepo = auctionRepo;
        _userRepo = userRepo;
    }

    public async Task<IEnumerable<BidResponseDto>> GetBidsAsync(int auctionId) =>
        await _bidRepo.GetBidsAsync(auctionId);

    public async Task<(BidResponseDto? bid, string? error)> CreateBidAsync(int auctionId, CreateBidDto dto, int userId)
    {
        var auction = await _auctionRepo.GetAuctionEntityByIdAsync(auctionId);

        if (auction == null || !auction.IsActive || auction.EndDate <= DateTime.UtcNow)
            return (null, "Auktionen är inte öppen.");

        if (auction.UserId == userId)
            return (null, "Du kan inte lägga bud på din egen auktion.");

        var highestBid = await _bidRepo.GetHighestBidAsync(auctionId);
        var currentHighest = highestBid?.Amount ?? auction.StartingPrice;

        if (dto.Amount <= currentHighest)
            return (null, $"Budet måste vara högre än {currentHighest} kr.");

        var bid = new Bid
        {
            Amount = dto.Amount,
            PlacedAt = DateTime.UtcNow,
            AuctionId = auctionId,
            UserId = userId
        };

        await _bidRepo.AddBidAsync(bid);
        var user = await _userRepo.GetByIdAsync(userId);

        return (new BidResponseDto
        {
            Id = bid.Id,
            Amount = bid.Amount,
            PlacedAt = bid.PlacedAt,
            Username = user?.Username ?? ""
        }, null);
    }

    public async Task<(bool success, string? error)> DeleteBidAsync(int auctionId, int bidId, int userId)
    {
        var auction = await _auctionRepo.GetAuctionEntityByIdAsync(auctionId);

        if (auction == null || auction.EndDate <= DateTime.UtcNow)
            return (false, "Auktionen är avslutad.");

        var highestBid = await _bidRepo.GetHighestBidAsync(auctionId);

        if (highestBid == null || highestBid.Id != bidId)
            return (false, "Du kan bara ångra det senaste budet.");

        if (highestBid.UserId != userId)
            return (false, "Du kan inte ångra någon annans bud.");

        await _bidRepo.DeleteBidAsync(highestBid);
        return (true, null);
    }
}