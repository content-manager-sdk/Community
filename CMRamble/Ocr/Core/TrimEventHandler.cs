using HP.HPTRIM.SDK;
using log4net;

namespace CMRamble.Ocr.Core
{
    public static class TrimEventHandler
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(TrimEventHandler));
        #region Ocr Features
        public static void HandleEvent(Database db, TrimEvent evt)
        {
            Record record = null;
            RecordRendition rendition = null;
            try
            {
                record = db.FindTrimObjectByUri(BaseObjectTypes.Record, evt.ObjectUri) as Record;
                if ( evt.RelatedObjectType == BaseObjectTypes.RecordRendition && evt.EventType == Events.DocRenditionAdded)
                {
                    var eventRendition = record.ChildRenditions.FindChildByUri(evt.RelatedObjectUri) as RecordRendition;
                    if (eventRendition != null && eventRendition.TypeOfRendition == RenditionType.Original)
                    {   // if added an original
                        rendition = eventRendition;
                    }
                }
                if ( rendition != null )
                {
                    RecordController.GenerateOcrRendition(record, rendition);
                }
                else
                {
                    RecordController.UpdateOcrRendition(record);
                }
            }
            catch (TrimException ex)
            {
                Log.Error(ex);
            }
            finally
            {
                record = null;
                rendition = null;
            }
        }
        #endregion
    }
}
