using HP.HPTRIM.SDK;
using HP.HPTRIM.Service;
using ServiceStack;
using System.Net;

namespace HP.HPTRIM.ServiceAPI.Samples
{
    [Route("/MakeReference", "GET")]
    public class MakeReference
    {
        public string Name { get; set; }

        public ServiceModel.BaseObjectTypes TrimType { get; set; }
    }
    

    public class MakeReferenceService : TrimServiceBase
    {
        // this inherits from the base ServiceAPI service class so participates in  all the authenticate and Database access.
        // This means we do not need to construct a database we just use the Database instance on the base class.

        public object Get(MakeReference request)
        {
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                TrimMainObject trimObject = Database.FindTrimObjectByName((BaseObjectTypes)request.TrimType, request.Name);
                if (trimObject != null)
                {
                    string fileLocation = trimObject.MakeReference(string.Format("c:\\temp\\{0}.tr5", request.Name.Replace('/', '_')));
                    return new HttpResult(new TempDownloadableFile(fileLocation), true);
                }                
            }

            throw new HttpError(HttpStatusCode.NotFound, "404", "File not found");
        }
    }
}
