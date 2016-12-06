using HP.HPTRIM.Service.Client;
using HP.HPTRIM.ServiceModel;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ADFSOauthClient
{
    class Program
    {
        static void Main(string[] args)
        {

            string authority = ConfigurationManager.AppSettings["ida:authority"];
            string resourceURI = ConfigurationManager.AppSettings["ida:resourceUri"];
            string clientID = ConfigurationManager.AppSettings["ida:clientId"];
            string clientReturnURI = ConfigurationManager.AppSettings["trim:ServiceLocation"];

            AuthenticationContext ac =
              new AuthenticationContext(authority, false, new FileCache());

            string authHeader = null;

            Task.Run(async () =>
            {
                AuthenticationResult ar =
                             await  ac.AcquireTokenAsync(resourceURI, clientID, new Uri(clientReturnURI), new PlatformParameters(PromptBehavior.Auto));

                authHeader = ar.CreateAuthorizationHeader();

               

            }).Wait();





            TrimClient trimClient = new TrimClient(clientReturnURI);
            trimClient.ServiceClient.Headers.Add("Authorization", authHeader);

            LocationFind request = new LocationFind();
            request.Id = "Me";
            request.Properties = new List<string>() { "SortName" };

            var response = trimClient.Get<LocationsResponse>(request);

            Console.WriteLine(response.Results[0].SortName);

        }
    }
}
