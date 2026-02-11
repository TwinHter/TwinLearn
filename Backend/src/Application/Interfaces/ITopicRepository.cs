using Core.Models;

namespace Application.Interfaces;

public interface ITopicRepository : IGenericRepository<Topic>
{
    Task<Topic?> GetByNameAsync(string name);
}