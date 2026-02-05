using Application.DTOs;
using AutoMapper;
using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class TopicService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TopicService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TopicDto>> GetTopicsAsync()
    {
        var topicEntities = await _unitOfWork.Topics.GetAllAsync();
        return _mapper.Map<IEnumerable<TopicDto>>(topicEntities);
    }

    public async Task<TopicDto> GetTopicByIdAsync(int id)
    {
        var topicEntity = await _unitOfWork.Topics.GetByIdAsync(id);
        return _mapper.Map<TopicDto>(topicEntity);
    }

    public async Task<TopicDto> CreateTopicAsync(CreateTopicDto createDto)
    {
        var existingTopic = await _unitOfWork.Topics.GetByNameAsync(createDto.Name);
        if (existingTopic != null) throw new Exception("Topic đã tồn tại.");

        var topicEntity = _mapper.Map<Topic>(createDto);

        await _unitOfWork.Topics.AddAsync(topicEntity);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<TopicDto>(topicEntity);
    }

    public async Task<TopicDto> UpdateTopicAsync(int id, UpdateTopicDto updateDto)
    {
        var topicEntity = await _unitOfWork.Topics.GetByIdAsync(id);
        if (topicEntity == null) throw new Exception("Topic không tìm thấy.");

        _mapper.Map(updateDto, topicEntity);

        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<TopicDto>(topicEntity);
    }

    public async Task DeleteTopicAsync(int id)
    {
        var topicEntity = await _unitOfWork.Topics.GetByIdAsync(id);
        if (topicEntity == null) throw new Exception("Topic không tìm thấy.");

        var problemsWithTopic = await _unitOfWork.Problems.GetProblemsByTopicIdAsync(id);
        if (problemsWithTopic.Any())
            throw new Exception("Không thể xóa. Topic đang được sử dụng bởi các Problem.");

        await _unitOfWork.Topics.DeleteAsync(topicEntity);
        await _unitOfWork.SaveChangesAsync();
    }
}
