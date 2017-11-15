using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HP.HPTRIM.SDK;

namespace CMRamble.Addin.RecordExport
{
    public class Addin : ITrimAddIn
    {
        private string errorMessage;
        private List<TrimMenuLink> links;
        public override string ErrorMessage => errorMessage;

        public override void ExecuteLink(int cmdId, TrimMainObject forObject, ref bool itemWasChanged)
        {
        }

        public override void ExecuteLink(int cmdId, TrimMainObjectSearch forTaggedObjects)
        {
        }

        public override TrimMenuLink[] GetMenuLinks() => links.ToArray();

        public override void Initialise(Database db)
        {
            links = new List<TrimMenuLink>();
            links.Add(new ExportDocumentWithRecordNumberFileNameMenuLink());
        }

        public override bool IsMenuItemEnabled(int cmdId, TrimMainObject forObject)
        {
            var menuItem = links.FirstOrDefault(x => x.MenuID == cmdId);
            if ( menuItem != null && menuItem is IMenuLinkEnabled )
            {
                return ((IMenuLinkEnabled)menuItem).IsEnabled(forObject);
            }

            return false;
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

        public override bool PreSave(TrimMainObject modifiedObject)
        {
            return true;
        }

        public override bool SelectFieldValue(FieldDefinition field, TrimMainObject trimObject, string previousValue)
        {
            return false;
        }


        public override void Setup(TrimMainObject newObject)
        {
        }

        public override bool SupportsField(FieldDefinition field)
        {
            return false;
        }

        public override bool VerifyFieldValue(FieldDefinition field, TrimMainObject trimObject, string newValue)
        {
            return false;
        }
    }
}
