using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TopicController : ControllerBase
{
    private readonly TopicService _topicService;
    public TopicController(TopicService topicService)
    {
        _topicService = topicService;
    }

    // GET: api/topic
    [HttpGet]
    public async Task<IActionResult> GetAllTopics()
    {
        var topics = await _topicService.GetTopicsAsync();
        return Ok(topics);
    }
}
