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
		internal static string BaseGraphUrl = @"https://graph.microsoft.com/v1.0/me/";
		internal static string GetFilesUrl = BaseGraphUrl +@"me/drive/root/children";

		internal static string GetOneDriveItemNamesUrl(string selectedProperties)
		{
			// Construct URL for the names of the folders and files.
			return GetFilesUrl + selectedProperties;
		}

		internal static string GetOneDriveItemPathsUrl(string selectedPath)
		{
			// Construct URL for the names of the folders and files.
			return $"{BaseGraphUrl}/drive/root:/{selectedPath}";
		}

		internal static string GetOneDriveItemIdsUrl(string id)
		{
			// Construct URL for the names of the folders and files.
			return $"{BaseGraphUrl}/drive/items/{id}";
		}

		internal static string GetMyOneDriveUrl()
		{
			// Construct URL for the names of the folders and files.
			return BaseGraphUrl + "/drive";
		}
	}


}
