using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using WordWebAddIn2Web.Model;

namespace WordWebAddIn2Web.Controllers
{
    public class BaseController : ApiController
    {
        static BaseController()
        {
            TrimApplication.TrimBinariesLoadPath = ConfigurationManager.AppSettings["trimBinariesLoadPath"];

            if (TrimApplication.ServiceType != ServiceTypes.WebService)
            {
                TrimApplication.SetAsWebService(ConfigurationManager.AppSettings["workPath"]);
            }

            TrimApplication.Initialize();
        }


        protected Database getDatabase(string trustedUser)
        {
            Database db = new Database();

            db.Id = ConfigurationManager.AppSettings["databaseId"];
            db.TrustedUser = trustedUser;
            db.WorkgroupServerName = "local";
            db.Connect();

            return db;
        }

        protected async System.Threading.Tasks.Task<string> GetUser()
        {
            var re = Request;
            var auth = re.Headers.Authorization;

#if DEBUG

            if (auth.Parameter == "me")
            {
                return "david";
            }

#endif

            AddInSsoToken ssotoken = new AddInSsoToken(re.Headers.Authorization.Parameter);

            string expectedAudience = ConfigurationManager.AppSettings["ida:Audience"];
            var tt = await ssotoken.Validate(expectedAudience);




            return tt.PreferredName;

        }
    }
}