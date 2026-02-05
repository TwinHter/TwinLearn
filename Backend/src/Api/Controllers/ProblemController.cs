using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")] // URL sẽ là /api/problems
public class ProblemController : ControllerBase
{
    private readonly ProblemService _problemService;
    public ProblemController(ProblemService problemService)
    {
        _problemService = problemService;
    }
    // GET /api/problems/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProblemById(int id)
    {
        var problemDto = await _problemService.GetProblemByIdAsync(id);
        if (problemDto == null)
            return NotFound("Không tìm thấy problem.");

        return Ok(problemDto);
    }
    //GET /api/problems?topicId=1&minDiff=2&maxDiff=5&title=abc&source=LeetCode
    [HttpGet]
    public async Task<IActionResult> GetProblems([FromQuery] ProblemFilterDto filter)
    {
        var problems = await _problemService.GetFilteredProblemsAsync(filter);

        return Ok(problems);
    }
    // POST /api/problems
    [HttpPost]
    public async Task<IActionResult> CreateProblem([FromBody] CreateProblemDto createDto)
    {
        var newProblemDto = await _problemService.CreateProblemAsync(createDto);
        return Ok(newProblemDto);
    }
    // PUT /api/problems/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProblem(int id, [FromBody] UpdateProblemDto updateDto)
    {
        var updatedProblemDto = await _problemService.UpdateProblemAsync(id, updateDto);
        if (updatedProblemDto == null)
            return NotFound("Không tìm thấy problem.");
        return Ok(updatedProblemDto);
    }
    // DELETE /api/problems/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProblem(int id)
    {
        var result = await _problemService.DeleteProblemAsync(id);
        if (!result)
            return NotFound("Không tìm thấy problem.");
        return Ok();
    }
}