using CampusEcomSystemMini.Application;
using CampusEcomSystemMini.Api.Hubs;
using CampusEcomSystemMini.Infrastructure;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

using System.Text;

var builder = WebApplication.CreateBuilder(args);


// ==================================================
// 1. Controllers
// ==================================================

builder.Services.AddControllers();


// ==================================================
// 1b. SignalR (MODULE_5 / BATCH 3)
// ==================================================

builder.Services.AddSignalR();


// ==================================================
// 2. Application DI
// ==================================================

builder.Services.AddApplication();


// ==================================================
// 3. Infrastructure DI
// ==================================================

builder.Services.AddInfrastructure(
    builder.Configuration);


// ==================================================
// 4. Swagger
// ==================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    // Khai báo JWT Bearer
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "Nhập JWT token"
        });

    // Cho phép Swagger sử dụng JWT
    options.AddSecurityRequirement(
        document => new OpenApiSecurityRequirement
        {
            [
                new OpenApiSecuritySchemeReference(
                    "Bearer",
                    document)
            ] = []
        });
});


// ==================================================
// 5. JWT Configuration
// ==================================================

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException(
        "JWT Key chưa được cấu hình.");
}


builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                // Kiểm tra chữ ký JWT
                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)),

                // Không kiểm tra Issuer
                ValidateIssuer = false,

                // Không kiểm tra Audience
                ValidateAudience = false,

                // Kiểm tra thời gian hết hạn
                ValidateLifetime = true,

                // Token hết hạn là hết hạn ngay
                ClockSkew = TimeSpan.Zero
            };

        // SignalR gửi JWT qua query string
        // (access_token=...) thay vì Authorization header.
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken =
                    context.Request.Query["access_token"];

                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });



builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
// ==================================================
// 6. Build application
// ==================================================

var app = builder.Build();


// ==================================================
// 7. Swagger UI
// ==================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}


// ==================================================
// 8. Middleware
// ==================================================

app.UseHttpsRedirection();

app.UseCors("FrontendPolicy");

// Đọc và xác thực JWT
app.UseAuthentication();

// Kiểm tra [Authorize]
app.UseAuthorization();


// ==================================================
// 9. Controllers
// ==================================================

app.MapControllers();


// ==================================================
// 9b. SignalR Hubs (MODULE_5 / BATCH 3)
// ==================================================

app.MapHub<ChatHub>("/hubs/chat");


// ==================================================
// 10. Run
// ==================================================

app.Run();