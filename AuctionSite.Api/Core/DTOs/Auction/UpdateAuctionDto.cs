namespace AuctionSite.Api.Core.DTOs.Auction;

public class UpdateAuctionDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal StartingPrice { get; set; }
    public DateTime EndDate { get; set; }
    public string? ImageUrl { get; set; }
}
