using Application.DTOs;
using Application.Interfaces;
using Core.Enums;
using Core.Models;
namespace Application.Services;

public class AiService(IGeminiService geminiService, IKbService kbService)
{
    public async Task<GeminiResponseDto> GetGeminiResponseAsync(GeminiRequestDto requestDto)
    {
        var geminiResponse = new GeminiServiceResult();
        if (requestDto.TaskType == AiTaskType.SYNTAX_CHECK_LLM)
            geminiResponse = await geminiService.CheckSyntaxAsync(requestDto.Prompt);
        else geminiResponse = await geminiService.TaskSolverAsync(requestDto.Prompt);
        var responseDto = new GeminiResponseDto
        {
            Timestamp = DateTime.UtcNow,
            ModelVersionUsed = geminiResponse.ModelVersionUsed,
            Response = geminiResponse.ResponseText,
            Status = (geminiResponse.IsSuccess && geminiResponse.ResponseText != string.Empty) ? "Success" : "Error",
            ErrorMessage = geminiResponse.IsSuccess ? null : geminiResponse.ErrorMessage
        };
        return responseDto;
    }

    public async Task<KbFixBugResponseDto> KbFixBugInCodeAsync(KbFixBugRequestDto requestDto)
    {
        var kbFixBug = await kbService.KbCheckSyntax(requestDto.SourceCode);
        var responseDto = new KbFixBugResponseDto
        {
            Status = kbFixBug.Status,
            AnalysisResult = kbFixBug.AnalysisResult,
            CreatedAt = kbFixBug.CreatedAt
        };
        return responseDto;
    }

    public async Task<KbSolverResponseDto> KbSolveProblemAsync(KbSolverRequestDto requestDto)
    {

        var requestString = System.Text.Json.JsonSerializer.Serialize(requestDto);

        var kbSolver = await kbService.KbTaskSolver(requestString);
        var responseDto = new KbSolverResponseDto
        {
            Status = kbSolver.Status,
            AnalysisResult = kbSolver.AnalysisResult,
            CreatedAt = kbSolver.CreatedAt
        };
        return responseDto;
    }
}