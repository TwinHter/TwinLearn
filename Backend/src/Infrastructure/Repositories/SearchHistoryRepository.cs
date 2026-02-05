using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SearchHistoryRepository : GenericRepository<SearchHistory>, ISearchHistoryRepository
{
    private readonly AppDbContext _context;
    public SearchHistoryRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SearchHistory>> GetSearchHistoriesByUserIdAsync(int userId, int limit = 20)
    {
        if (limit == -1)
        {
            limit = int.MaxValue;
        }
        return await _context.SearchHistories
            .Where(sh => sh.UserId == userId)
            .OrderByDescending(sh => sh.SearchDate)
            .Take(limit)
            .ToListAsync();
    }
}