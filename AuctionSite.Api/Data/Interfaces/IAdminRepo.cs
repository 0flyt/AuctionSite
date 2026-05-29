using AuctionSite.Api.Data.Entities;

namespace AuctionSite.Api.Data.Interfaces;

public interface IAdminRepo
{
    Task<Admin?> GetByEmailAsync(string email);
}