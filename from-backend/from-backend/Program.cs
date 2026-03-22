var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer(); // Required for OpenAPI/Swagger
builder.Services.AddSwaggerGen(); // Adds the Swagger generator to the DI container

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // 1. Map the OpenAPI JSON endpoint (fixes the 404 for /openapi/v1.json)
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        // Points Swagger UI to the new OpenAPI URL
        options.SwaggerEndpoint("/openapi/v1.json", "My API V1");
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
