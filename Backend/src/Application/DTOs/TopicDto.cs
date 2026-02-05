namespace Application.DTOs;

public class TopicDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}
public class CreateTopicDto
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}
public class UpdateTopicDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
}
