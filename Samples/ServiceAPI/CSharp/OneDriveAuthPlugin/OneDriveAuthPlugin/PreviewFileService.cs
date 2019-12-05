using HP.HPTRIM.SDK;
using HP.HPTRIM.Service;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{

	[Route("/PreviewFile", "POST")]
	public class PreviewFile : ITrimRequest
	{
		public long Uri { get; set; }
	}

	public class PreviewFileService : BaseFileService
	{

		private bool hasPdfRendition(Record record)
		{
			foreach (RecordRendition rendition in record.ChildRenditions)
			{
				if (rendition.TypeOfRendition == RenditionType.Longevity && string.Equals(rendition.Extension, "pdf", StringComparison.InvariantCultureIgnoreCase))
				{
					return true;
				}
			}
			return false;
		}

		private  static string removeFromEnd(string s, string suffix)
		{
			if (s.EndsWith(suffix))
			{
				return s.Substring(0, s.Length - suffix.Length);
			}
			else
			{
				return s;
			}
		}

		public async Task<object> Post(PreviewFile request)
		{
			if (string.IsNullOrWhiteSpace(this.Database.WebServerURL))
			{
				throw new ApplicationException("Web URL not set in System options.");
			}

			string token = await getToken();

			long uri = await getUriFromLinkFile(token);


			Record record = new Record(this.Database, uri);

			if (!hasPdfRendition(record))
			{
				throw new ApplicationException("Preview not available.");
			} else
			{
				string rootPath = removeFromEnd(this.Request.RawUrl, this.Request.PathInfo);

			string url = $"{rootPath}/pdfjs/web/viewer?file={rootPath}%2Frecord%2F{uri}%2FRendition%2Flongevity%3Finline%3Dtrue";

				return new HttpResult(HttpStatusCode.Redirect, "preview document")
				{
					ContentType = "text/html",
					Headers = {
					{ HttpHeaders.Location, url }
				},
				};
			}




			/*
			var sb = new StringBuilder();
			sb.Append("<html>");
			sb.Append("<body>");
		//	sb.Append($"<iframe height='500' width='500' src='https://desktop-39dgcn3/ServiceAPI/pdfjs/web/viewer.html'></iframe>");
			 sb.AppendFormat(@"<body onload='document.forms[""form""].submit()'>");
			//sb.AppendFormat($"<body onload='window.location.assign(\"{url}\")'>");



			sb.AppendFormat("<form name='form' action='{0}' method='get'>", url);
					//	sb.Append("<p>Re-directing, please wait.</p>");
			//				sb.Append("<button>Go</button>");
			// Other params go here
		//	sb.Append("</form>");
			sb.Append("</body>");
			sb.Append("</html>");

			return new HttpResult(sb.ToString(), "text/html");
			*/
			/*
			Record record = new Record(this.Database, 9000000644);

			foreach (RecordRendition rendition in record.ChildRenditions)
			{
				if (rendition.TypeOfRendition == RenditionType.Longevity && string.Equals(rendition.Extension, "pdf", StringComparison.InvariantCultureIgnoreCase))
				{
					if (!rendition.IsDocumentInClientCache)
					{
						rendition.LoadDocumentIntoClientCache();
					}

					record.GetDocumentPathInClientCache(Events.DocViewed);





				//	return new HttpResult(new FileInfo(rendition.DocumentPathInClientCache), asAttachment: false);

					//		return new HttpResult(new FileInfo(rendition.DocumentPathInClientCache), false);

					//Response.AddHeader("Content-Type", "application/pdf");
					//	return System.IO.File.OpenRead(rendition.DocumentPathInClientCache);

					//	return new FileInfo(rendition.DocumentPathInClientCache);
					//Disposition disposition = Disposition.inline;
					//	ElectronicDocument ed = new ElectronicDocument(rendition);
					//	return DocumentBuilder.GetDocument(ed, disposition, false);

					//	return System.IO.File.OpenRead(rendition.DocumentPathInClientCache);


				}
			}
			*/
			//	throw new ApplicationException("Preview not available.");

			//	string query = $"q=uri:{uri}";
			//	Uri url = new Uri(this.Database.WebServerURL);
			//	UriBuilder uriBuilder = new UriBuilder(url);
			//	uriBuilder.Query = url.Query != null && url.Query.Length > 1
			//		? $"{url.Query.Substring(1)}&{query}"
			//		: uriBuilder.Query = query;


			////	return uriBuilder.ToString();

		}
	}
}
