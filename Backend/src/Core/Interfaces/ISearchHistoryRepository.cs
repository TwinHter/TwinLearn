using Core.Models;

namespace Core.Interfaces;

public interface ISearchHistoryRepository : IGenericRepository<SearchHistory>
{
    Task<IEnumerable<SearchHistory>> GetSearchHistoriesByUserIdAsync(int userId, int limit = 20);
}