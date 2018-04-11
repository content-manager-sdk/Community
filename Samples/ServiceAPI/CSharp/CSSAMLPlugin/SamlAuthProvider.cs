using ServiceStack.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using ServiceStack;
using System.Web.Configuration;
using ComponentSpace.SAML2;
using ServiceStack.Configuration;

namespace ComponentSpaceSAMLPlugin
{
    public class SamlAuthProvider : AuthProvider
    {
        public const string Name = "saml";
        public const string Realm = "/auth/saml";

        public SamlAuthProvider(IAppSettings appSettings) : base(appSettings, Realm, Name) { }

        protected IAuthTokens Init(IServiceBase authService, ref IAuthSession session, Authenticate request)
        {
            var requestUri = authService.Request.AbsoluteUri;
            if (this.CallbackUrl.IsNullOrEmpty())
            {
                this.CallbackUrl = requestUri;
            }

            if (session.ReferrerUrl.IsNullOrEmpty())
            {
                session.ReferrerUrl = request?.Continue ?? authService.Request.GetHeader("Referer");
            }

            if (session.ReferrerUrl.IsNullOrEmpty() || session.ReferrerUrl.IndexOf("/auth", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                session.ReferrerUrl = this.RedirectUrl
                    ?? HostContext.Config.WebHostUrl
                    ?? requestUri.Substring(0, requestUri.IndexOf("/", "https://".Length + 1, StringComparison.Ordinal));
            }

            var tokens = session.GetAuthTokens(this.Provider);
            if (tokens == null)
            {
                session.AddAuthToken(tokens = new AuthTokens { Provider = this.Provider });
            }

            return tokens;
        }


        public override object Authenticate(IServiceBase authService, IAuthSession session, Authenticate request)
        {
            var tokens = this.Init(authService, ref session, request);


            if (authService.Request.Verb == "POST")
            {
                bool isInResponseTo = false;
                string partnerIdP = null;
                string authnContext = null;
                string userName = null;
                IDictionary<string, string> attributes = null;
                string targetUrl = null;

                // Receive and process the SAML assertion contained in the SAML response.
                // The SAML response is received either as part of IdP-initiated or SP-initiated SSO.
                SAMLServiceProvider.ReceiveSSO(HttpContext.Current.Request, out isInResponseTo, out partnerIdP, out authnContext, out userName, out attributes, out targetUrl);

                // If no target URL is provided, provide a default.
                if (targetUrl == null)
                {
                    targetUrl = "~/";
                }

                var authInfo = new Dictionary<string, string>
                {
                    { "username", userName }
                };

                session.IsAuthenticated = true;
              
                return OnAuthenticated(authService, session, tokens, authInfo) ??
                    authService.Redirect(SuccessRedirectUrlFilter(this, session.ReferrerUrl));
            }
            else
            {


                string partnerIdP = WebConfigurationManager.AppSettings["PartnerIdP"];
                SAMLServiceProvider.InitiateSSO(HttpContext.Current.Response, null, partnerIdP);

                return new ServiceStack.HttpResult();
            }
        }

        public override bool IsAuthorized(IAuthSession session, IAuthTokens tokens, Authenticate request = null)
        {
            if (request != null)
            {
                if (!LoginMatchesSession(session, request.UserName))
                {
                    
                    return false;
                }
            }

            var retVal = session != null && session.IsAuthenticated && tokens != null && !string.IsNullOrEmpty(tokens.UserId);
            
            return retVal;
        }
    }
}
