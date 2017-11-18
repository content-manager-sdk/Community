using HP.HPTRIM.SDK;
using CMRamble.Ocr.Core;
using System.IO;
using log4net.Config;
using System;
using System.Reflection;

namespace CMRamble.Ocr.EventProcessorAddin
{
    public class Addin : TrimEventProcessorAddIn
    {
        #region Event Processing
        public override void ProcessEvent(Database db, TrimEvent evt)
        {
            if (evt.ObjectType == BaseObjectTypes.Record)
            {
                switch (evt.EventType)
                {
                    case Events.ReindexWords:
                    case Events.DocReplaced:
                    case Events.DocAttached:
                    case Events.DocRenditionRemoved:
                    case Events.DocRenditionAdded:
                        var configFilePath = Path.Combine(AssemblyDirectory, "Log4Net.config");
                        if (File.Exists(configFilePath))
                        {
                            FileInfo fi = new FileInfo(configFilePath);
                            XmlConfigurator.ConfigureAndWatch(fi);
                        }
                        TrimEventHandler.HandleEvent(db, evt);
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

