using Application.DTOs;
using AutoMapper;
using Core.Interfaces;

namespace Application.Services;

public class UserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UserService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<UserDto> GetUserByIdAsync(int id)
    {
        var userEntity = await _unitOfWork.Users.GetByIdAsync(id);
        if (userEntity == null) throw new Exception("User không tồn tại.");
        return _mapper.Map<UserDto>(userEntity);
    }
}
