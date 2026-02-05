using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Enums;

namespace Core.Models;

public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }

    public UserRole Role { get; set; }

    // Navigation properties
    public ICollection<Checklist> Checklists { get; set; } = new List<Checklist>();
    public ICollection<SearchHistory> SearchHistories { get; set; } = new List<SearchHistory>();
}