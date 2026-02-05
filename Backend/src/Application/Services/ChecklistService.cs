using Application.DTOs;
using AutoMapper;
using Core.Enums;
using Core.Interfaces;
using Core.Models;


namespace Application.Services;

public class ChecklistService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private int? _defaultUserId; // Biến tạm để lưu UserId

    public ChecklistService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    private async Task<int> GetDefaultUserIdAsync()
    {
        // Chỉ tìm 1 lần cho mỗi request
        if (_defaultUserId.HasValue)
            return _defaultUserId.Value;

        var user = await _unitOfWork.Users.GetByUsernameAsync("default_user");
        if (user == null)
            throw new Exception("User mặc định không tồn tại!");

        _defaultUserId = user.Id;
        return user.Id;
    }

    public async Task<IEnumerable<ChecklistDto>> GetChecklistAsync()
    {
        // 1. Lấy UserId
        var userId = await GetDefaultUserIdAsync();

        var checklistEntities = await _unitOfWork.Checklists.GetChecklistsByUserIdAsync(userId);

        return _mapper.Map<IEnumerable<ChecklistDto>>(checklistEntities);
    }

    public async Task<ChecklistDto> CreateChecklistAsync(CreateChecklistDto createDto)
    {
        var userId = await GetDefaultUserIdAsync();

        if (createDto.ProblemId.HasValue)
        {
            // Thêm .Value ở đây
            var problemExists = await _unitOfWork.Problems.GetByIdAsync(createDto.ProblemId.Value);

            if (problemExists == null)
                throw new Exception("Problem không tồn tại.");

            // Thêm .Value ở đây
            var existingItem = await _unitOfWork.Checklists.GetChecklistByProblemIdAsync(userId, createDto.ProblemId.Value);

            if (existingItem != null)
                throw new Exception("Đã có trong checklist.");
        }

        // Dùng Mapper để map các trường chung
        var checklistEntity = _mapper.Map<Checklist>(createDto);
        checklistEntity.UserId = userId;
        checklistEntity.LastUpdated = DateTime.UtcNow;
        checklistEntity.Status = ChecklistStatus.NotCompleted;

        await _unitOfWork.Checklists.AddAsync(checklistEntity);
        await _unitOfWork.SaveChangesAsync();
        return await GetChecklistByIdAsync(checklistEntity.Id);
    }

    public async Task<ChecklistDto> UpdateChecklistAsync(int id, UpdateChecklistDto updateDto)
    {
        var userId = await GetDefaultUserIdAsync();
        var checklistEntity = await _unitOfWork.Checklists.GetByIdAsync(id);

        if (checklistEntity == null)
            throw new Exception("Checklist không tồn tại.");
        if (checklistEntity.UserId != userId)
            throw new Exception("Không có quyền.");

        if (updateDto.Description != null)
        {
            checklistEntity.Description = updateDto.Description;
        }
        checklistEntity.Status = updateDto.Status;
        checklistEntity.LastUpdated = DateTime.UtcNow;
        await _unitOfWork.Checklists.UpdateAsync(checklistEntity);

        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<ChecklistDto>(checklistEntity);
    }

    public async Task<ChecklistDto> GetChecklistByIdAsync(int id)
    {
        var entity = await _unitOfWork.Checklists.GetByIdWithProblemAsync(id);
        return _mapper.Map<ChecklistDto>(entity);
    }

    public async Task<bool> DeleteChecklistAsync(int id)
    {
        var checklistEntity = await _unitOfWork.Checklists.GetByIdAsync(id);

        if (checklistEntity == null)
            return false;

        await _unitOfWork.Checklists.DeleteAsync(checklistEntity);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<ChecklistDto>> GetChecklistsByStatus(ChecklistStatus status)
    {
        var userId = await GetDefaultUserIdAsync();
        var checklistEntities = await _unitOfWork.Checklists.GetChecklistsByStatusAsync(status, userId);
        return _mapper.Map<IEnumerable<ChecklistDto>>(checklistEntities);
    }
}
