namespace AuctionSite.Api.Data;

using AuctionSite.Api.Data.Entities;
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

        modelBuilder.Entity<Admin>().HasData(new Admin
        {
            Id = 1,
            Email = "admin@admin.com",
            Password = "$2a$11$GB122J205i0VVKNnI9g9COBwTu6XHaEZkEdcqwyeus8X0DKhS6EK2"
        });
    }

}