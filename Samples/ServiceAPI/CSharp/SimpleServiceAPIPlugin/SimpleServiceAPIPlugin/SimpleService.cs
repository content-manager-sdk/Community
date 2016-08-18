using HP.HPTRIM.SDK;
using HP.HPTRIM.Service;
using ServiceStack;

namespace HP.HPTRIM.ServiceAPI.Samples
{
    // The IReturn interface below allows this request to be used in the TrimClient.Get<> method
    [Route("/Simple", "GET")]
    public class Simple : IReturn<SimpleResponse>
    {
        public long Uri { get; set; }
    }

    public class SimpleResponse
    {
        public string Name { get; set; }
        public string RecordTitle { get; set; }
    }

    public class SimpleService : TrimServiceBase
    {
        public object Get(Simple request)
        {
            SimpleResponse response = new SimpleResponse();
            if (request.Uri > 0)
            {
                Record record = new Record(this.Database, request.Uri);
                response.RecordTitle = record.Title;
                response.Name = this.Database.CurrentUser.FormattedName;
            }
            return response;
        }
    }
}

