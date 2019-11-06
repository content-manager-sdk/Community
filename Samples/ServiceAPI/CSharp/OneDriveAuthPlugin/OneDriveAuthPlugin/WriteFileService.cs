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

			string userFolder = Path.Combine("ForUser", this.Database.CurrentUser.Uri.ToString());

			string fullUserFolder = Path.Combine(this.ServiceDefaults.UploadBasePath, userFolder);
			string fileName = $"{Guid.NewGuid()}.docx";

			if (!Directory.Exists(fullUserFolder))
			{
				Directory.CreateDirectory(fullUserFolder);
			}

			if (string.IsNullOrWhiteSpace(response.FileName))
			{			
				response.FileName = Path.Combine(userFolder, fileName);
			}

			using (var stream = new FileStream(Path.Combine(fullUserFolder, fileName), FileMode.Append))
			{
				stream.Write(request.Data, 0, request.Data.Length);
			}

			return response;
		}
	}
}
