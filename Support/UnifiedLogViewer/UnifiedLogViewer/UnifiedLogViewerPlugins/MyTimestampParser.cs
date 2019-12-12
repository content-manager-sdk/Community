using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tailviewer.BusinessLogic;
using Tailviewer.BusinessLogic.LogFiles;
using Tailviewer.Core.Parsers;

namespace UnifiedLogViewerPlugins
{
    /// <summary>
    ///     This class is only responsible for parsing the timestamps of this custom format into a DateTime so that Tailviewer
    ///     is able to merge two or more log files using this timestamp format.
    /// </summary>
    public class MyTimestampParser : ITimestampParser
    {
        public static string timestmp { get; set; }
        public static string Filename { get; set; }

        public int MinimumLength => throw new NotImplementedException();

        public bool TryParse(string content, out DateTime timestamp)
        {
            if (!string.IsNullOrEmpty(Filename) && Path.GetFileName(Filename).Contains("TRIMWorkgroup"))
            {
                return TryParse12CharacterTimestamp(content, out timestamp);
            }
            if (!string.IsNullOrEmpty(Filename) && Path.GetFileName(Filename).Contains("TRIMEvent"))
            {
                return TryParse12CharacterTimestamp(content, out timestamp);
            }

            else if (TryParse24CharacterTimestamp(content, out timestamp))
                return true;

            else if (TryParse23CharacterTimestamp(content, out timestamp))
                return true;

            return false;
        }

        private string[] SupportedFormats()
        {
            return new[]
            {
                "yyyy-MM-dd HH:mm:ss:fff",
                "dd/MM/yyyy HH:mm:ss:fff",
                "MM/dd/yyyy HH:mm:ss:fff",
                "M/dd/yyyy HH:mm:ss:fff",
                "M/d/yyyy HH:mm:ss:fff",
                "MM/dd/yy HH:mm:ss:fff",
                "M/d/yy HH:mm:ss:fff",
                "dd-MMM-yy HH:mm:ss:fff"
            };
        }
        private bool TryParse23CharacterTimestamp(string content, out DateTime timestamp)
        {
            // Example strings:
            // "2019-03-18 14:09:54:177"
            // "29/03/2019 14:09:54:177"

            const int timestampPartLength = 23;
            var formats = SupportedFormats();          ;
            return TryParseExact(content, timestampPartLength, formats, out timestamp);
        }

        private bool TryParse24CharacterTimestamp(string content, out DateTime timestamp)
        {
            // Example strings:
            // "2019-03-18  14:09:54:177"
            // "29/03/2019  14:09:54:177"

            const int timestampPartLength = 24;
            var formats = SupportedFormats();

            return TryParseExact(content, timestampPartLength, formats, out timestamp);
        }

        private bool TryParse12CharacterTimestamp(string content, out DateTime timestamp)
        {
            // Example strings:
            // "2019-03-18  14:09:54:177"
            // "29/03/2019  14:09:54:177"

            const int timestampPartLength = 24;
            var formats = SupportedFormats();

            return TryParseExactForTRIMWorkgroup(content, timestampPartLength, formats, out timestamp);
        }

        private static bool TryParseExact(string content, int timestampPartLength, string[] formats,
            out DateTime timestamp)
        {
            if (content.Length < timestampPartLength)
            {
                timestamp = DateTime.MinValue;
                return false;
            }

            var timestampPart = content.Substring(0, timestampPartLength);
            if(timestampPart.Contains("\t"))
            {
                timestampPart.Replace("\t","").Trim();
            }
            return DateTime.TryParseExact(timestampPart, formats, CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeLocal,
                out timestamp);
        }

        private static bool TryParseExactForTRIMWorkgroup(string content, int timestampPartLength, string[] formats,
           out DateTime timestamp)
        {
            string newTimestamp;
            if (content.Length < timestampPartLength)
            {
                timestamp = DateTime.MinValue;
                return false;
            }

            var timestampPart = content.Substring(0, 12);          

            if (timestampPart.Contains("\t"))
            {
                timestampPart.Replace("\t", "").Trim();
            }

            if (timestampPart.Contains("TRIMWorkgrou"))
            {
                 newTimestamp = String.Format("{0:yyyy-MM-dd HH:mm:ss:fff}", DateTime.Parse(timestmp));
            }
            else
            {
                 newTimestamp = String.Format("{0:yyyy-MM-dd HH:mm:ss:fff}{1}{2}", DateTime.Parse(timestmp).ToShortDateString(), " ", timestampPart);
            }

            var res = DateTime.TryParseExact(newTimestamp, formats, CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeLocal,
                out timestamp);           

            return res;
        }

    }

    /// <summary>
    ///     This class is responsible for displaying timestamps in a common format.
    /// </summary>
    public class MyTimestampTranslator : ILogLineTranslator
    {        
        public string todayDate = string.Empty;
        public string newTimestamp;
        int indexOfSecondSpace;
        public LogLine Translate(ILogFile logFile, LogLine line)
        {

            MyTimestampParser.Filename = logFile.ToString();
            if (Path.GetFileName(logFile.ToString()).Contains("TRIMWorkgroup"))
            {
                return WorkGroupServerLog(logFile, line);
            }
            else if (Path.GetFileName(logFile.ToString()).Contains("OfficeIntegration"))
            {
                return OfficeIntegrationLog(line);
            }
            else if (Path.GetFileName(logFile.ToString()).Contains("TRIMEvent"))
            {
                return TRIMEventLog(logFile, line);
            }

            indexOfSecondSpace = FindIndexOfOldTimeStamp(line.Message);
            if (indexOfSecondSpace == -1)
                return line;

            var message = new StringBuilder(line.Message);

            if (line.Timestamp != null)
            {
                newTimestamp = String.Format("{0:yyyy-MM-dd HH:mm:ss:fff }", line.Timestamp);
            }
            else
            {
                return line;
            }

            message.Remove(0, indexOfSecondSpace);
            message.Insert(0, newTimestamp);

            return new LogLine(line.LineIndex, line.LogEntryIndex, message.ToString(), line.Level, line.Timestamp);            
        }

        /// <summary>
        /// Format WG server Log
        /// </summary>
        /// <param name="logFile"></param>
        /// <param name="line"></param>
        /// <returns></returns>
        private LogLine WorkGroupServerLog(ILogFile logFile, LogLine line)
        {
            if (string.IsNullOrEmpty(todayDate))
            {
                string fileName = (Path.GetFileName(logFile.ToString()));
                todayDate = fileName.Replace("TRIMWorkgroup", "").Replace("_", "-").Replace(".log", "").Trim();
                MyTimestampParser.timestmp = todayDate;
            }

            if (line.LineIndex == 1)
            {
                var mes = string.Format("{0}{1}", " ", line.Message);
                indexOfSecondSpace = FindIndexOfFirstSpace(mes);
            }

            else
                indexOfSecondSpace = FindIndexOfFirstSpace(line.Message);


            if (indexOfSecondSpace == -1)
                return line;

            var message = new StringBuilder(line.Message);

            if (line.Timestamp != null)
            {
                newTimestamp = String.Format("{0:yyyy-MM-dd HH:mm:ss:fff }", line.Timestamp);                
            }
            else 
            {
                var test = "";
                return new LogLine(line.LineIndex, line.Message.Insert(0, test.PadLeft(30)), line.Level);
            }          
                        
            message.Remove(0, indexOfSecondSpace);
            message.Insert(0, newTimestamp);
           
            return new LogLine(line.LineIndex, line.LogEntryIndex, message.ToString(), line.Level, line.Timestamp);
        }

        /// <summary>
        /// Format Office Integration Log
        /// </summary>
        /// <param name="line"></param>
        /// <returns></returns>
        private LogLine OfficeIntegrationLog(LogLine line)
        {

            indexOfSecondSpace = FindIndexOfOldTimeStamp(line.Message);
            
            if (indexOfSecondSpace == -1)
                return line;

            var message = new StringBuilder(line.Message);

            if (line.Timestamp != null)
            {
                newTimestamp = String.Format("{0:yyyy-MM-dd HH:mm:ss:fff }", line.Timestamp);
            }
            else
            {
                return line;
            }          
            message.Remove(0, indexOfSecondSpace);
            message.Insert(0, newTimestamp);
            switch (line.Message.Split('\t')[3].Trim())
            {
                case "Information":
                    return  new LogLine(line.LineIndex, line.LogEntryIndex, message.ToString(), LevelFlags.Info, line.Timestamp);                  
                case "Error":                   
                        return new LogLine(line.LineIndex, line.LogEntryIndex, message.ToString(), LevelFlags.Error, line.Timestamp);                  
                case "Warning":
                    return new LogLine(line.LineIndex, line.LogEntryIndex, message.ToString(), LevelFlags.Warning, line.Timestamp);                  
                default:
                    break;
            }            
            return new LogLine(line.LineIndex, line.LogEntryIndex, message.ToString(), line.Level, line.Timestamp);;
           
        }

        /// <summary>
        /// Format Trim Event Log
        /// </summary>
        /// <param name="logFile"></param>
        /// <param name="line"></param>
        /// <returns></returns>
        private LogLine TRIMEventLog(ILogFile logFile, LogLine line)
        {
            if (string.IsNullOrEmpty(todayDate))
            {
                string fileName = (Path.GetFileName(logFile.ToString()));
                todayDate = fileName.Replace("TRIMEvent", "").Substring(4, 13).Replace("_", "-").Replace(".log", "").Trim();
                MyTimestampParser.timestmp = todayDate;
            }

            if (line.LineIndex == 1)
            {
                var mes = string.Format("{0}{1}", " ", line.Message);
                indexOfSecondSpace = FindIndexOfFirstSpace(mes);
            }

            else
                indexOfSecondSpace = FindIndexOfFirstSpace(line.Message);


            if (indexOfSecondSpace == -1)
                return line;

            var message = new StringBuilder(line.Message);

            if (line.Timestamp != null)
            {
                newTimestamp = String.Format("{0:yyyy-MM-dd HH:mm:ss:fff }", line.Timestamp);
            }
            else
            {
                var test = "";
                return new LogLine(line.LineIndex, line.Message.Insert(0, test.PadLeft(30)), line.Level);
            }

            message.Remove(0, indexOfSecondSpace);
            message.Insert(0, newTimestamp);

            return new LogLine(line.LineIndex, line.LogEntryIndex, message.ToString(), line.Level, line.Timestamp);
        }

        private static int FindIndexOfSecondSpace(string message)
        {
            int firstSpace = message.IndexOf(' ');
            if (firstSpace == -1)
                return -1;

            int nextNonWhitespace = FirstIndexOfNonWhitespace(message, firstSpace + 1);
            if (nextNonWhitespace == -1)
                return -1;

            int secondSpace = message.IndexOf(' ', nextNonWhitespace);
            return secondSpace;
        }

        private static int FindIndexOfOldTimeStamp(string message)
        {
            int firstSpace = message.IndexOf('\t');
            if (firstSpace == -1)
                return -1;

            //int nextNonWhitespace = FirstIndexOfNonWhitespace(message, firstSpace + 1);
            //if (nextNonWhitespace == -1)
            //    return -1;

            //int secondSpace = message.IndexOf(' ', nextNonWhitespace);
            return firstSpace;
        }

        private static int FindIndexOfFirstSpace(string message)
        {
            int firstSpace = message.IndexOf(' ');
            if (firstSpace == -1)
                return -1;
         
            return firstSpace;
        }

        private static int FirstIndexOfNonWhitespace(string source, int startIndex = 0)
        {
            if (startIndex < 0) throw new ArgumentOutOfRangeException("startIndex");
            if (source != null)
                for (int i = startIndex; i < source.Length; i++)
                    if (!char.IsWhiteSpace(source[i])) return i;
            return -1;
        }
    }
}
