using ServiceStack;
using ServiceStack.Auth;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace OneDriveAuthPlugin
{
	public class TokenAuthProvider : AuthProvider
	{
		public static string Name = AuthenticateService.BasicProvider;
		public static string Realm = "/auth/" + AuthenticateService.BasicProvider;

		public TokenAuthProvider()
		{
			this.Provider = Name;
			this.AuthRealm = Realm;
		}

		private string getUserName(string accessToken)
		{
#if DEBUG

			if (accessToken == "me")
			{
				return "david";
			}

#endif

			AddInSsoToken ssotoken = new AddInSsoToken(accessToken);

			string expectedAudience = ConfigurationManager.AppSettings["ida:Audience"];

			System.Threading.Tasks.Task<SsoTokenValidationResult> task = System.Threading.Tasks.Task.Run<SsoTokenValidationResult>(async () => await ssotoken.Validate(expectedAudience));
			return task.Result.PreferredName;

		}

		public override object Authenticate(IServiceBase authService, IAuthSession session, Authenticate request)
		{

			string userName = getUserName(request.AccessToken);

			Log.Debug("user name: " + userName);
			return new AuthenticateResponse
			{
				UserName = userName,
				SessionId = session.Id,
			};
		}


		public override bool IsAuthorized(IAuthSession session, IAuthTokens tokens, Authenticate request = null)
		{
			Log.Debug("^^^^^^^^^^^^^^^^^^^  IsAuthorized  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

			if (session.IsAuthenticated && !string.IsNullOrEmpty(session.UserAuthName))
			{
				return true;
			}


			HttpContext context = System.Web.HttpContext.Current;
			string authHeader = context.Request.Headers["Authorization"];
			string userName = getUserName(authHeader.Substring(authHeader.IndexOf(' ') + 1));


			Log.Debug("user name: " + userName);
			session.UserAuthName = userName;

			return !string.IsNullOrEmpty(userName);

		}
	}
}
