using Application.DTOs;
using Application.Services;
using Core.Constants;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")] // URL: /api/ai
public class AiController(AiService aiService, HistoryService historyService) : ControllerBase
{
    // POST /api/ai/gemini
    [HttpPost("gemini")]
    public async Task<IActionResult> GenerateGemini([FromBody] GeminiRequestDto requestDto)
    {
        var responseDto = await aiService.GetGeminiResponseAsync(requestDto);

        await historyService.CreateSearchHistoryAsync(new CreateSearchHistoryDto
        {
            UserInput = requestDto.Prompt,
            EngineResponse = responseDto.Response ?? string.Empty,
            EngineUsed = Core.Enums.EngineType.Gemini,
            SearchDate = responseDto.Timestamp,
            ProcessingTimeMs = responseDto.ProcessingTimeMs
        });

        if (responseDto.Status == AiStatusType.SYSTEM_FAILED)
        {
            return StatusCode(500, responseDto.ErrorMessage);
        }

        return Ok(responseDto);
    }

    // POST /api/ai/kb-fix-bug
    [HttpPost("kb-fix-bug")]
    public async Task<IActionResult> KbFixBugInCode([FromBody] KbFixBugRequestDto requestDto)
    {
        var responseDto = await aiService.KbFixBugInCodeAsync(requestDto);
        await historyService.CreateSearchHistoryAsync(new CreateSearchHistoryDto
        {
            UserInput = requestDto.SourceCode,
            EngineResponse = responseDto.AnalysisResult,
            EngineUsed = Core.Enums.EngineType.KnowledgeBase,
            SearchDate = responseDto.CreatedAt,
            ProcessingTimeMs = responseDto.ProcessingTimeMs
        });
        return Ok(responseDto);
    }


    // POST /api/ai/kb-solver
    [HttpPost("kb-solver")]
    public async Task<IActionResult> KbSolveProblem([FromBody] KbSolverRequestDto requestDto)
    {
        var responseDto = await aiService.KbSolveProblemAsync(requestDto);
        await historyService.CreateSearchHistoryAsync(new CreateSearchHistoryDto
        {
            UserInput = System.Text.Json.JsonSerializer.Serialize(requestDto),
            EngineResponse = responseDto.AnalysisResult,
            EngineUsed = Core.Enums.EngineType.KnowledgeBase,
            SearchDate = responseDto.CreatedAt,
            ProcessingTimeMs = responseDto.ProcessingTimeMs
        });
        return Ok(responseDto);
    }
}