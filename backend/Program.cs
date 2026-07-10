var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite React Port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Health Check Endpoint
app.MapGet("/api/health", () => Results.Ok(new { status = "OK", message = "MangaWeb ASP.NET Core Backend is running smoothly." }));

Console.WriteLine("=========================================");
Console.WriteLine("  MangaWeb ASP.NET Core Backend running!  ");
Console.WriteLine("  Local URL: http://localhost:5000       ");
Console.WriteLine("=========================================");

app.Run("http://localhost:5000");
