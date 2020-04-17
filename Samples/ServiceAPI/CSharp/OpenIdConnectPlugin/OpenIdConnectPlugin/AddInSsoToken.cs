using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace OpenIdConnectPlugin
{
	public class AddInSsoToken : JwtSecurityToken
	{
		private static Dictionary<string, ConfigurationManager<OpenIdConnectConfiguration>> configManagers = new Dictionary<string, ConfigurationManager<OpenIdConnectConfiguration>>();
		public static Task<OpenIdConnectConfiguration> GetOIDConnectConfig(string wellKnownUri)
		{
			if (!configManagers.ContainsKey("openid"))
			{

				System.Net.Http.HttpClient httpClient = new System.Net.Http.HttpClient();
				configManagers["openid"] = new ConfigurationManager<OpenIdConnectConfiguration>(wellKnownUri, new OpenIdConnectConfigurationRetriever());
			}
#if DEBUG
			Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;
			ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

			ServicePointManager
	.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) =>
	{
		return true;
	};


			return configManagers["openid"].GetConfigurationAsync(CancellationToken.None);
#else
			return configManagers[config.Name].GetConfigurationAsync(CancellationToken.None);
#endif

		}

		string _wellKnownUri;

		string _clientId;
		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="encodedToken">The serialized JWT Token</param>
		public AddInSsoToken(string encodedToken, string wellKnownUri, string clientId) : base(encodedToken)
		{
			_wellKnownUri = wellKnownUri;

			_clientId = clientId;
		}

		/// <summary>
		/// Validates the token
		/// </summary>
		/// <param name="expectedAudience">The valid audience value to check</param>
		/// <returns></returns>
		public async Task<SsoTokenValidationResult> Validate()
		{

			ServiceStack.Logging.ILog log = ServiceStack.Logging.LogManager.GetLogger(typeof(AddInSsoToken));
			SsoTokenValidationResult result = new SsoTokenValidationResult();

			log.Debug("before get well known");
			OpenIdConnectConfiguration config = await GetOIDConnectConfig(_wellKnownUri);


			// Issuer will always be Azure, but it will contain the tenant ID of the
			// Office 365 organization the user belongs to. We can get that from the "tid" claim

			var preferredName = Claims.FirstOrDefault(claim => claim.Type == "email");

			if (preferredName == null)
			{
				preferredName = Claims.FirstOrDefault(claim => claim.Type == "upn");
			}

			if (preferredName == null)
			{
				preferredName = Claims.FirstOrDefault(claim => claim.Type == "preferred_username");
			}

			if (preferredName == null)
			{
				result.Message = "Preferred name not found.";
				return result;
			}


			var exp = Claims.FirstOrDefault(claim => claim.Type == "exp");
			if (exp != null)
			{
				result.Exp = Int64.Parse(exp.Value);
			}


			// Use System.IdentityModel.Tokens.Jwt library to validate the token
			JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
			TokenValidationParameters tvp = new TokenValidationParameters();

			tvp.ValidateIssuer = true;
			tvp.ValidIssuer = GetIssuerUri();
			tvp.ValidateAudience = true;
			tvp.ValidAudience = _clientId;
			tvp.ValidateIssuerSigningKey = true;
			tvp.IssuerSigningKeys = config.SigningKeys as IEnumerable<Microsoft.IdentityModel.Tokens.SecurityKey>;
			tvp.ValidateLifetime = true;


			try
			{
				var claimsPrincipal = tokenHandler.ValidateToken(RawData, tvp, out Microsoft.IdentityModel.Tokens.SecurityToken validatedToken);
				System.Security.Claims.ClaimsPrincipal.ClaimsPrincipalSelector = () => {
					(claimsPrincipal.Identity as ClaimsIdentity).BootstrapContext = new BootstrapContext(this.RawData);
					return claimsPrincipal;
				};

				// If no exception, all standard checks passed
				result.IsValid = true;
				result.LifetimeResult = result.SignatureResult = result.AudienceResult = result.IssuerResult = "passed";
				result.PreferredName = preferredName.Value;
			}
			catch (SecurityTokenInvalidAudienceException ex)
			{
				result.AudienceResult = "failed";
				result.Message = ex.Message;
			}
			catch (SecurityTokenInvalidIssuerException ex)
			{
				result.IssuerResult = "failed";
				result.Message = ex.Message;
			}
			catch (SecurityTokenInvalidLifetimeException ex)
			{
				result.LifetimeResult = "failed";
				result.Message = ex.Message;
			}
			catch (Microsoft.IdentityModel.Tokens.SecurityTokenExpiredException ex)
			{
				result.LifetimeResult = "failed";
				result.Message = ex.Message;
			}
			catch (SecurityTokenInvalidSignatureException ex)
			{
				result.SignatureResult = "failed";
				result.Message = ex.Message;
			}
			catch (Microsoft.IdentityModel.Tokens.SecurityTokenValidationException ex)
			{
				result.Message = ex.Message;
			}


			return result;
		}

		private string GenerateUserId(string userObjectId, string tenantId)
		{
			// Generate a user ID just from the concatenation of the user's object ID
			// and the tenant ID.

			// In a real world scenario if this user ID was going to be used for any reason
			// other than just to correlate Exchange tokens with a backend service, it would
			// be a good idea to secure this with crypto
			return string.Format("{0}@{1}", userObjectId, tenantId);
		}

		//https://dev-369883.okta.com/oauth2/default/.well-known/oauth-authorization-server


		string GetIssuerUri()
		{
			if (_wellKnownUri.IndexOf(".well-known", StringComparison.InvariantCultureIgnoreCase) > -1)
			{
				int idx = _wellKnownUri.IndexOf("/.well-known", StringComparison.InvariantCultureIgnoreCase);
				return _wellKnownUri.Substring(0, idx);
			}
			else
			{
				return _wellKnownUri;
			}
		}
	}
}
