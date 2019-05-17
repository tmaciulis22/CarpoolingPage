FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY ["TeamTravelBackend/TeamTravelBackend.csproj", "TeamTravelBackend/"]
RUN dotnet restore "TeamTravelBackend/TeamTravelBackend.csproj"
COPY . .
WORKDIR "/src/TeamTravelBackend"
RUN dotnet build "TeamTravelBackend.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "TeamTravelBackend.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "TeamTravelBackend.dll"]
