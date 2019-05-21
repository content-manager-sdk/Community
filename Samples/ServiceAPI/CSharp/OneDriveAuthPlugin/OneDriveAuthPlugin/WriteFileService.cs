using HP.HPTRIM.SDK;
using HP.HPTRIM.Service;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	[Route("/WriteFile", "POST")]
	public class WriteFile
	{
		public byte[] Data { get; set; }
		public string FileName { get; set; }
	}

	public class WriteFileResponse
	{
		public string FileName { get; set; }
	}

	public class WriteFileService : BaseOneDriveService
	{
		public object Post(WriteFile request)
		{
			var response = new WriteFileResponse() { FileName = request.FileName };

			if (string.IsNullOrWhiteSpace(response.FileName))
			{
				response.FileName = Path.Combine(TrimApplication.WebServerWorkPath, "Uploads", $"{Guid.NewGuid()}.docx");
			}

			using (var stream = new FileStream(response.FileName, FileMode.Append))
			{
				stream.Write(request.Data, 0, request.Data.Length);
			}

			return response;
		}
	}
}
