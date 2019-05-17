using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Security.Claims;
using TeamTravelBackend.Data;
using TeamTravelBackend.DataContracts;
using TeamTravelBackend.Hubs;
using TeamTravelBackend.Models;

namespace TeamTravelBackend
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins,
                builder =>
                {
                    builder.WithOrigins(Configuration.GetValue<string>("OriginURL")).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                });
                options.AddPolicy("CorsPolicy", builder =>
                 {
                     builder
                     .AllowAnyMethod()
                     .AllowAnyHeader()
                     .WithOrigins(Configuration.GetValue<string>("OriginURL"));
                 });
            });

            services.AddSignalR();

            services.AddMvc(Options => {
                Options.ModelBindingMessageProvider.SetValueMustNotBeNullAccessor(
                (_) => "The field is required.");

            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.Configure<JwtAuthentication>(Configuration.GetSection("Jwt"));

            services.AddSingleton<IPostConfigureOptions<JwtBearerOptions>, ConfigureJwtBearerOptions>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer();

            services.AddDbContext<AppDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("TeamTravelConnection")));
            services.AddScoped<ITripsRepository, TripsRepository>();
            services.AddScoped<ICustomersRepository, CustomersRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IAdminRepository, AdminRepository>();
            services.AddScoped<INotificationsHub, NotificationsHub>();
        }

        private class ConfigureJwtBearerOptions : IPostConfigureOptions<JwtBearerOptions>
        {
            private readonly IOptions<JwtAuthentication> _jwtAuthentication;

            public ConfigureJwtBearerOptions(IOptions<JwtAuthentication> jwtAuthentication)
            {
                _jwtAuthentication = jwtAuthentication ?? throw new ArgumentNullException(nameof(jwtAuthentication));
            }

            public void PostConfigure(string name, JwtBearerOptions options)
            {
                var jwtAuthentication = _jwtAuthentication.Value;

                options.ClaimsIssuer = jwtAuthentication.Issuer;
                options.IncludeErrorDetails = true;
                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateActor = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtAuthentication.Issuer,
                    ValidAudience = jwtAuthentication.Audience,
                    IssuerSigningKey = jwtAuthentication.SymmetricSecurityKey,
                    NameClaimType = ClaimTypes.NameIdentifier
                };
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseCors(MyAllowSpecificOrigins);
            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseCors("CorsPolicy");

            app.UseSignalR(routes =>
            {
                routes.MapHub<NotificationsHub>("/api/notifications");
            });

            app.UseMvc();
        }
    }
}
