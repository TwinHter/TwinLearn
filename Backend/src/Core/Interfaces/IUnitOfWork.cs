namespace Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IProblemRepository Problems { get; }
    ITopicRepository Topics { get; }
    IChecklistRepository Checklists { get; }
    IUserRepository Users { get; }
    ISearchHistoryRepository SearchHistories { get; }

    Task<int> SaveChangesAsync();
}