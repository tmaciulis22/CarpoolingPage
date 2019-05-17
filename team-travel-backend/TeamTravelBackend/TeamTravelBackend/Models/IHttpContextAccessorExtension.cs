using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace TeamTravelBackend.Models
{
    public static class IHttpContextAccessorExtension
    {
        public static int CurrentUser(this IHttpContextAccessor httpContextAccessor)
        {
            var stringId = httpContextAccessor?.HttpContext?.User?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
            int.TryParse(stringId, out int userId);

            return userId;
        }

        public static int CurrentUserFromQuery(this IHttpContextAccessor httpContextAccessor)
        {
            string toBeSearched = "access_token=";
            string urlParameters = httpContextAccessor?.HttpContext?.Request?.QueryString.ToString();
            int tokenIndex = urlParameters.IndexOf(toBeSearched);

            if (tokenIndex != -1)
            {
                string jwtString = urlParameters.Substring(tokenIndex + toBeSearched.Length);
                var stringId = new JwtSecurityToken(jwtString).Id;
                int.TryParse(stringId, out int userId);
                return userId;
            }
            return 0;
        }

        public static string GetAbsoluteUri(this IHttpContextAccessor httpContextAccessor)
        {
            var request = httpContextAccessor.HttpContext.Request;
            UriBuilder uriBuilder = new UriBuilder
            {
                Scheme = request.Scheme,
                Host = request.Host.Host,
                Port = request.Host.Port.Value
            };
            return uriBuilder.Uri.ToString();
        }
    }
}
