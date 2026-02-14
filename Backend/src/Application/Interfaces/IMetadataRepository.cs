using Application.DTOs;
using Core.Enums;
using Core.Models;

namespace Application.Interfaces;

public interface IMetadataRepository
{
    Task<SolverMetadataDto> GetKbSolverData();
}