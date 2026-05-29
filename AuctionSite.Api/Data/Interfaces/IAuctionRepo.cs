using AuctionSite.Api.Core.DTOs.Auction;
using AuctionSite.Api.Data.Entities;

namespace AuctionSite.Api.Data.Interfaces;

public interface IAuctionRepo
{
    Task<IEnumerable<AuctionResponseDto>> GetAuctionsAsync(string? title, bool closed);
    Task<AuctionResponseDto?> GetAuctionByIdAsync(int id);
    Task<Auction> AddAuctionAsync(Auction auction);
    Task<Auction?> GetAuctionEntityByIdAsync(int id);
    Task SaveChangesAsync();
}