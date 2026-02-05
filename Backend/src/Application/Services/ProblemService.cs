using Application.DTOs;
using AutoMapper;
using Core.Enums;
using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class ProblemService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ProblemService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProblemDto>> GetAllProblemsAsync()
    {
        var problemEntities = await _unitOfWork.Problems.GetAllAsync();
        return _mapper.Map<IEnumerable<ProblemDto>>(problemEntities);
    }
    public async Task<ProblemDto> GetProblemByIdAsync(int id)
    {
        var problemEntity = await _unitOfWork.Problems.GetProblemByIdAsync(id);
        if (problemEntity == null)
            throw new Exception("Problem không tìm thấy.");
        return _mapper.Map<ProblemDto>(problemEntity);
    }

    public async Task<IEnumerable<ProblemDto>> GetProblemsByTopicAsync(int topicId)
    {
        var problemEntities = await _unitOfWork.Problems.GetProblemsByTopicIdAsync(topicId);
        return _mapper.Map<IEnumerable<ProblemDto>>(problemEntities);
    }

    public async Task<IEnumerable<ProblemDto>> GetProblemsByDifficultyAsync(int minDiff, int maxDiff)
    {
        var problemEntities = await _unitOfWork.Problems.GetProblemsByDifficultyRangeAsync(minDiff, maxDiff);
        return _mapper.Map<IEnumerable<ProblemDto>>(problemEntities);
    }

    public async Task<IEnumerable<ProblemDto>> GetProblemsByNameAsync(string title)
    {
        var problemEntities = await _unitOfWork.Problems.GetProblemsByNameAsync(title);
        return _mapper.Map<IEnumerable<ProblemDto>>(problemEntities);
    }

    public async Task<IEnumerable<ProblemDto>> GetProblemsBySourceAsync(ProblemSource source)
    {
        var problemEntities = await _unitOfWork.Problems.GetProblemsBySourceAsync(source);
        return _mapper.Map<IEnumerable<ProblemDto>>(problemEntities);
    }


    public async Task<ProblemDto> CreateProblemAsync(CreateProblemDto createDto)
    {
        // 1. Map các trường đơn giản (Title, Difficulty...)
        var problemEntity = _mapper.Map<Problem>(createDto);

        // 2. Logic nghiệp vụ: Xử lý TopicIds (N-N)
        if (createDto.TopicIds != null)
        {
            foreach (var topicId in createDto.TopicIds)
            {
                // (Nên kiểm tra xem topicId có tồn tại không)
                problemEntity.ProblemTopics.Add(new ProblemTopic { TopicId = topicId });
            }
        }

        // 3. Lưu vào CSDL
        await _unitOfWork.Problems.AddAsync(problemEntity);
        await _unitOfWork.SaveChangesAsync();

        // 4. Trả về DTO đầy đủ (Bằng cách gọi lại hàm Get)
        return await GetProblemByIdAsync(problemEntity.Id);
    }

    public async Task<ProblemDto> UpdateProblemAsync(int id, UpdateProblemDto updateDto)
    {
        // 1. Lấy entity gốc (kèm các Topic đang có)
        var problemEntity = await _unitOfWork.Problems.GetProblemByIdAsync(id);
        if (problemEntity == null)
            throw new Exception("Problem không tìm thấy.");

        _mapper.Map(updateDto, problemEntity);

        if (updateDto.TopicIds != null)
        {
            var newTopicIds = updateDto.TopicIds.ToHashSet();

            var currentProblemTopics = problemEntity.ProblemTopics.ToList();

            foreach (var problemTopic in currentProblemTopics)
            {
                if (!newTopicIds.Contains(problemTopic.TopicId))
                {
                    problemEntity.ProblemTopics.Remove(problemTopic);
                }
            }

            foreach (var topicId in newTopicIds)
            {
                if (!currentProblemTopics.Any(pt => pt.TopicId == topicId))
                {
                    problemEntity.ProblemTopics.Add(new ProblemTopic { TopicId = topicId });
                }
            }
        }
        await _unitOfWork.SaveChangesAsync();

        return await GetProblemByIdAsync(id);
    }

    public async Task<bool> DeleteProblemAsync(int id)
    {
        var problemEntity = await _unitOfWork.Problems.GetByIdAsync(id);
        if (problemEntity == null)
            return false;

        await _unitOfWork.Problems.DeleteAsync(problemEntity);

        await _unitOfWork.SaveChangesAsync();
        return true;
    }
    public async Task<IEnumerable<ProblemDto>> GetFilteredProblemsAsync(ProblemFilterDto filter)
    {
        var query = _unitOfWork.Problems.GetQueryable();

        if (filter.TopicId.HasValue)
        {
            query = query.Where(p => p.ProblemTopics.Any(pt => pt.TopicId == filter.TopicId.Value));
        }

        if (filter.MinDiff.HasValue)
        {
            query = query.Where(p => p.Difficulty >= filter.MinDiff.Value);
        }

        if (filter.MaxDiff.HasValue)
        {
            query = query.Where(p => p.Difficulty <= filter.MaxDiff.Value);
        }

        if (!string.IsNullOrEmpty(filter.Title))
        {
            query = query.Where(p => p.Title.Contains(filter.Title));
        }

        if (!string.IsNullOrEmpty(filter.Source))
        {
            // Dùng TryParse an toàn hơn
            if (Enum.TryParse<ProblemSource>(filter.Source, true, out var sourceEnum))
            {
                query = query.Where(p => p.Source == sourceEnum);
            }
        }
        if (filter.SortOrder.HasValue)
        {
            if (filter.SortOrder == 0) // 0 = Tăng dần
            {
                query = query.OrderBy(p => p.Difficulty);
            }
            else if (filter.SortOrder == 1) // 1 = Giảm dần
            {
                query = query.OrderByDescending(p => p.Difficulty);
            }
        }
        else
        {
            query = query.OrderBy(p => p.Id);
        }
        var problems = query.ToList();

        return _mapper.Map<IEnumerable<ProblemDto>>(problems);
    }
}
