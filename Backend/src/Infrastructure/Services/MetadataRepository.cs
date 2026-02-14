using System;
using System.Net.Http.Json;
using Application.DTOs;
using Application.Interfaces;
using Infrastructure.Services.Models;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

public class MetadataRepository(HttpClient httpClient, IConfiguration configuration) : IMetadataRepository
{
    private readonly string _baseUrl = configuration["ExternalServices:AiUrl"]
                                      ?? throw new ArgumentNullException("ExternalServices:AiUrl is missing");
    public async Task<SolverMetadataDto> GetKbSolverData()
    {
        var response = await httpClient.GetFromJsonAsync<PyRawResponse>($"{_baseUrl}/kb/raw");

        if (response == null) return new SolverMetadataDto();

        var stateMap = response.States.ToDictionary(s => s.Id, s => s);

        var result = new SolverMetadataDto();

        result.InputStates = response.States
            .Where(s => s.Type == "initial")
            .Select(s => new SolverItemDto
            {
                Id = s.Id,
                Label = !string.IsNullOrEmpty(s.Label) ? s.Label : s.Description
            })
            .ToList();

        result.OutputStates = response.States
            .Where(s => s.Type == "goal")
            .Select(s => new SolverItemDto
            {
                Id = s.Id,
                Label = !string.IsNullOrEmpty(s.Label) ? s.Label : s.Description
            })
            .ToList();

        result.Steps = response.Steps
            .Select(s => new SolverItemDto
            {
                Id = s.Id,
                Label = s.Description
            })
            .ToList();
        result.Problems = response.Problems.Select(p =>
        {
            return new SolverProblemDto
            {
                Id = p.Id,
                Title = p.Title,
                InitialStates = p.InitialStates,
                Goal = p.Goal
            };
        }).ToList();

        return result;
    }
}