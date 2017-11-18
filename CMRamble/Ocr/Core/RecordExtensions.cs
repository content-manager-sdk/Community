using HP.HPTRIM.SDK;
using log4net;

namespace CMRamble.Ocr.Core
{
    public static class RecordExtensions
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(RecordExtensions));
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
                    Log.Debug($"Remove Rendition {rendition.Uri} from Record {record.Uri}");
                    rendition.Delete();
                    removed = true;
                }
            }
            if ( removed )
            {
                record.Save();
                Log.Info($"Removed Ocr rendition from record {record.Uri}");
            }
            else
            {
                Log.Info($"No Ocr Rendition on record {record.Uri}");
            }
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
