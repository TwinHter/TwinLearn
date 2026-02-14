using System;
using Application.DTOs;
using Application.Interfaces;

namespace Application.Services;

public class MetadataService(IMetadataRepository metadataRepository)
{
    public Task<SolverMetadataDto> GetSolverMetadataAsync()
    {
        return metadataRepository.GetKbSolverData();
    }
}
