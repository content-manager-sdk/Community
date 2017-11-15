using CMRamble.Ocr.Core;
using HP.HPTRIM.SDK;
using System;
using System.IO;
using System.Reflection;

namespace CMRamble.Ocr.EventProcessorAddin
{
    public class Addin : TrimEventProcessorAddIn
    {
        #region Event Processing
        public override void ProcessEvent(Database db, TrimEvent evt)
        {
            Record record = null;
            RecordRendition rendition;
            if (evt.ObjectType == BaseObjectTypes.Record)
            {
                switch (evt.EventType)
                {
                    case Events.ReindexWords:
                    case Events.DocReplaced:
                    case Events.DocAttached:
                    case Events.DocRenditionRemoved:
                        record = db.FindTrimObjectByUri(BaseObjectTypes.Record, evt.ObjectUri) as Record;
                        RecordController.UpdateOcrRendition(record, AssemblyDirectory);
                        break;
                    case Events.DocRenditionAdded:
                        record = db.FindTrimObjectByUri(BaseObjectTypes.Record, evt.ObjectUri) as Record;
                        var eventRendition = record.ChildRenditions.FindChildByUri(evt.RelatedObjectUri) as RecordRendition;
                        if ( eventRendition != null && eventRendition.TypeOfRendition == RenditionType.Original )
                        {   // if added an original
                            rendition = eventRendition;
                            RecordController.OcrRendition(record, rendition, Path.Combine(AssemblyDirectory, "tessdata\\"));
                        }
                        break;
                    default:
                        break;
                }
            }
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

