using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TopicController(TopicService topicService) : ControllerBase
{
    // GET: api/topic
    [HttpGet]
    public async Task<IActionResult> GetAllTopics()
    {
        var topics = await topicService.GetTopicsAsync();
        return Ok(topics);
    }
}
