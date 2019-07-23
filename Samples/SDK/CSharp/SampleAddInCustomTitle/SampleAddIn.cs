using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Forms;

using HP.HPTRIM.SDK;

namespace SampleAddIn
{
	   

	public class SampleAddInCustomTitle : ITrimAddIn
	{
		/*
		 * Member variables
		 */

		private StringBuilder m_errorMsg;



		/*
		 * Public Methods
		 */
		public override string ErrorMessage { get { return m_errorMsg.ToString(); } }

		public override void Initialise(Database db)
		{
			m_errorMsg = new StringBuilder();
			SDKLoader.load();
	
		}

		public override TrimMenuLink[] GetMenuLinks()
		{

			return new TrimMenuLink[0];
		}

		public override bool IsMenuItemEnabled(int cmdId, TrimMainObject forObject)
		{

			return false;
		}

		public override void ExecuteLink(int cmdId, TrimMainObject forObject, ref bool itemWasChanged)
		{


		}

		public override void ExecuteLink(int cmdId, TrimMainObjectSearch forTaggedObjects)
		{


		}

		public override void PostDelete(TrimMainObject deletedObject)
		{

		}

		public override void PostSave(TrimMainObject savedObject, bool itemWasJustCreated)
		{


		}

		public override bool PreDelete(TrimMainObject modifiedObject)
		{
			return true;
		}


		private static bool enumTryParse(string name, out PropertyIds propertyId)
		{
			propertyId = PropertyIds.Unknown;

			try
			{
				propertyId = (PropertyIds)System.Enum.Parse(typeof(PropertyIds), name, true);
				return true;
			}
			catch
			{
				return false;
			}
		}

		public static string replacePlaceHolder(Record record, Match m)
		{
			PropertyIds propertyId = PropertyIds.Unknown;

			if (enumTryParse($"Record{m.Groups[1]}", out propertyId))
			{
				if (record.GetProperty(propertyId) != null)
				{
					return record.GetPropertyAsString(propertyId, StringDisplayType.TreeColumn, false);
				}
			}
			else
			{
				using (Database db = record.Database)
				{
					FieldDefinition fieldDef = FieldDefinition.FindFieldBySearchClauseName(db, BaseObjectTypes.Record, m.Groups[1].Value);

					if (fieldDef == null)
					{
						fieldDef = db.FindTrimObjectByName(BaseObjectTypes.FieldDefinition, m.Groups[1].Value) as FieldDefinition;
					}

					if (fieldDef != null)
					{
						if (record.GetFieldValue(fieldDef) != null)
						{
							return record.GetFieldValueAsString(fieldDef, StringDisplayType.TreeColumn, false);
						}
					}
				}
			}

			return m.Value;
		}

		private string titleTemplate = "Include properties using elements such as <Author> <Address> or <DateCreated>.";

		public override bool PreSave(TrimMainObject modifiedObject)
		{
			Record record = modifiedObject as Record;

			if (record != null)
			{
				if (record.Title == titleTemplates[$"{record.RecordType.Name}_CustomTitleConfig"])
				{
					m_errorMsg.Append( "Please set Title before saving.");
					return false;
				}
				else
				{

					record.Title = Regex.Replace(record.Title, "<(.*?)>", new MatchEvaluator(match => replacePlaceHolder(record, match)));
				}
			}
			return true;
		}

		public override bool SelectFieldValue(FieldDefinition field, TrimMainObject trimObject, string previousValue)
		{
			return false;
		}

		private Dictionary<string, string> titleTemplates = new Dictionary<string, string>();

		public override void Setup(TrimMainObject newObject)
		{

			Record record = newObject as Record;

			if (record != null && string.IsNullOrEmpty(record.Title))
			{
				string key = $"{record.RecordType.Name}_CustomTitleConfig";


				if (!titleTemplates.ContainsKey(key))
				{
					using (Database db = record.Database)
					{
						FieldDefinition fieldDef = db.FindTrimObjectByName(BaseObjectTypes.FieldDefinition, key) as FieldDefinition;

						if (fieldDef == null)
						{
							fieldDef = db.FindTrimObjectByName(BaseObjectTypes.FieldDefinition, "CustomTitleConfig") as FieldDefinition;
						}
						if (fieldDef != null)
						{
							titleTemplates[key] = fieldDef.DefaultValue.AsString();
						} else
						{
							titleTemplates[key] = titleTemplate;
						}
					}
				}

				record.Title = titleTemplates[key];

			}
		}

		public override bool SupportsField(FieldDefinition field)
		{

			return false;
		}

		public override bool VerifyFieldValue(FieldDefinition field, TrimMainObject trimObject, string newValue)
		{

			return true;
		}
	}
}
