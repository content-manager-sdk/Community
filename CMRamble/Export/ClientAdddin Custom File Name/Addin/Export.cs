using System;
using HP.HPTRIM.SDK;
using System.Windows.Forms;
using System.IO;

namespace CMRamble.Addin.Record.Export
{
    public class Addin : ITrimAddIn
    {

        #region Private members
        private string errorMessage;
        private TrimMenuLink[] links;
        #endregion

        #region Public Properties
        public override string ErrorMessage => errorMessage;
        #endregion

        #region Initialization
        public override void Initialise(Database db)
        {
            links = new TrimMenuLink[1] { new ExportRecordMenuLink() };
        }
        public override void Setup(TrimMainObject newObject)
        {
        }
        #endregion

        #region External Link
        public override TrimMenuLink[] GetMenuLinks()
        {
            return links;
        }
        public override bool IsMenuItemEnabled(int cmdId, TrimMainObject forObject)
        {
            return (links[0].MenuID == cmdId && forObject.TrimType == BaseObjectTypes.Record && ((HP.HPTRIM.SDK.Record)forObject).IsElectronic);
        }
        public override void ExecuteLink(int cmdId, TrimMainObject forObject, ref bool itemWasChanged)
        {
            HP.HPTRIM.SDK.Record record = forObject as HP.HPTRIM.SDK.Record;
            if ( (HP.HPTRIM.SDK.Record)record != null && links[0].MenuID == cmdId )
            {
                FolderBrowserDialog directorySelector = new FolderBrowserDialog() { Description = "Select a directory to place the electronic documents", ShowNewFolderButton = true };
                if (directorySelector.ShowDialog() == DialogResult.OK)
                {
                    string outputPath = Path.Combine(directorySelector.SelectedPath, $"{record.Number}.{record.Extension}");
                    record.GetDocument(outputPath, false, string.Empty, string.Empty);
                }
            }
        }
        public override void ExecuteLink(int cmdId, TrimMainObjectSearch forTaggedObjects)
        {
            if ( links[0].MenuID == cmdId )
            {
                FolderBrowserDialog directorySelector = new FolderBrowserDialog() { Description = "Select a directory to place the electronic documents", ShowNewFolderButton = true };
                if (directorySelector.ShowDialog() == DialogResult.OK)
                {
                    foreach (var taggedObject in forTaggedObjects)
                    {
                        HP.HPTRIM.SDK.Record record = taggedObject as HP.HPTRIM.SDK.Record;
                        if ((HP.HPTRIM.SDK.Record)record != null)
                        {
                            string outputPath = Path.Combine(directorySelector.SelectedPath, $"{record.Number}.{record.Extension}");
                            record.GetDocument(outputPath, false, string.Empty, string.Empty);
                        }
                    }
                }
            }
        }
        #endregion

        #region Save and Delete Events
        public override bool PreSave(TrimMainObject modifiedObject)
        {
            return true;
        }
        public override void PostSave(TrimMainObject savedObject, bool itemWasJustCreated)
        {
        }
        public override bool PreDelete(TrimMainObject modifiedObject)
        {
            return true;
        }

        public override void PostDelete(TrimMainObject deletedObject)
        {
        }
        #endregion

        #region Field Customization
        public override bool SelectFieldValue(FieldDefinition field, TrimMainObject trimObject, string previousValue)
        {
            return false;
        }
        public override bool SupportsField(FieldDefinition field)
        {
            return false;
        }
        public override bool VerifyFieldValue(FieldDefinition field, TrimMainObject trimObject, string newValue)
        {
            return false;
        } 
        #endregion
    }
}
