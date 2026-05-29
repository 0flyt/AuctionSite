using AuctionSite.Api.Core.DTOs.Bid;
using AuctionSite.Api.Data.Entities;

namespace AuctionSite.Api.Data.Interfaces;

public interface IBidRepo
{
    Task<IEnumerable<BidResponseDto>> GetBidsAsync(int auctionId);
    Task<Bid?> GetHighestBidAsync(int auctionId);
    Task<Bid> AddBidAsync(Bid bid);
    Task DeleteBidAsync(Bid bid);
    Task SaveChangesAsync();
}