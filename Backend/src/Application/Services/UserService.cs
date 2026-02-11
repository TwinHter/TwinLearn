using Application.DTOs;
using AutoMapper;
using Application.Interfaces;

namespace Application.Services;

public class UserService(IUnitOfWork unitOfWork, IMapper mapper)
{

    public async Task<UserDto> GetUserByIdAsync(int id)
    {
        var userEntity = await unitOfWork.Users.GetByIdAsync(id);
        if (userEntity == null) throw new Exception("User không tồn tại.");
        return mapper.Map<UserDto>(userEntity);
    }
}
