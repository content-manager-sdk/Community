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

		public const string EXT_PROP_URN_GUID = "{0708434C-2E95-41C8-992F-8EE34B796FEC}";
		public const string OUTLOOK_MAPI_PROP_URN_GUID = "{00020386-0000-0000-C000-000000000046}";

		public const string EXT_PROP_RECORD_URN_NAME = "HPRM_RECORD_URN";


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

		public static string GetEMLUrl(string mailId)
		{
			// Construct URL for the names of the folders and files.
			return $"{BaseGraphUrl}messages/{mailId}/$value";
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

		public static string GetOneDriveItemContentIdUrl(string id, string format = null)
		{
			string url = $"{BaseUrl}drives/{id}/content";

			if (format == null)
			{
				return url;
			} else
			{
				return url + "?format=" + format;
			}

		}

		public static string GetMyOneDriveUrl()
		{
			// Construct URL for the names of the folders and files.
			return BaseGraphUrl + "drive";
		}

		public static string IDPropName()
		{
			return $"String {EXT_PROP_URN_GUID} Name {EXT_PROP_RECORD_URN_NAME}";
		}

		public static string IDPropNameForMAPIUri()
		{
			return $"String {OUTLOOK_MAPI_PROP_URN_GUID} Name HPTrimRecordUri";
		}

		public static string IDPropNameForMAPIBIID()
		{
			return $"String {OUTLOOK_MAPI_PROP_URN_GUID} Name HPTrimDataset";
		}


		public static string GetMailItemURL(string mailId)
		{

				return $"{BaseGraphUrl}messages/{mailId}?$expand=singleValueExtendedProperties($filter=id eq '{IDPropName()}' or id eq '{IDPropNameForMAPIBIID()}' or id eq '{IDPropNameForMAPIUri()}')";

		}

	}


}
