
# Stage 1: Build ứng dụng bằng .NET SDK
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copy file project trước để khôi phục các package NuGet
COPY ["CampusEcomSystemMini.Api/CampusEcomSystemMini.Api.csproj", "CampusEcomSystemMini.Api/"]
COPY ["CampusEcomSystemMini.Application/CampusEcomSystemMini.Application.csproj", "CampusEcomSystemMini.Application/"]
COPY ["CampusEcomSystemMini.Domain/CampusEcomSystemMini.Domain.csproj", "CampusEcomSystemMini.Domain/"]
COPY ["CampusEcomSystemMini.Infrastructure/CampusEcomSystemMini.Infrastructure.csproj", "CampusEcomSystemMini.Infrastructure/"]

RUN dotnet restore "CampusEcomSystemMini.Api/CampusEcomSystemMini.Api.csproj"

# Copy mã nguồn các project vào container build
COPY CampusEcomSystemMini.Api/ CampusEcomSystemMini.Api/
COPY CampusEcomSystemMini.Application/ CampusEcomSystemMini.Application/
COPY CampusEcomSystemMini.Domain/ CampusEcomSystemMini.Domain/
COPY CampusEcomSystemMini.Infrastructure/ CampusEcomSystemMini.Infrastructure/

# Build và publish riêng ứng dụng API
WORKDIR /src/CampusEcomSystemMini.Api
RUN dotnet publish "CampusEcomSystemMini.Api.csproj" \
    --configuration Release \
    --output /app/publish \
    /p:UseAppHost=false

# Stage 2: Chạy ứng dụng bằng ASP.NET Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

ENV ASPNETCORE_HTTP_PORTS=8080

EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "CampusEcomSystemMini.Api.dll"]





