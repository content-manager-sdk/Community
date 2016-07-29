using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HP.HPTRIM.SDK;
using System.IO;

// This source code provides an example of how to write a TRIM event processor
// Addin.  

// To configure this in TRIM, you would open TRIM Enterprise Studio,
// select the dataset you want the add-in to run for and choose the 
// Event Processsing -> Configure option on the right mouse menu.

// Click on the Custom Processes Tab and then press Add.
// Give your processor a name (can be anything, just there for readability)
// and then select the "Call a .Net Assembly" option and fill in the values
// for Assembly Name (here, I use HP.HPTRIM.SDK.Samples.dll) and
// for Class Name (here, I use EventProcessor).

// Down the bottom, make sure processing is Enabled and select a workgroup to run it 
// on (if you select any workgroup, you will need to deploy your add-in to all
// running TRIM workgroups.

// For testing/debugging, you should start up the workgroup, which will launch a 
// copy of TRIMEvent for each TRIM data set configured (life is easier if you only have
// one dataset).  You should then attach your debugger to the TRIMevent.exe process, which
// will be the process that calls into your assembly.

// Having all that set up, fire up a copy of TRIM - just doing that will create a user logged on
// event, which should eventually hit your shores.


namespace HP.HPTRIM.SDK.Samples
{
    public class EventProcessor : TrimEventProcessorAddIn, IDisposable
    {

        private StreamWriter m_logFile;

        public EventProcessor()
        {
        }

        private string writeObjectDetails(BaseObjectTypes trimType, long uri, Database db)
        {
            ObjectDef objDef = new ObjectDef(trimType, db);
            TrimMainObject obj = db.FindTrimObjectByUri(trimType, uri);

            if (obj != null)
            {
              return string.Format("Event object {0} ({1}) of type {2}.", obj.NameString, obj.NameStringExtra, objDef.Caption);
            }
            else
            {
                return string.Format("Missing object for Uri: {0} of type {1}.", uri, objDef.Caption);
            }
        }


        public override void ProcessEvent(HP.HPTRIM.SDK.Database db,
                                            HP.HPTRIM.SDK.TrimEvent eventData)
        {           

            StringBuilder logEntry = new StringBuilder();

            logEntry.AppendFormatLine("=========  Event: {0}, from machine: {1}, for user: {2}. =============",
                eventData.EventType, eventData.FromMachine, eventData.LoginName);

            // a description of the object affected
            if (eventData.ObjectType != BaseObjectTypes.Unknown)
            {
                logEntry.AppendLine(writeObjectDetails(eventData.ObjectType, eventData.ObjectUri, db));
            }

            // a description of the related object
            if (eventData.RelatedObjectType != BaseObjectTypes.Unknown)
            {
                logEntry.Append("Related Object Details: ");
                logEntry.AppendFormatLine(writeObjectDetails(eventData.RelatedObjectType, eventData.RelatedObjectUri, db));
            }

            if (eventData.ExtraDetails.Length > 0)
            {
                logEntry.AppendFormatLine("Extra event details: {0}", eventData.ExtraDetails);
            }

            OpenLogFile(db.GetTRIMFolder(TrimPathType.AuditLog, true));

            m_logFile.Write(logEntry.ToString());
        }

        public virtual void Dispose()
        {
            if (m_logFile != null)
            {
                m_logFile.Close();
                m_logFile.Dispose();
                m_logFile = null;
            }
        }

        private void OpenLogFile(String LogFolder)
        {
            if (m_logFile == null)
            {
                m_logFile = new StreamWriter(LogFolder + "\\EventAddIn.log", true);
                m_logFile.AutoFlush = true;
            }
        }

    };
}
