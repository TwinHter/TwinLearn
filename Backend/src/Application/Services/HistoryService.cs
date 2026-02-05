using Application.DTOs;
using AutoMapper;
using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class HistoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private int? _defaultUserId;

    public HistoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<int> GetDefaultUserIdAsync()
    {
        if (_defaultUserId.HasValue)
            return _defaultUserId.Value;

        var user = await _unitOfWork.Users.GetByUsernameAsync("default_user");
        if (user == null)
            throw new Exception("User mặc định không tồn tại!");

        _defaultUserId = user.Id;
        return user.Id;
    }

    public async Task<IEnumerable<SearchHistoryDto>> GetSearchHistoriesAsync()
    {
        var userId = await GetDefaultUserIdAsync();
        var historyEntities = await _unitOfWork.SearchHistories.GetSearchHistoriesByUserIdAsync(userId);

        return _mapper.Map<IEnumerable<SearchHistoryDto>>(historyEntities);
    }

    public async Task<bool> DeleteSearchHistoryAsync(int historyId)
    {
        var historyEntity = await _unitOfWork.SearchHistories.GetByIdAsync(historyId);
        if (historyEntity == null) return false;

        await _unitOfWork.SearchHistories.DeleteAsync(historyEntity);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<SearchHistoryDto> CreateSearchHistoryAsync(CreateSearchHistoryDto createDto)
    {
        var userId = await GetDefaultUserIdAsync();

        var historyEntity = _mapper.Map<SearchHistory>(createDto);
        historyEntity.UserId = userId;
        historyEntity.SearchDate = DateTime.UtcNow;

        await _unitOfWork.SearchHistories.AddAsync(historyEntity);
        await _unitOfWork.SaveChangesAsync();
        var newHistoryEntity = await _unitOfWork.SearchHistories.GetByIdAsync(historyEntity.Id);

        return _mapper.Map<SearchHistoryDto>(newHistoryEntity);
    }
}