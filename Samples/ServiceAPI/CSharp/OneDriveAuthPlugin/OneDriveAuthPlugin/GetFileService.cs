using HP.HPTRIM.SDK;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	[Route("/GetFile", "GET")]
	public class GetFile
	{
		public long Uri { get; set; }
	}

	public class GetFileResponse
	{
		public string File { get; set; }
	}

	public class GetFileService : BaseOneDriveService
	{
		public object Get(GetFile request)
		{
			var response = new GetFileResponse() { };

			Record record = new Record(this.Database, request.Uri);

			if (record.IsElectronic)
			{
				if (!record.IsDocumentInClientCache)
				{
					record.LoadDocumentIntoClientCache();
				}

				if (new string[] { "txt","log","csv","1st","html","lst","md","text","xml" }.Any(ext => ext.EqualsIgnoreCase(record.Extension)))
				{
					response.File = File.ReadAllText(record.DocumentPathInClientCache);
				} else
				{
					Byte[] bytes = File.ReadAllBytes(record.DocumentPathInClientCache);
					response.File = Convert.ToBase64String(bytes);
				}


			}

			return response;
		}
	}
}
