using System.Web.Http;

namespace WordWebAddIn2Web.App_Start
{
    class WebApiConfig
    {
        public static void Register(HttpConfiguration configuration)
        {
            configuration.Routes.MapHttpRoute("API Default", "api/{controller}/{id}",
                new { id = RouteParameter.Optional });

            //  ReactSiteConfiguration.Configuration.AddScript("~/Scripts/Test.jsx");
        }
    }
}