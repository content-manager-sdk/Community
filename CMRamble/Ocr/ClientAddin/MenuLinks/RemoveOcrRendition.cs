using HP.HPTRIM.SDK;
namespace CMRamble.Ocr.ClientAddin.MenuLinks
{
    public class RemoveOcrRendition : TrimMenuLink
    {
        public const int LINK_ID = 8003;
        public override int MenuID => LINK_ID;
        public override string Name => "Remove Ocr Rendition";
        public override string Description => "Remove any Ocr Renditions";
        public override bool SupportsTagged => true;
    }
}
