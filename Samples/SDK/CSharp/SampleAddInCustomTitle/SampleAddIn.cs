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
	public class SampleMenuLink : TrimMenuLink
	{
		public SampleMenuLink()
		{
		}

		// Summary:
		//     Gets a string that should appear as a tool tip when hovering over a menu
		//     item
		public override string Description
		{
			get { return "Select this menu item to run the sample link and see the log."; }
		}

		//
		// Summary:
		//     Gets an ID number that identifies this menu item.
		public override int MenuID
		{
			get { return 42; }
		}

		//
		// Summary:
		//     Gets a string that should appear on the context menu.
		public override string Name
		{
			get { return "Sample Menu String (Show Log)"; }
		}
		//
		// Summary:
		//     Gets a boolean value indicating whether this menu item supports TRIM tagged
		//     processing
		public override bool SupportsTagged
		{
			get { return false; }
		}
	};

	public class SampleMenuLinkTagged : TrimMenuLink
	{
		public SampleMenuLinkTagged()
		{
		}

		// Summary:
		//     Gets a string that should appear as a tool tip when hovering over a menu
		//     item
		public override string Description
		{
			get { return "Select this menu item to run the tagged sample link and see the log."; }
		}

		//
		// Summary:
		//     Gets an ID number that identifies this menu item.
		public override int MenuID
		{
			get { return 43; }
		}

		//
		// Summary:
		//     Gets a string that should appear on the context menu.
		public override string Name
		{
			get { return "Sample Tagged Menu String (Show Log Tagged)"; }
		}
		//
		// Summary:
		//     Gets a boolean value indicating whether this menu item supports TRIM tagged
		//     processing
		public override bool SupportsTagged
		{
			get { return true; }
		}
	};

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




		public static string replacePlaceHolder(Record record, Match m)
		{
			PropertyIds propertyId = PropertyIds.Unknown;
			
			if (System.Enum.TryParse<PropertyIds>($"Record{m.Groups[1]}", out propertyId))
			{
				if (record.GetProperty(propertyId) != null)
				{
					return record.GetPropertyAsString(propertyId, StringDisplayType.TreeColumn, false);
				}
			}
			else
			{
				FieldDefinition fieldDef = FieldDefinition.FindFieldBySearchClauseName(record.Database, BaseObjectTypes.Record, m.Groups[1].Value);

				if (fieldDef == null)
				{
					fieldDef = record.Database.FindTrimObjectByName(BaseObjectTypes.FieldDefinition, m.Groups[1].Value) as FieldDefinition;
				}

				if (fieldDef != null)
				{
					if (record.GetFieldValue(fieldDef) != null)
					{
						return record.GetFieldValueAsString(fieldDef, StringDisplayType.TreeColumn, false);
					}
				}
			}

			return m.Value;
		}

		public override bool PreSave(TrimMainObject modifiedObject)
		{
			Record record = modifiedObject as Record;

			if (record != null)
			{
				record.Title = Regex.Replace(record.Title, "<(.*?)>", new MatchEvaluator(match => replacePlaceHolder(record, match)));
			}
			return true;
		}

		public override bool SelectFieldValue(FieldDefinition field, TrimMainObject trimObject, string previousValue)
		{
			return false;
		}

		public override void Setup(TrimMainObject newObject)
		{

			Record record = newObject as Record;

			if (record != null && string.IsNullOrWhiteSpace(record.Title))
			{
				record.Title = "<Activity> <Author> <Addressee> <Subject> <AdditionalInformation> <DateCreated>";

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
