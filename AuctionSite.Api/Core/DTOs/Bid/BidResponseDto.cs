namespace AuctionSite.Api.Core.DTOs.Bid;

public class BidResponseDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime PlacedAt { get; set; }
    public string Username { get; set; } = string.Empty;
}
