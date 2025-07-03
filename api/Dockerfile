# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

# Copy only the project file and restore dependencies (improves build cache)
COPY ["Api.csproj", "./"]
RUN dotnet restore "Api.csproj"

# Copy the rest of the source code and publish
COPY . .
RUN dotnet publish "Api.csproj" -c Release -o /app/out --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app

# Environment variables (configurable)
ENV ASPNETCORE_URLS=http://+:8000 \
    DOTNET_RUNNING_IN_CONTAINER=true

# Copy published output from build stage
COPY --from=build /app/out ./

# Expose port (default 8000)
ARG PORT=8000
EXPOSE ${PORT}

ENTRYPOINT ["dotnet", "Api.dll"]