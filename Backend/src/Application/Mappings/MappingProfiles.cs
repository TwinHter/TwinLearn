using Application.DTOs;
using AutoMapper;
using Core.Models;

namespace Application.Mappings;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Topic, TopicDto>();
        CreateMap<User, UserDto>();
        CreateMap<SearchHistory, SearchHistoryDto>();
        CreateMap<Problem, ProblemDto>()
            .ForMember(dest => dest.Topics, opt => opt.MapFrom(src => src.ProblemTopics.Select(pt => pt.Topic)));
        CreateMap<Checklist, ChecklistDto>()
                .ForMember(dest => dest.Problem, opt => opt.MapFrom(src => src.Problem));

        CreateMap<CreateChecklistDto, Checklist>();
        CreateMap<UpdateChecklistDto, Checklist>();
        CreateMap<CreateProblemDto, Problem>();
        CreateMap<UpdateProblemDto, Problem>();
        CreateMap<SearchHistory, SearchHistoryDto>()
                .ForMember(
                    dest => dest.UserInput,
                    opt => opt.MapFrom(src => src.Query)
                )
                .ForMember(
                    dest => dest.EngineResponse,
                    opt => opt.MapFrom(src => src.Response)
                );
        CreateMap<CreateSearchHistoryDto, SearchHistory>()
            .ForMember(
                dest => dest.Query,
                opt => opt.MapFrom(src => src.UserInput)
            )
            .ForMember(
                dest => dest.Response,
                opt => opt.MapFrom(src => src.EngineResponse)
            );

    }
}