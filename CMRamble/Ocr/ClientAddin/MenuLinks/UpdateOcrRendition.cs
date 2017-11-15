using HP.HPTRIM.SDK;

namespace CMRamble.Ocr.ClientAddin.MenuLinks
{
    public class UpdateOcrRendition : TrimMenuLink
    {
        public const int LINK_ID = 8002;
        public override int MenuID => LINK_ID;
        public override string Name => "Update Ocr Rendition";
        public override string Description => "Uses the document content to generate OCR text";
        public override bool SupportsTagged => true;

    }
}
