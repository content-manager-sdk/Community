
namespace OneDriveConnector
{
	public class Document
	{
		public string WebUrl { get; set; }
		public string WebDavUrl { get; set; }

		public bool UserHasAccess { get; set; }
		public string MimeType { get; internal set; }
	}
}
