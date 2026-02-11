using Core.Enums;
using Core.Models;

namespace Application.Interfaces;

public interface IChecklistRepository : IGenericRepository<Checklist>
{
    Task<IEnumerable<Checklist>> GetChecklistsByUserIdAsync(int userId);
    Task<IEnumerable<Checklist>> GetChecklistsByStatusAsync(ChecklistStatus status, int userId);
    Task<Checklist?> GetChecklistByProblemIdAsync(int problemId, int userId);
    Task<Checklist?> GetByIdWithProblemAsync(int id);
}