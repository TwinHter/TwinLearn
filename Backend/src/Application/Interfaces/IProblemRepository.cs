using Core.Models;
using Core.Enums;

namespace Application.Interfaces;

public interface IProblemRepository : IGenericRepository<Problem>
{
    Task<IEnumerable<Problem>> GetProblemsByTopicIdAsync(int topicId);
    Task<IEnumerable<Problem>> GetProblemsByDifficultyRangeAsync(int minDifficulty, int maxDifficulty);
    Task<IEnumerable<Problem>> GetProblemsBySourceAsync(ProblemSource source);
    Task<IEnumerable<Problem>> GetProblemsByNameAsync(string name);
    Task<Problem?> GetProblemByIdAsync(int id);
    IQueryable<Problem> GetQueryable();
}