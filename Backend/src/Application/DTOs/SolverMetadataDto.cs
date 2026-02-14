using System;

namespace Application.DTOs;

public class SolverMetadataDto
{
    public List<SolverItemDto> InputStates { get; set; } = new List<SolverItemDto>();
    public List<SolverItemDto> OutputStates { get; set; } = new List<SolverItemDto>();
    public List<SolverItemDto> Steps { get; set; } = new List<SolverItemDto>();
    public List<SolverProblemDto> Problems { get; set; } = new List<SolverProblemDto>();
}

public class SolverItemDto
{
    public string Id { get; set; } = "";
    public string Label { get; set; } = "";
}

public class SolverProblemDto
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "";
    public List<string> InitialStates { get; set; } = new List<string>();
    public string Goal { get; set; } = "";
}
