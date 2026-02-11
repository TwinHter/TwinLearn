using Core.Enums;
using Application.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ProblemRepository : GenericRepository<Problem>, IProblemRepository
{
    private readonly AppDbContext _context;
    public ProblemRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<Problem?> GetProblemByIdAsync(int id)
    {
        return await _context.Problems
            .Include(p => p.ProblemTopics)
            .ThenInclude(pt => pt.Topic)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Problem>> GetProblemsByDifficultyRangeAsync(int minDifficulty, int maxDifficulty)
    {
        return await _context.Problems
            .Include(p => p.ProblemTopics)
            .ThenInclude(pt => pt.Topic)
            .Where(p => p.Difficulty >= minDifficulty && p.Difficulty <= maxDifficulty)
            .ToListAsync();
    }

    public Task<IEnumerable<Problem>> GetProblemsByNameAsync(string name)
    {
        return Task.FromResult(_context.Problems
            .Include(p => p.ProblemTopics)
            .ThenInclude(pt => pt.Topic)
            .Where(p => p.Title.Contains(name))
            .AsEnumerable());
    }

    public async Task<IEnumerable<Problem>> GetProblemsBySourceAsync(ProblemSource source)
    {
        return await _context.Problems
            .Include(p => p.ProblemTopics)
            .ThenInclude(pt => pt.Topic)
            .Where(p => p.Source == source)
            .ToListAsync();
    }

    public async Task<IEnumerable<Problem>> GetProblemsByTopicIdAsync(int topicId)
    {
        return await _context.Problems
            .Include(p => p.ProblemTopics)
            .ThenInclude(pt => pt.Topic)
            .Where(p => p.ProblemTopics.Any(pt => pt.TopicId == topicId))
            .ToListAsync();
    }

    public IQueryable<Problem> GetQueryable()
    {
        return _context.Problems
                   .Include(p => p.ProblemTopics)
                   .ThenInclude(pt => pt.Topic)
                   .AsQueryable();
    }
}