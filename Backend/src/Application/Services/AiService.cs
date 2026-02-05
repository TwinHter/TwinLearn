using Application.DTOs;
using AutoMapper;
using Core.Interfaces;
using Core.Models;

namespace Application.Services;

public class AiService
{
    private readonly IMapper _mapper;
    private readonly IGeminiService _geminiService;
    private readonly HistoryService _historyService;
    private readonly IKbService _kbService;

    public AiService(IUnitOfWork unitOfWork, IMapper mapper, IGeminiService geminiService, HistoryService historyService, IKbService kbService)
    {
        _historyService = historyService;
        _mapper = mapper;
        _geminiService = geminiService;
        _kbService = kbService;
    }

    public async Task<GeminiResponseDto> GetGeminiResponseAsync(GeminiRequestDto requestDto)
    {
        var geminiResponse = await _geminiService.GetGeminiResponseAsync(requestDto.Prompt);
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
        var kbFixBug = await _kbService.AnalyzeCodeSyntax(requestDto.SourceCode);
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
        // Chuyển đổi requestDto thành chuỗi JSON
        var requestString = System.Text.Json.JsonSerializer.Serialize(requestDto);

        var kbSolver = await _kbService.AnalyzeCodeSolver(requestString);
        var responseDto = new KbSolverResponseDto
        {
            Status = kbSolver.Status,
            AnalysisResult = kbSolver.AnalysisResult,
            CreatedAt = kbSolver.CreatedAt
        };
        return responseDto;
    }
}