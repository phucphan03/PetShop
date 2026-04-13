using System.Text;
using Application.FacadeService;
using Application.Interfaces;
using Application.Services;
using Domain.Entities.Authorizes;
using Infrastructure.Data;
using Infrastructure.Interfaces;
using Infrastructure.Repositories;
using Infrastructure.UnitOfWork;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Shared.Email;
using Shared.Email.Interface;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            //DB Connection
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    sqlOptions =>
                        sqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)
                )
            );
            builder.Services.AddDbContext<AuthorizeDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    sqlOptions =>
                        sqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)
                )
            );
            //JWT Authentication
            builder
                .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,

                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
                        ),
                    };
                });
            builder.Services.AddScoped<IFacadeService, FacadeService>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IAuthorizeService, AuthorizeService>();
            builder.Services.AddSingleton<IEmailQueue, EmailQueue>();
            builder.Services.AddSingleton<EmailSender>();
            builder.Services.AddHostedService<BackgroundEmailSender>();
            builder
                .Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<AuthorizeDbContext>()
                .AddDefaultTokenProviders();
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(
                    "AllowFrontend",
                    policy =>
                    {
                        policy
                            .WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    }
                );
            });
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors("AllowFrontend");
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
