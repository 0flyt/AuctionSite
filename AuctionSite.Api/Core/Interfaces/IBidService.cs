using AuctionSite.Api.Core.DTOs.Bid;

namespace AuctionSite.Api.Core.Interfaces;

public interface IBidService
{
    Task<IEnumerable<BidResponseDto>> GetBidsAsync(int auctionId);
    Task<(BidResponseDto? bid, string? error)> CreateBidAsync(int auctionId, CreateBidDto dto, int userId);
    Task<(bool success, string? error)> DeleteBidAsync(int auctionId, int bidId, int userId);
}