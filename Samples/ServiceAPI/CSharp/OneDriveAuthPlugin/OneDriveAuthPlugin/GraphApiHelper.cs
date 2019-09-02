using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	internal static class GraphApiHelper
	{
		// Microsoft Graph-related base URLs
		internal static string BaseUrl = @"https://graph.microsoft.com/v1.0/";
		internal static string BaseGraphUrl = BaseUrl + "me/";


		internal static string GetOneDriveSessionUrl(OneDriveItem item)
		{
			return $"{BaseUrl}/drives/{item.getDriveAndId()}/createUploadSession";
		}

		internal static string GetOneDriveFileUploadUrl(string folderId, string fileName)
		{
			return $"{GetMyOneDriveUrl()}/items/{folderId}:/{fileName}:/content";
		}

		internal static string GetOneDriveChildrenUrl(OneDriveItem item)
		{
			return $"{BaseUrl}/drives/{item.getDriveAndId()}/children";
		}

		internal static string GetOneDriveChildrenUrl()
		{
			return $"{GetMyOneDriveUrl()}/root/children";
		}

		private static string getSharingId(string webUrl)
		{
			string base64Value = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(webUrl));
			return "u!" + base64Value.TrimEnd('=').Replace('/', '_').Replace('+', '-');
		}

		internal static string GetOneDriveShareUrl(string webUrl)
		{
			string sharingId = getSharingId(webUrl);
			// Construct URL for the names of the folders and files.
			return $"{BaseUrl}shares/{sharingId}/driveItem?$select=id,parentReference";
		}

		internal static string GetOneDriveItemPathsUrl(string selectedPath)
		{
			// Construct URL for the names of the folders and files.
			return $"{BaseGraphUrl}drive/root:{selectedPath}?$select=id";
		}

		internal static string GetOneDriveItemIdUrl(string id)
		{
			// Construct URL for the names of the folders and files.
			return $"{BaseUrl}drives/{id}?$select=webDavUrl,webUrl,id,name,etag,parentreference";
		}

		internal static string GetOneDriveItemContentIdUrl(string id)
		{
			// Construct URL for the names of the folders and files.
			return $"{GetOneDriveItemIdUrl(id)}/content";
		}

		internal static string GetMyOneDriveUrl()
		{
			// Construct URL for the names of the folders and files.
			return BaseGraphUrl + "drive";
		}
	}


}
