using Application.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TopicRepository : GenericRepository<Topic>, ITopicRepository
{
    private readonly AppDbContext _context;
    public TopicRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public Task<Topic?> GetByNameAsync(string name)
    {
        return _context.Topics.FirstOrDefaultAsync(t => t.Name == name);
    }
}