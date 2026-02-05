using Core.Interfaces;
using Infrastructure.Data;

namespace Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IProblemRepository Problems { get; private set; }
    public ITopicRepository Topics { get; private set; }
    public IChecklistRepository Checklists { get; private set; }
    public IUserRepository Users { get; private set; }
    public ISearchHistoryRepository SearchHistories { get; private set; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Problems = new ProblemRepository(_context);
        Topics = new TopicRepository(_context);
        Checklists = new ChecklistRepository(_context);
        Users = new UserRepository(_context);
        SearchHistories = new SearchHistoryRepository(_context);
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}