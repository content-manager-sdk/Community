using ServiceStack.Auth;
using System;
using System.Collections.Generic;
using System.Web;
using ServiceStack;
using System.Web.Configuration;
using ComponentSpace.SAML2;
using ServiceStack.Configuration;
using ServiceStack.Web;
using ServiceStack.Host.AspNet;

namespace ComponentSpaceSAMLPlugin
{

    public class SamlAuthProvider : AuthProvider
    {
        private const string PartnerIdP = "PartnerIdP";

        public const string Name = "saml";
        public const string Realm = "/auth/saml";

        public SamlAuthProvider(IAppSettings appSettings) : base(appSettings, Realm, Name) {
            this.AuthRealm = appSettings != null ? appSettings.Get("SamlRealm", Realm) : Realm;
            this.Provider = Name;
            
            this.CallbackUrl = appSettings.GetString("saml.CallbackUrl") ?? this.FallbackConfig(appSettings.GetString("saml.CallbackUrl"));
            this.RedirectUrl = appSettings.GetString("saml.RedirectUrl") ?? this.FallbackConfig(appSettings.GetString("saml.RedirectUrl"));
        }

        protected IAuthTokens Init(IServiceBase authService, ref IAuthSession session, Authenticate request)
        {
            var requestUri = authService.Request.AbsoluteUri;
            if (this.CallbackUrl.IsNullOrEmpty())
            {
                this.CallbackUrl = requestUri;
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

            if (authService.Request is IHttpRequest && (authService.Request as IHttpRequest).HttpMethod == "GET")
            {
                session.ReferrerUrl = authService.Request.QueryString["redirect"];
                authService.SaveSession(session, this.SessionExpiry);

                string partnerIdP = WebConfigurationManager.AppSettings[PartnerIdP];
                SAMLServiceProvider.InitiateSSO(HttpContext.Current.Response, null, partnerIdP);

                (HttpContext.Current.ToResponse() as AspNetResponse).End();
                return null;
            } else
            {

                var tokens = this.Init(authService, ref session, request);
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
                    targetUrl = session.ReferrerUrl;
                }

                var authInfo = new Dictionary<string, string>
                {
                    { "username", userName },
                    {"user_id", userName }

            };

                session.IsAuthenticated = true;
              
                return OnAuthenticated(authService, session, tokens, authInfo) ??
                    authService.Redirect(SuccessRedirectUrlFilter(this, targetUrl));
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

        public void LoadUserOAuthProvider(IAuthSession authSession, IAuthTokens tokens)
        {
            var userSession = authSession as AuthUserSession;
            if (userSession == null)
            {
                return;
            }

            userSession.UserName = tokens.UserName ?? userSession.UserName;

        }


        protected override void LoadUserAuthInfo(AuthUserSession userSession, IAuthTokens tokens, Dictionary<string, string> authInfo)
        {
            try
            {

                tokens.UserName = authInfo["username"];
                tokens.UserId = authInfo["user_id"];
                userSession.UserAuthName = tokens.UserId;


                this.LoadUserOAuthProvider(userSession, tokens);
            }
            catch (Exception ex)
            {
                Log.Error("Could not retrieve Profile info for '{0}'".Fmt(tokens.DisplayName), ex);
            }
        }

        public override object Logout(IServiceBase service, Authenticate request)
        {
            if (SAMLServiceProvider.CanSLO())
            {
                // Request logout at the identity provider.
                string partnerIdP = WebConfigurationManager.AppSettings[PartnerIdP];
                SAMLServiceProvider.InitiateSLO(HttpContext.Current.Response, null, null, partnerIdP);               
            }

          

            base.Logout(service, request);

            (HttpContext.Current.ToResponse() as AspNetResponse).End();
            return null;
        }

        protected override string GetAuthRedirectUrl(IServiceBase authService, IAuthSession session)
        {
            return base.GetAuthRedirectUrl(authService, session);
        }
    }
}
