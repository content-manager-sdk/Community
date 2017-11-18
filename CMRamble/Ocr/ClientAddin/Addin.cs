using CMRamble.Ocr.Core;
using HP.HPTRIM.SDK;
using log4net.Config;
using System;
using System.IO;
using System.Reflection;

namespace CMRamble.Ocr.ClientAddin
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
            links = new TrimMenuLink[2] { new MenuLinks.UpdateOcrRendition(), new MenuLinks.RemoveOcrRendition() };

            var configFilePath = Path.Combine(AssemblyDirectory, "Log4Net.config");
            if (File.Exists(configFilePath))
            {
                FileInfo fi = new FileInfo(configFilePath);
                XmlConfigurator.ConfigureAndWatch(fi);
            }
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
            switch (cmdId)
            {
                case MenuLinks.UpdateOcrRendition.LINK_ID:
                    return forObject.TrimType == BaseObjectTypes.Record && ((HP.HPTRIM.SDK.Record)forObject).IsElectronic;
                case MenuLinks.RemoveOcrRendition.LINK_ID:
                    return forObject.TrimType == BaseObjectTypes.Record && ((Record)forObject).HasOcrRendition();
                default:
                    return false;
            }
        }

        public override void ExecuteLink(int cmdId, TrimMainObject forObject, ref bool itemWasChanged)
        {
            HP.HPTRIM.SDK.Record record = forObject as HP.HPTRIM.SDK.Record;
            if ((HP.HPTRIM.SDK.Record)record != null)
            {
                switch (cmdId)
                {
                    case MenuLinks.UpdateOcrRendition.LINK_ID:
                        RecordController.UpdateOcrRendition(record);
                        break;
                    case MenuLinks.RemoveOcrRendition.LINK_ID:
                        RecordController.RemoveOcrRendition(record);
                        break;
                    default:
                        break;
                }
            }
        }
        public override void ExecuteLink(int cmdId, TrimMainObjectSearch forTaggedObjects)
        {
            switch (cmdId)
            {
                case MenuLinks.UpdateOcrRendition.LINK_ID:
                    RecordController.UpdateOcrRenditions(forTaggedObjects);
                    break;
                case MenuLinks.RemoveOcrRendition.LINK_ID:
                    RecordController.RemoveOcrRenditions(forTaggedObjects);
                    break;
                default:
                    break;
            }
        }
        #endregion

        #region Record Events
        public override bool PreSave(TrimMainObject modifiedObject)
        {
            return true;
        }

        public override void PostSave(TrimMainObject savedObject, bool itemWasJustCreated)
        {
            return;
        }

        public override bool PreDelete(TrimMainObject modifiedObject)
        {
            return false;
        }

        public override void PostDelete(TrimMainObject deletedObject)
        {
        }

        public override bool SupportsField(FieldDefinition field)
        {
            return false;
        }

        public override bool SelectFieldValue(FieldDefinition field, TrimMainObject trimObject, string previousValue)
        {
            return false;
        }

        public override bool VerifyFieldValue(FieldDefinition field, TrimMainObject trimObject, string newValue)
        {
            return false;
        }
        #endregion

        public static string AssemblyDirectory
        {
            get
            {
                string codeBase = Assembly.GetExecutingAssembly().CodeBase;
                UriBuilder uri = new UriBuilder(codeBase);
                string path = Uri.UnescapeDataString(uri.Path);
                return Path.GetDirectoryName(path);
            }
        }
    }
}
