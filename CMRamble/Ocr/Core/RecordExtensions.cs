using HP.HPTRIM.SDK;
namespace CMRamble.Ocr.Core
{
    public static class RecordExtensions
    {
        public static void AddOcrRendition(this Record record, string fileName)
        {
            if (record.HasOcrRendition()) record.RemoveOcrRendition();
            record.ChildRenditions.NewRendition(fileName, RenditionType.Ocr, "Ocr");
        }
        public static bool RemoveOcrRendition(this Record record)
        {
            bool removed = false;
            for (uint i = 0; i < record.ChildRenditions.Count; i++)
            {
                RecordRendition rendition = record.ChildRenditions.getItem(i) as RecordRendition;
                if ((RecordRendition)rendition != null && rendition.TypeOfRendition == RenditionType.Ocr)
                {
                    rendition.Delete();
                    removed = true;
                }
            }
            record.Save();
            return removed;
        }
        public static bool HasOcrRendition(this Record record)
        {
            for (uint i = 0; i < record.ChildRenditions.Count; i++)
            {
                RecordRendition rendition = record.ChildRenditions.getItem(i) as RecordRendition;
                if ((RecordRendition)rendition != null && rendition.TypeOfRendition == RenditionType.Ocr)
                {
                    return true;
                }
            }
            return false;
        }
    }
}
