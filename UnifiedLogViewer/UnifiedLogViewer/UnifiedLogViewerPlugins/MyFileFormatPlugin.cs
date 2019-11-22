using System;
using System.Collections.Generic;
using System.Threading;
using Tailviewer.BusinessLogic.LogFiles;
using Tailviewer.BusinessLogic.Plugins;
using Tailviewer.Core.LogFiles;

namespace UnifiedLogViewerPlugins
{
    public class MyFileFormatPlugin : IFileFormatPlugin
    {       
        public IReadOnlyList<string> SupportedExtensions => new[] { ".log" };

        public ILogFile Open(string fileName, ITaskScheduler taskScheduler)
        {           
            //ILogLineTranslator il = new MessageTracerTranslator();
            //return new Tailviewer.Core.LogFiles.TextLogFile(taskScheduler,fileName,null, il, null);

            return new TextLogFile(taskScheduler, fileName,new MyTimestampParser(),new MyTimestampTranslator());
        }
    }
}
