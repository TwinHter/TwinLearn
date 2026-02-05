using Core.Enums;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ChecklistRepository : GenericRepository<Checklist>, IChecklistRepository
{
    private readonly AppDbContext _context;
    public ChecklistRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public Task<Checklist?> GetByIdWithProblemAsync(int id)
    {
        return _context.Checklists.Include(c => c.Problem).FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Checklist?> GetChecklistByProblemIdAsync(int problemId, int userId)
    {
        return await _context.Checklists.Include(c => c.Problem).FirstOrDefaultAsync(c => c.ProblemId == problemId && c.UserId == userId);
    }

    public async Task<IEnumerable<Checklist>> GetChecklistsByStatusAsync(ChecklistStatus status, int userId)
    {
        return await _context.Checklists.Include(c => c.Problem)
            .Where(c => c.Status == status && c.UserId == userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Checklist>> GetChecklistsByUserIdAsync(int userId)
    {
        return await _context.Checklists.Include(c => c.Problem)
            .Where(c => c.UserId == userId)
            .ToListAsync();
    }
}