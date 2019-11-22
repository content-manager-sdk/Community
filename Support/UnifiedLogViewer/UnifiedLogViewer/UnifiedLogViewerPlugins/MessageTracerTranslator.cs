using System;
using System.Globalization;
using System.IO;
using System.Text;
using Tailviewer.BusinessLogic.LogFiles;
using Tailviewer.Core.Parsers;

namespace UnifiedLogViewerPlugins
{
    public class MessageTracerTranslator : ILogLineTranslator, ITimestampParser
    {
        private  int[] _columnLengths;

        public const int TimestampLength = 26;
        public const int ClockLength = 6;
        public const int TimeProcessLength = 13;
        public const int ModuleProcessLength = 15;
        public const int ModuleCodeLength = 4;
        public const int InstanceLength = 9;
        public const int SourceIdLength = 6;
        public const int TargetIdLength = 9;
        public const int MessageTypeLength = 9;
        public static string todayDate=string.Empty;

        public int MinimumLength => throw new NotImplementedException();

        public  MessageTracerTranslator()
        {
            _columnLengths = new[]
            {
                TimestampLength,
                ClockLength,
                TimeProcessLength,
                ModuleProcessLength,
                ModuleCodeLength,
                InstanceLength,
                SourceIdLength,
                TargetIdLength,
                MessageTypeLength,
                1,
                1,
                1,
                1,
                1,
                2
            };
        }

        public LogLine Translate(ILogFile logFile, LogLine line)
        {
            if(Path.GetFileName(logFile.ToString()).Contains("TRIMWorkgroup") && string.IsNullOrEmpty(todayDate))
            {
                string fileName = (Path.GetFileName(logFile.ToString()));
                todayDate = fileName.Replace("TRIMWorkgroup", "").Replace("_","-").Replace(".log","").Trim();
            }
            if (line.OriginalLineIndex == 0)
                return TranslateHeader(line);

            return TranslateLogLine(line);
        }

        private LogLine TranslateHeader(LogLine line)
        {
            return MakeTabular(line, Alignment.Center);
        }

        private LogLine TranslateLogLine(LogLine line)
        {
            var next = ReplaceTimestamp(line);
            return MakeTabular(next, Alignment.Right);
        }

        private LogLine ReplaceTimestamp(LogLine line)
        {
            var timestamp = line.Timestamp;            
            var message = line.Message;           
            DateTime newTimestamp1=DateTime.Now;
            if (string.IsNullOrEmpty(timestamp.ToString()))
            {
                timestamp = newTimestamp1;
            }
            var datetime = DateTime.Parse(timestamp.ToString()).ToString("yyyy/dd/MM hh:mm:ss tt");
           
            DateTime.TryParseExact(datetime,
                                   "yyyy/MM/dd hh:mm:ss tt",
                                   CultureInfo.InvariantCulture,
                                   DateTimeStyles.None,
                                   out newTimestamp1);            
            var nonTimestampPart =!string.IsNullOrEmpty(message)?message.Substring(MessageTracerTranslator.TimestampLength):string.Empty;
            var desiredMessage = string.Format("{0}{1}{2}", newTimestamp1," ", nonTimestampPart);
            return new LogLine(line.LineIndex, line.OriginalLineIndex, line.LogEntryIndex, desiredMessage,
                                           line.Level,
                                           line.Timestamp);
        }

        enum Alignment
        {
            Center,
            Right
        }

        private LogLine MakeTabular(LogLine line, Alignment alignment)
        {
            var columns = line.Message.Split(';');
            var header = new StringBuilder(line.Message.Length);
            for (int i = 0; i < columns.Length; ++i)
            {
                if (i != 0)
                    header.Append(";");

                var column = columns[i];
                var length = i < _columnLengths.Length ? _columnLengths[i] : column.Length;
                if (length > column.Length)
                {
                    var padding = length - column.Length;

                    switch (alignment)
                    {
                        case Alignment.Center:
                            var leftPadding = padding / 2;
                            var rightPadding = padding - leftPadding;
                            header.Append(' ', leftPadding);
                            header.Append(column);
                            header.Append(' ', rightPadding);
                            break;

                        case Alignment.Right:
                            header.Append(' ', padding);
                            header.Append(column);
                            break;
                    }


                }
                else
                {
                    header.Append(column);
                }
            }

            return new LogLine(line.LineIndex, line.LogEntryIndex, header.ToString(), line.Level);
        }

        public bool TryParse(string content, out DateTime timestamp)
        {
            throw new NotImplementedException();
        }
    }

}

