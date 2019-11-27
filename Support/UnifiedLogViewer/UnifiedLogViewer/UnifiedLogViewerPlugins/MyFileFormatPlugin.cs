using System;
using System.Collections.Generic;
using System.Threading;
using Tailviewer;
using Tailviewer.BusinessLogic.LogFiles;
using Tailviewer.BusinessLogic.Plugins;
using Tailviewer.Core.LogFiles;

namespace UnifiedLogViewerPlugins
{
    public class MyFileFormatPlugin : IFileFormatPlugin
    {       
        public IReadOnlyList<string> SupportedExtensions => new[] { ".log" };

        public ILogFile Open(IServiceContainer services, string fileName)
        {
            services.RegisterInstance<ITimestampParser>(new MyTimestampParser());
            services.RegisterInstance<ILogLineTranslator>(new MyTimestampTranslator());
            return services.CreateTextLogFile(fileName);
        }
    }
}
