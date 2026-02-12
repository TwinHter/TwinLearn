using Application.DTOs;
using Application.Interfaces;
using Core.Constants;
using Core.Models;
namespace Application.Services;

public class AiService(IGeminiService geminiService, IKbService kbService)
{
    public async Task<GeminiResponseDto> GetGeminiResponseAsync(GeminiRequestDto requestDto)
    {
        var geminiResponse = new GeminiServiceResult();
        if (requestDto.TaskType == AiTaskType.SYNTAX_CHECK_LLM)
            geminiResponse = await geminiService.CheckSyntaxAsync(requestDto.Prompt);
        else if (requestDto.TaskType == AiTaskType.TASK_SOLVER_LLM)
            geminiResponse = await geminiService.TaskSolverAsync(requestDto.Prompt);
        else
        {
            return new GeminiResponseDto
            {
                Timestamp = DateTime.UtcNow,
                Status = AiStatusType.SYSTEM_FAILED,
                ErrorMessage = "Invalid TaskType"
            };
        }
        var responseDto = new GeminiResponseDto
        {
            Timestamp = DateTime.UtcNow,
            ModelVersionUsed = geminiResponse.ModelVersionUsed,
            Response = geminiResponse.ResponseText,
            Status = (geminiResponse.IsSuccess && geminiResponse.ResponseText != string.Empty) ? AiStatusType.SUCCESS : AiStatusType.ERROR,
            ErrorMessage = geminiResponse.IsSuccess ? null : geminiResponse.ErrorMessage,
            ProcessingTimeMs = geminiResponse.ProcessingTimeMs
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
            CreatedAt = kbFixBug.CreatedAt,
            ProcessingTimeMs = kbFixBug.ProcessingTimeMs
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
            CreatedAt = kbSolver.CreatedAt,
            ProcessingTimeMs = kbSolver.ProcessingTimeMs
        };
        return responseDto;
    }
}