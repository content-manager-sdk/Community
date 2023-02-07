
using HP.HPTRIM.Service;
using ServiceStack;
using System.IO;
using System.Net;

namespace HP.HPTRIM.ServiceAPI.Samples
{
    [Route("/PartialDownload/{Number}", "GET")]
    public class PartialDownload
    {
        public string Number { get; set; }
    }
    



    public class PartialDownloadService : TrimServiceBase
    {
        // this inherits from the base ServiceAPI service class so participates in  all the authenticate and Database access.
        // This means we do not need to construct a database we just use the Database instance on the base class.

        private string GetMimeType(TRIM.SDK.Record record)
        {
            string mimeType = (!string.IsNullOrEmpty(record.MimeType)) ? record.MimeType : (!string.IsNullOrEmpty(record.Extension) ? MimeTypes.GetMimeType(record.Extension) : "application/octet-stream");

            return mimeType.ToLower();
        }

        public object Get(PartialDownload request)
        {
            if (!string.IsNullOrWhiteSpace(request.Number))
            {
                TRIM.SDK.Record record = Database.FindTrimObjectByName(TRIM.SDK.BaseObjectTypes.Record, request.Number) as TRIM.SDK.Record;
                if (record != null && record.IsElectronic)
                {
                    if (!record.IsDocumentInClientCache)
                    {
                        record.LoadDocumentIntoClientCache();
                    }

                    return new HttpResult(new FileInfo(record.GetDocumentPathInClientCache(TRIM.SDK.Events.DocExtracted)), GetMimeType(record));
                    // replace / with _ so that windows will not get confused by the path seperator in a file name
                  //  string fileLocation = trimObject.MakeReference(string.Format("c:\\temp\\{0}.tr5", request.Name.Replace('/', '_')));
                 //   return new HttpResult(new TempDownloadableFile(fileLocation), true);
                }                
            }

            throw new HttpError(HttpStatusCode.NotFound, "404", "File not found");
        }
    }
}
