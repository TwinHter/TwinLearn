using Application.DTOs;
using AutoMapper;
using Application.Interfaces;
using Core.Models;

namespace Application.Services;

public class TopicService(IUnitOfWork unitOfWork, IMapper mapper)
{

    public async Task<IEnumerable<TopicDto>> GetTopicsAsync()
    {
        var topicEntities = await unitOfWork.Topics.GetAllAsync();
        return mapper.Map<IEnumerable<TopicDto>>(topicEntities);
    }

    public async Task<TopicDto> GetTopicByIdAsync(int id)
    {
        var topicEntity = await unitOfWork.Topics.GetByIdAsync(id);
        return mapper.Map<TopicDto>(topicEntity);
    }

    public async Task<TopicDto> CreateTopicAsync(CreateTopicDto createDto)
    {
        var existingTopic = await unitOfWork.Topics.GetByNameAsync(createDto.Name);
        if (existingTopic != null) throw new Exception("Topic đã tồn tại.");

        var topicEntity = mapper.Map<Topic>(createDto);

        await unitOfWork.Topics.AddAsync(topicEntity);
        await unitOfWork.SaveChangesAsync();
        return mapper.Map<TopicDto>(topicEntity);
    }

    public async Task<TopicDto> UpdateTopicAsync(int id, UpdateTopicDto updateDto)
    {
        var topicEntity = await unitOfWork.Topics.GetByIdAsync(id);
        if (topicEntity == null) throw new Exception("Topic không tìm thấy.");

        mapper.Map(updateDto, topicEntity);

        await unitOfWork.SaveChangesAsync();
        return mapper.Map<TopicDto>(topicEntity);
    }

    public async Task DeleteTopicAsync(int id)
    {
        var topicEntity = await unitOfWork.Topics.GetByIdAsync(id);
        if (topicEntity == null) throw new Exception("Topic không tìm thấy.");

        var problemsWithTopic = await unitOfWork.Problems.GetProblemsByTopicIdAsync(id);
        if (problemsWithTopic.Any())
            throw new Exception("Không thể xóa. Topic đang được sử dụng bởi các Problem.");

        await unitOfWork.Topics.DeleteAsync(topicEntity);
        await unitOfWork.SaveChangesAsync();
    }
}
