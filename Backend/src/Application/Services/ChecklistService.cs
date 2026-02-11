using Application.DTOs;
using AutoMapper;
using Core.Enums;
using Application.Interfaces;
using Core.Models;


namespace Application.Services;

public class ChecklistService(IUnitOfWork unitOfWork, IMapper mapper)
{
    private int? _defaultUserId; // Biến tạm để lưu UserId

    private async Task<int> GetDefaultUserIdAsync()
    {
        // Chỉ tìm 1 lần cho mỗi request
        if (_defaultUserId.HasValue)
            return _defaultUserId.Value;

        var user = await unitOfWork.Users.GetByUsernameAsync("default_user");
        if (user == null)
            throw new Exception("User mặc định không tồn tại!");

        _defaultUserId = user.Id;
        return user.Id;
    }

    public async Task<IEnumerable<ChecklistDto>> GetChecklistAsync()
    {
        // 1. Lấy UserId
        var userId = await GetDefaultUserIdAsync();

        var checklistEntities = await unitOfWork.Checklists.GetChecklistsByUserIdAsync(userId);

        return mapper.Map<IEnumerable<ChecklistDto>>(checklistEntities);
    }

    public async Task<ChecklistDto> CreateChecklistAsync(CreateChecklistDto createDto)
    {
        var userId = await GetDefaultUserIdAsync();

        if (createDto.ProblemId.HasValue)
        {
            // Thêm .Value ở đây
            var problemExists = await unitOfWork.Problems.GetByIdAsync(createDto.ProblemId.Value);

            if (problemExists == null)
                throw new Exception("Problem không tồn tại.");

            // Thêm .Value ở đây
            var existingItem = await unitOfWork.Checklists.GetChecklistByProblemIdAsync(userId, createDto.ProblemId.Value);

            if (existingItem != null)
                throw new Exception("Đã có trong checklist.");
        }

        // Dùng Mapper để map các trường chung
        var checklistEntity = mapper.Map<Checklist>(createDto);
        checklistEntity.UserId = userId;
        checklistEntity.LastUpdated = DateTime.UtcNow;
        checklistEntity.Status = ChecklistStatus.NotCompleted;

        await unitOfWork.Checklists.AddAsync(checklistEntity);
        await unitOfWork.SaveChangesAsync();
        return await GetChecklistByIdAsync(checklistEntity.Id);
    }

    public async Task<ChecklistDto> UpdateChecklistAsync(int id, UpdateChecklistDto updateDto)
    {
        var userId = await GetDefaultUserIdAsync();
        var checklistEntity = await unitOfWork.Checklists.GetByIdAsync(id);

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
        await unitOfWork.Checklists.UpdateAsync(checklistEntity);

        await unitOfWork.SaveChangesAsync();

        return mapper.Map<ChecklistDto>(checklistEntity);
    }

    public async Task<ChecklistDto> GetChecklistByIdAsync(int id)
    {
        var entity = await unitOfWork.Checklists.GetByIdWithProblemAsync(id);
        return mapper.Map<ChecklistDto>(entity);
    }

    public async Task<bool> DeleteChecklistAsync(int id)
    {
        var checklistEntity = await unitOfWork.Checklists.GetByIdAsync(id);

        if (checklistEntity == null)
            return false;

        await unitOfWork.Checklists.DeleteAsync(checklistEntity);
        await unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<ChecklistDto>> GetChecklistsByStatus(ChecklistStatus status)
    {
        var userId = await GetDefaultUserIdAsync();
        var checklistEntities = await unitOfWork.Checklists.GetChecklistsByStatusAsync(status, userId);
        return mapper.Map<IEnumerable<ChecklistDto>>(checklistEntities);
    }
}
