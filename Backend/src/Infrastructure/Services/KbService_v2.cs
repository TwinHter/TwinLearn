using System.Net.Http.Json;
using Application.Interfaces;
using Core.Constants;
using Core.Models;
using Infrastructure.Services.Models;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

public class KbService_v2(HttpClient httpClient, IConfiguration configuration) : IKbService
{
    private readonly string _baseUrl = configuration["ExternalServices:AiUrl"]
                                      ?? throw new ArgumentNullException("ExternalServices:AiUrl is missing");
    public async Task<KbSolver> KbTaskSolver(string request)
    {
        var payload = new
        {
            task_type = "task_solver_kb",
            content = request,
            context = (string?)null
        };
        var response = await httpClient.PostAsJsonAsync($"{_baseUrl}/kb", payload);
        if (!response.IsSuccessStatusCode)
        {
            return new KbSolver
            {
                Error = $"Error: {response.StatusCode}",
                Status = AiStatusType.SYSTEM_FAILED,
                Type = -1
            };
        }

        var dto = await response.Content.ReadFromJsonAsync<KbTaskSolverResponseDto>();

        if (dto == null)
        {
            return new KbSolver
            {
                Error = "KB Service returned null",
                Status = AiStatusType.SYSTEM_FAILED,
                Type = -1
            };
        }

        return new KbSolver
        {
            AnalysisResult = dto.Result ?? "",
            Error = dto.Error,
            Status = dto.Status,
            Type = dto.Type,
            ProcessingTimeMs = dto.ProcessingTimeMs
        };
    }
    public async Task<KbFixBug> KbCheckSyntax(string request)
    {
        var payload = new
        {
            task_type = "syntax_check_kb",
            content = request,
            context = (string?)null
        };

        var response = await httpClient.PostAsJsonAsync($"{_baseUrl}/kb", payload);

        if (!response.IsSuccessStatusCode)
        {
            return new KbFixBug
            {
                SourceCode = request,
                Error = $"Error: {response.StatusCode}",
                Status = AiStatusType.SYSTEM_FAILED,
            };
        }

        var dto = await response.Content.ReadFromJsonAsync<KbSyntaxCheckResponseDto>();

        if (dto == null)
        {
            return new KbFixBug
            {
                SourceCode = request,
                Error = "KB Service returned null",
                Status = AiStatusType.SYSTEM_FAILED,
            };
        }

        return new KbFixBug
        {
            SourceCode = request,
            AnalysisResult = dto.Result ?? "",
            Error = dto.Error,
            Status = dto.Status,
            ProcessingTimeMs = dto.ProcessingTimeMs
        };
    }
}