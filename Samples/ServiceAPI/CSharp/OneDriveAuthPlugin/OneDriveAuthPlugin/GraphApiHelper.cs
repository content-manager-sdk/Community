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
		internal static string GetFilesUrl = @"https://graph.microsoft.com/v1.0/me/drive/root/children";

		internal static string GetOneDriveItemNamesUrl(string selectedProperties)
		{
			// Construct URL for the names of the folders and files.
			return GetFilesUrl + selectedProperties;
		}
	}
}
