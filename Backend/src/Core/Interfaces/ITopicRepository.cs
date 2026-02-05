using Core.Models;

namespace Core.Interfaces;

public interface ITopicRepository : IGenericRepository<Topic>
{
    Task<Topic?> GetByNameAsync(string name);
}