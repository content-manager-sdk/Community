using HP.HPTRIM.SDK;

namespace CMRamble.Addin.Record.Export
{
    public class ExportRecordMenuLink : TrimMenuLink
    {
        public override int MenuID => 8001;

        public override string Name => "Export Record";

        public override string Description => "Exports records to disk using Record Number as file name";

        public override bool SupportsTagged => true;
    }
}
