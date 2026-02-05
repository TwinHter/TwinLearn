using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")] // URL: /api/ai
public class AiController : ControllerBase
{
    private readonly AiService _aiService;
    private readonly HistoryService _historyService;

    public AiController(AiService aiService, HistoryService historyService)
    {
        _aiService = aiService;
        _historyService = historyService;
    }

    // POST /api/ai/gemini
    [HttpPost("gemini")]
    public async Task<IActionResult> GenerateGemini([FromBody] GeminiRequestDto requestDto)
    {
        var responseDto = await _aiService.GetGeminiResponseAsync(requestDto);
        await _historyService.CreateSearchHistoryAsync(new CreateSearchHistoryDto
        {
            UserInput = requestDto.Prompt,
            EngineResponse = responseDto.Response ?? string.Empty,
            EngineUsed = Core.Enums.EngineType.Gemini,
            SearchDate = responseDto.Timestamp,
        });

        if (responseDto.Status == "Error")
        {
            return StatusCode(500, responseDto.ErrorMessage);
        }

        return Ok(responseDto);
    }

    // POST /api/ai/kb-fix-bug
    [HttpPost("kb-fix-bug")]
    public async Task<IActionResult> KbFixBugInCode([FromBody] KbFixBugRequestDto requestDto)
    {
        var responseDto = await _aiService.KbFixBugInCodeAsync(requestDto);
        await _historyService.CreateSearchHistoryAsync(new CreateSearchHistoryDto
        {
            UserInput = requestDto.SourceCode,
            EngineResponse = responseDto.AnalysisResult,
            EngineUsed = Core.Enums.EngineType.KnowledgeBase,
            SearchDate = responseDto.CreatedAt,
        });
        return Ok(responseDto);
    }


    // POST /api/ai/kb-solver
    [HttpPost("kb-solver")]
    public async Task<IActionResult> KbSolveProblem([FromBody] KbSolverRequestDto requestDto)
    {
        var responseDto = await _aiService.KbSolveProblemAsync(requestDto);
        await _historyService.CreateSearchHistoryAsync(new CreateSearchHistoryDto
        {
            UserInput = System.Text.Json.JsonSerializer.Serialize(requestDto),
            EngineResponse = responseDto.AnalysisResult,
            EngineUsed = Core.Enums.EngineType.KnowledgeBase,
            SearchDate = responseDto.CreatedAt,
        });
        return Ok(responseDto);
    }
}