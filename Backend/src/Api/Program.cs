using Application.Mappings;
using Application.Services;
using Infrastructure.Services;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Cấu hình này bảo .NET serialize Enums thành String
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure PostgreSQL Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAutoMapper(typeof(MappingProfiles));

// builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
// builder.Services.AddScoped<IProblemRepository, ProblemRepository>();
// builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IGeminiService, GeminiService>();
// builder.Services.AddScoped<ITopicRepository, TopicRepository>();
// builder.Services.AddScoped<IChecklistRepository, ChecklistRepository>();
// builder.Services.AddScoped<ISearchHistoryRepository, SearchHistoryRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<ProblemService>();
builder.Services.AddScoped<TopicService>();
builder.Services.AddScoped<ChecklistService>();
builder.Services.AddScoped<HistoryService>();
builder.Services.AddScoped<AiService>();
builder.Services.AddScoped<IKbService, KbService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
             .AllowAnyHeader()
             .AllowAnyMethod();
    });
});
var app = builder.Build();

app.UseCors("AllowReactApp");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        try
        {
            logger.LogInformation("Đang chạy database migrations...");
            dbContext.Database.Migrate();
            logger.LogInformation("Migrations hoàn tất.");

            logger.LogInformation("Đang seeding database...");
            DataSeeder.Seed(dbContext);
            logger.LogInformation("Seeding hoàn tất.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi khi chạy migrate hoặc seed database.");
        }
    }
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
