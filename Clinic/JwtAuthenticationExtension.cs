using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

public static class JwtAuthenticationExtension
{
    private static string _signingKey;
    public static void AddJwtAuthentication(this IServiceCollection services, string issuer, string audience, string signingKey)
    {
        _signingKey = signingKey;

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey))
            };
        });
    }

    public static string GetJwtSecretKey()
    {
        // Tutaj używamy klucza "JwtSecretKey" z pliku konfiguracyjnego (appsettings.json)
        return _signingKey;
    }
}

