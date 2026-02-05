using System.ComponentModel.DataAnnotations;
using Core.Enums;

namespace Application.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public UserRole Role { get; set; }
    [Required]
    public required string Username { get; set; }
}

public class LoginResultDto
{
    public required string Username { get; set; }
    public required string Password { get; set; }
    [Required]
    public UserRole Role { get; set; }
}
public class RegisterResultDto
{
    public required string Username { get; set; }
    public required string Password { get; set; }
    [Required]
    public UserRole Role { get; set; }
}