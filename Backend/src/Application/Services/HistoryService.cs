using Application.DTOs;
using AutoMapper;
using Core.Models;
using Application.Interfaces;

namespace Application.Services;

public class HistoryService(IUnitOfWork unitOfWork, IMapper mapper)
{
    private int? _defaultUserId;

    public async Task<int> GetDefaultUserIdAsync()
    {
        if (_defaultUserId.HasValue)
            return _defaultUserId.Value;

        var user = await unitOfWork.Users.GetByUsernameAsync("default_user");
        if (user == null)
            throw new Exception("User mặc định không tồn tại!");

        _defaultUserId = user.Id;
        return user.Id;
    }

    public async Task<IEnumerable<SearchHistoryDto>> GetSearchHistoriesAsync()
    {
        var userId = await GetDefaultUserIdAsync();
        var historyEntities = await unitOfWork.SearchHistories.GetSearchHistoriesByUserIdAsync(userId);

        return mapper.Map<IEnumerable<SearchHistoryDto>>(historyEntities);
    }

    public async Task<bool> DeleteSearchHistoryAsync(int historyId)
    {
        var historyEntity = await unitOfWork.SearchHistories.GetByIdAsync(historyId);
        if (historyEntity == null) return false;

        await unitOfWork.SearchHistories.DeleteAsync(historyEntity);
        await unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<SearchHistoryDto> CreateSearchHistoryAsync(CreateSearchHistoryDto createDto)
    {
        var userId = await GetDefaultUserIdAsync();

        var historyEntity = mapper.Map<SearchHistory>(createDto);
        historyEntity.UserId = userId;
        historyEntity.SearchDate = DateTime.UtcNow;

        await unitOfWork.SearchHistories.AddAsync(historyEntity);
        await unitOfWork.SaveChangesAsync();
        var newHistoryEntity = await unitOfWork.SearchHistories.GetByIdAsync(historyEntity.Id);

        return mapper.Map<SearchHistoryDto>(newHistoryEntity);
    }
}