using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	public abstract class MSGraphObject
	{
		public string Name { get; set; }
		public string Id { get; set; }
		public string WebUrl { get; set; }

		[JsonProperty("@microsoft.graph.downloadUrl")]
		string DownloadUrl { get; set; }
	}

	/// <summary>
	/// Objects that have an Etag.
	/// </summary>
	public interface IEtagable
	{
		// When the JSON property name begins with a character that cannot
		// begin a .NET property name, a JsonProperty attribute maps the names.
		[JsonProperty("@odata.etag")]
		string Etag { get; set; }
	}

	/// <summary>
	/// A OneDriveItem can be a file or folder.
	/// </summary>
	public class OneDriveItem : MSGraphObject, IEtagable
	{
		public string Etag { get; set; }

	}

	/// <summary>
	/// A OneDriveItem can be a file or folder.
	/// </summary>
	public class OneDriveDrive : MSGraphObject
	{

	}
}
