using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	public static class GraphApiHelper
	{
		// Microsoft Graph-related base URLs
		internal static string BaseUrl = @"https://graph.microsoft.com/v1.0/";
		internal static string BaseGraphUrl = BaseUrl + "me/";


		public static string GetOneDriveSessionUrl(OneDriveItem item)
		{
			return $"{BaseUrl}/drives/{item.getDriveAndId()}/createUploadSession";
		}

		public static string GetOneDriveFileUploadUrlFromId(string driveId, string folderId, string fileName)
		{
			return $"{BaseUrl}drives/{driveId}/items/{folderId}:/{fileName}:/content";
		}

		public static string GetOneDriveFileUploadUrl(string folderId, string fileName)
		{
			return $"{GetMyOneDriveUrl()}/items/{folderId}:/{fileName}:/content";
		}

		public static string GetOneDriveChildrenUrl(OneDriveItem item)
		{
			return $"{BaseUrl}/drives/{item.getDriveAndId()}/children";
		}

		public static string GetOneDriveChildrenUrl()
		{
			return $"{GetMyOneDriveUrl()}/root/children";
		}

		private static string getSharingId(string webUrl)
		{
			string base64Value = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(webUrl));
			return "u!" + base64Value.TrimEnd('=').Replace('/', '_').Replace('+', '-');
		}

		public static string GetOneDriveShareUrl(string webUrl)
		{
			string sharingId = getSharingId(webUrl);
			// Construct URL for the names of the folders and files.
			return $"{BaseUrl}shares/{sharingId}/driveItem?$select=id,parentReference";
		}

		public static string GetOneDriveItemPathsUrl(string selectedPath)
		{
			// Construct URL for the names of the folders and files.
			return $"{BaseGraphUrl}drive/root:{selectedPath}?$select=id";
		}

		public static string GetOneDriveItemIdUrl(string id)
		{
			// Construct URL for the names of the folders and files.
			return $"{BaseUrl}drives/{id}?$select=webDavUrl,webUrl,id,name,etag,parentreference,name,file,lastModifiedDateTime";
		}

		public static string GetOneDriveItemIdUrlForDelete(string id)
		{
			// Construct URL for the names of the folders and files.
			return $"{BaseUrl}drives/{id}";
		}

		public static string GetOneDriveItemContentIdUrl(string id)
		{
			return $"{BaseUrl}drives/{id}/content";
		}

		public static string GetMyOneDriveUrl()
		{
			// Construct URL for the names of the folders and files.
			return BaseGraphUrl + "drive";
		}
	}


}
