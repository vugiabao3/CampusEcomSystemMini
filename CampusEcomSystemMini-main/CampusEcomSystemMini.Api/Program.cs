using CampusEcomSystemMini.Application;
using CampusEcomSystemMini.Api;
using CampusEcomSystemMini.Api.Hubs;
using CampusEcomSystemMini.Api.Middleware;
using CampusEcomSystemMini.Infrastructure;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Microsoft.EntityFrameworkCore;
using CampusEcomSystemMini.Infrastructure.Data;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

using CampusEcomSystemMini.Application.Interfaces;

var builder = WebApplication.CreateBuilder(args);


// ==================================================
// 1. Controllers
// ==================================================

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new UtcDateTimeConverter());
    });


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
// 4. Real-time notification broadcaster
// ==================================================

builder.Services.AddScoped<
    CampusEcomSystemMini.Application.Interfaces.INotificationBroadcaster,
    CampusEcomSystemMini.Api.Services.SignalRNotificationBroadcaster>();


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
            .WithOrigins("http://localhost:5173", "http://localhost:5175")
            .AllowAnyHeader().AllowCredentials()
            .AllowAnyMethod();
    });
});

///////REDIS    ///////////////////////

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration =
        builder.Configuration.GetConnectionString("Redis");

    options.InstanceName = "CampusEcom:";
});


// INVALIDATION



// ==================================================
// 6. Build application
// ==================================================

var app = builder.Build();


// --- THÊM ĐOẠN CODE AUTO-MIGRATION NÀY VÀO ---
// --- TỰ ĐỘNG CHẠY MIGRATION KHI APP KHỞI ĐỘNG ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<AppDbContext>();

        await context.Database.MigrateAsync();

        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogInformation(
            "Database migrations đã được áp dụng thành công.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(
            ex,
            "Đã xảy ra lỗi trong quá trình tự động chạy Migration cơ sở dữ liệu.");

        // Không cho API khởi động khi database chưa được cập nhật.
        throw;
    }
}
// ---------------------------------------------



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

// Xử lý exception toàn cục (phải đặt trước Authentication/Authorization)
app.UseExceptionHandling();

// Đọc và xác thực JWT
app.UseAuthentication();

// Kiểm tra tài khoản bị khóa (Blocked/Suspended) trước khi phân quyền.
app.UseAccountStatus();

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
