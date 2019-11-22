using HP.HPTRIM.SDK;
using OneDriveAuthPlugin;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace OneDriveConnector
{
	public static class Extensions
	{
		public static string GetDriveId(this Record record)
		{
			return record.GetFieldValueAsString(new FieldDefinition(record.Database, "DriveID"), StringDisplayType.Default, false);
		}

		public static void SetDriveId(this Record record, string id)
		{
			record.SetFieldValue(new FieldDefinition(record.Database, "DriveID"), new UserFieldValue(id));
		}

		public static TrimSearchClause GetDriveIdSearchClause(this string id, Database database)
		{
			TrimSearchClause clause = new TrimSearchClause(database, BaseObjectTypes.Record, new FieldDefinition(database, "DriveID"));
			clause.SetCriteriaFromString(id);

			return clause;
		}

		public static void AddDeleteNowSearchClause(this TrimMainObjectSearch search)
		{
			TrimSearchClause clause = new TrimSearchClause(search.Database, BaseObjectTypes.Record, new FieldDefinition(search.Database, "DeleteNow"));

			search.AddSearchClause(clause);
		}

		public static void SetDeleteNow(this Record record, bool value = true)
		{
			record.SetFieldValue(new FieldDefinition(record.Database, "DeleteNow"), new UserFieldValue(value));
		}

		public static bool GetDeleteNow(this Record record)
		{
		return	record.GetFieldValue(new FieldDefinition(record.Database, "DeleteNow")).AsBool();
		}

		public static string GetFileName(this Record record, string extension = null)
		{
			Regex pattern = new Regex("[\\\\/<>|?]|[\n]{2}");

			if (extension == null)
			{
				extension = Path.GetExtension(record.SuggestedFileName);
			}

			extension = "." + extension.TrimStart('.');

			return $"{Path.GetFileNameWithoutExtension(record.SuggestedFileName)} ({pattern.Replace(record.Number, "_")}){extension}";
		}

		public static async Task CheckinFromDrive(this Record record, string driveId, string token, bool saveRecord = false)
		{
			string downloadUrl = GraphApiHelper.GetOneDriveItemContentIdUrl(driveId);

			var fileResult = await ODataHelper.GetItem<OneDriveItem>(GraphApiHelper.GetOneDriveItemIdUrl(driveId), token, null);

			string filePath = Path.Combine(TrimApplication.WebServerWorkPath, fileResult.Name);


			await ODataHelper.GetItem<string>(downloadUrl, token, filePath);

			var inputDocument = new InputDocument(filePath);


			inputDocument.CheckinAs = record.SuggestedFileName;
			record.SetDocument(inputDocument, true, false, "checkin from Word Online");

			string pdfPath = Path.Combine(TrimApplication.WebServerWorkPath, Path.ChangeExtension(fileResult.Name, "pdf"));
			string pdfUrl = GraphApiHelper.GetOneDriveItemContentIdUrl(driveId, "pdf");
			await ODataHelper.GetItem<string>(pdfUrl, token, pdfPath);


			var rendition = record.ChildRenditions.NewRendition(pdfPath, RenditionType.Longevity, "Preview");


			if (saveRecord)
			{
				record.Save();

				File.Delete(filePath);
				File.Delete(pdfPath);
			}
			return;
		}
	}
}
