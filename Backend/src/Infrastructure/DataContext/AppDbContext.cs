using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    { }
    public DbSet<Problem> Problems { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<ProblemTopic> ProblemTopics { get; set; }
    public DbSet<Checklist> Checklists { get; set; }
    public DbSet<SearchHistory> SearchHistories { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProblemTopic>()
            .HasKey(pt => new { pt.ProblemId, pt.TopicId });

        modelBuilder.Entity<ProblemTopic>()
            .HasOne(pt => pt.Problem)
            .WithMany(p => p.ProblemTopics)
            .HasForeignKey(pt => pt.ProblemId);

        modelBuilder.Entity<ProblemTopic>()
            .HasOne(pt => pt.Topic)
            .WithMany(t => t.ProblemTopics)
            .HasForeignKey(pt => pt.TopicId);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
    }
}