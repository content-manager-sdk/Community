using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;

using HP.HPTRIM.SDK;

namespace CustomEventProcessor
{
  ///<summary>  
  ///This source code provides an example of how to write a TRIM event processor
  ///Addin. 
  ///
  ///It creates several log files for different types of TRIM objects and
  ///tracks selected event types that occured on those objects.
  ///
  ///To configure this in TRIM, have a look at the associated documentation in 
  ///the documentation folder.
  ///</summary> 
  public class CustomEventProcessor : TrimEventProcessorAddIn
  {
    private const string AddInLogFolder = "AddInLogs";
    private const string AccessLogName  = "accessLog.txt";
    private const string RecordLogName  = "recordLog.txt";

    private string       m_logFolder;
    private StreamWriter m_writer;

    /* Empty Constructor. */
    public CustomEventProcessor() { }

    /// <summary>
    /// The method processing the event.
    /// </summary>
    /// <param name="db"></param>
    /// <param name="eventData"></param> 
    public override void ProcessEvent(Database db, TrimEvent eventData)
    {
      StringBuilder sb = new StringBuilder();
      m_writer         = null;      
      m_logFolder      = db.GetTRIMFolder(TrimPathType.AuditLog, true) + "\\" + AddInLogFolder;

      /* The time the event occured.*/
      sb.Append(eventData.EventDate.ToShortDateTimeString()).Append(" | ");
      /* What object did the event occur to?*/
      switch (eventData.ObjectType)
      {
        case BaseObjectTypes.Location:
          /* Something happened concerning a Location object. */
          sb.Append(ProcessLocationEvent(eventData));         
          break;
        
        case BaseObjectTypes.Record:
          /* Something happened concerning a Record object. */
          sb.Append(ProcessRecordEvent(db, eventData));
          break;

        default:
          /* We are not interested in the event, so do nothing. */
          break;
      }
      /* Something to write? So write it! */
      if (m_writer != null)
      {
        sb.Append(UserInfo(eventData));
        m_writer.WriteLine(sb.AppendLine().ToString());
        m_writer.Close();
      }
    }

    /// <summary>
    /// This method will be invoked, if an event concerning a Location object 
    /// occurs. It checks the event type and collects the necessary log 
    /// information in a StringBuilder object.
    /// </summary>
    /// <param name="eventData"></param>
    /// <returns></returns>
    private StringBuilder ProcessLocationEvent(TrimEvent eventData)
    {
      Events eventType = eventData.EventType;
      /* We take action only for certain event types. */
      if ( eventType == Events.UserLogon
        || eventType == Events.UserLogoff
        || eventType == Events.UserLogonFailed)
      {
        m_writer = OpenLogFile(m_logFolder, AccessLogName);
        return new StringBuilder(eventType.ToString());
      }
      return new StringBuilder(""); ;
    }

    /// <summary>
    /// This method will be invoked, if an event concerning a Record object 
    /// occurs. It checks the event type and collects the necessary log 
    /// information in a StringBuilder object.
    /// </summary>
    /// <param name="db"></param>
    /// <param name="eventData"></param>
    /// <returns></returns>
    private StringBuilder ProcessRecordEvent(Database db, TrimEvent eventData)
    {
      Events         eventType = eventData.EventType;
      StringBuilder  sb        = new StringBuilder("");
      string         extra     = eventData.ExtraDetails;

      /* We take action only for certain event types. */
      if (   eventType == Events.ObjectModified
          || eventType == Events.ObjectAdded
          || eventType == Events.ObjectRemoved
          || ((int)eventType > 110 &&  (int)eventType < 137)) // Event types 111 to 136 are the document related events
      {
          TrimMainObject obj = db.FindTrimObjectByUri(BaseObjectTypes.Record,
          eventData.ObjectUri);

          /* We want to add special log information for transactions. */
          if ((int)eventType > 110 &&  (int)eventType < 137)
          {
            bool checkedIn = extra.Contains("Document Attached")
              || extra.Contains("New Document Revision");

            /* Checked in or out? */
            sb.Append(eventType).Append(" (");
            sb = (checkedIn) ? sb.Append("checked in") : sb.Append("checked out");
            sb.Append("): ");
          }
          else
          {
            sb.Append(eventType).Append(": ");
          }

          sb.Append(obj.NameStringExtra).Append(", URI ").Append(obj.Uri);
        
          m_writer = OpenLogFile(m_logFolder, RecordLogName);
      }
      return sb;
    }
    
    /// <summary>
    /// This method collects information about the user, who triggered the event
    /// and adds this information to a StringBuilder object.
    /// </summary>
    /// <param name="eventData"></param>
    /// <returns></returns>
    private StringBuilder UserInfo(TrimEvent eventData)
    {
      StringBuilder sb = new StringBuilder();
      /* Who triggered the event from what machine? + optional details. */
      sb.Append(" (");
      sb.Append(eventData.LoginName).Append(" from ");
      sb.Append(eventData.FromMachine).Append(")");

      /* Are there extra details to be written? */
      if (eventData.ExtraDetails != "")
      {
        sb.AppendLine().Append("\t\t").Append(eventData.ExtraDetails);
      }
      return sb;
    }
    
    /// <summary>
    /// This method checks if the log folder already exists and creates it if
    /// it does not. Then it creates the log file with the given name and 
    /// returns the StreamWriter, that is attached to the file.
    /// </summary>
    /// <param name="logFolder"></param>
    /// <param name="logFileName"></param>
    /// <returns></returns>
    private StreamWriter OpenLogFile(string logFolder, string logFileName)
    {  
      FileStream   fileStream;
      StreamWriter writer;
      string       logFile;

      try
      {
        /* Does the log folder exist ? create new : use existing */
        if (!Directory.Exists(logFolder))
        {
          Directory.CreateDirectory(logFolder);
        }

        logFile = logFolder + @"\" + logFileName;

        fileStream = new FileStream(logFile, FileMode.Append, FileAccess.Write,
          FileShare.ReadWrite);

        writer = new StreamWriter(fileStream);
        writer.AutoFlush = true;
      }
      catch (Exception e)
      {
        writer = null;
        MessageBox.Show(@"Something is wrong with the log folder and/or 
          directory.\nReson: " + e.Message);
      }
      return writer;
    }
  }
}