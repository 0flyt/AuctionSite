namespace AuctionSite.Api.Data;

using AuctionSite.Api.Core.Models;
using Microsoft.EntityFrameworkCore;


public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(new User
        {
            Id = 1,
            Name = "Test",
            Email = "test@test.com",
            Password = "test",
            IsActive = true
        });
    }
}