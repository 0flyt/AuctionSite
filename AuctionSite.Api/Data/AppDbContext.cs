namespace AuctionSite.Api.Data;

using AuctionSite.Api.Core.Models;
using Microsoft.EntityFrameworkCore;


public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Admin> Admins { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Auction> Auctions { get; set; }
    public DbSet<Bid> Bids { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Bid>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.NoAction);
    }

}