using Funq;
using HP.HPTRIM.Service;
using HP.HPTRIM.Web.Configuration;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.Logging;
using ServiceStack.Logging.Log4Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Web.SessionState;
using WordWebAddIn2Web.App_Start;
using WordWebAddIn2Web.Auth;

namespace WordWebAddIn2Web
{
    public class global : System.Web.HttpApplication
    {

        public class AppHost : TrimAppHost
        {
            public override void Configure(Container container)
            {

                base.Configure(container, ServiceDefaults.Instance);

                ServiceStack.Logging.LogManager.LogFactory = new DebugLogFactory();

                ServiceStack.Logging.LogManager.LogFactory = new Log4NetFactory(true);

              


                AppHostConfig.TrimConfig(ServiceDefaults.Instance, this, new HostConfig() { HandlerFactoryPath = "Serviceapi" });
                AppHostConfig.Instance.IsInWebClient = true;



              //  Plugins.Add(new BearerAuthPlugin(ServiceDefaults.Instance.Authentication));

                Plugins.Add(new AuthFeature(() => new AuthUserSession(), new IAuthProvider[] {
                    new TokenAuthProvider()
                }));

                this.Reconfigure();
            }
        }

        protected void Application_Start(object sender, EventArgs e)
        {
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            TrimUtils.InitiliseService();

            AppHost appHost = new AppHost();
            appHost.Init();

            TrimUtils.Start(ServiceDefaults.Instance.WorkGroupServer.WorkPath);

           

        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}