using System.ComponentModel.DataAnnotations;
namespace Core.Models;

public class ProblemTopic
{
    public int ProblemId { get; set; }
    public int TopicId { get; set; }

    // Foreign key relationships
    public Problem? Problem { get; set; }
    public Topic? Topic { get; set; }
}