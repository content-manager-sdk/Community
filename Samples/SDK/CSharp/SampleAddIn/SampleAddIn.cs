using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;

using HP.HPTRIM.SDK;

namespace SampleAddIn
{
  public class SampleMenuLink : TrimMenuLink
  {
    public SampleMenuLink()
    {
    }

    // Summary:
    //     Gets a string that should appear as a tool tip when hovering over a menu
    //     item
    public override string Description
    {
      get { return "Select this menu item to run the sample link and see the log."; }
    }

    //
    // Summary:
    //     Gets an ID number that identifies this menu item.
    public override int MenuID
    {
      get { return 42; }
    }

    //
    // Summary:
    //     Gets a string that should appear on the context menu.
    public override string Name
    {
      get { return "Sample Menu String (Show Log)"; }
    }
    //
    // Summary:
    //     Gets a boolean value indicating whether this menu item supports TRIM tagged
    //     processing
    public override bool SupportsTagged
    {
      get { return false; }
    }
  };

  class SampleMenuLinkTagged : TrimMenuLink
  {
    public SampleMenuLinkTagged()
    {
    }

    // Summary:
    //     Gets a string that should appear as a tool tip when hovering over a menu
    //     item
    public override string Description
    {
      get { return "Select this menu item to run the tagged sample link and see the log."; }
    }

    //
    // Summary:
    //     Gets an ID number that identifies this menu item.
    public override int MenuID
    {
      get { return 43; }
    }

    //
    // Summary:
    //     Gets a string that should appear on the context menu.
    public override string Name
    {
      get { return "Sample Tagged Menu String (Show Log Tagged)"; }
    }
    //
    // Summary:
    //     Gets a boolean value indicating whether this menu item supports TRIM tagged
    //     processing
    public override bool SupportsTagged
    {
      get { return true; }
    }
  };

  class SampleAddIn : ITrimAddIn
  {
    /*
     * Member variables
     */
    private const string LogFileName = "SampleAddInLog.txt";

    private StringBuilder m_errorMsg;
    private string m_logFile;

      /*
       *  Private methods
       */ 

    private void writeToLog(string message, params object[] args)
    {
        using (StreamWriter writer = new StreamWriter(new FileStream(m_logFile, FileMode.Append)))
        {
            writer.WriteLine(message, args);
        }
    }

    /*
     * Public Methods
     */
    public override string ErrorMessage { get { return m_errorMsg.ToString(); } }

    public override void Initialise(Database db)
    {
      m_errorMsg = new StringBuilder();

      /* TODO: Here you can initialize any local members of your class. */

      m_logFile = db.GetTRIMFolder(TrimPathType.AuditLog, true) + "\\" + LogFileName;

      try
      {
          File.Delete(m_logFile);
      }
      catch
      {
          // do nothing, lets assume things are OK.
      }

      writeToLog("Record AddIn initialized on database: {0}.", db.Name);

    }

    public override TrimMenuLink[] GetMenuLinks()
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);
      TrimMenuLink[] links = new TrimMenuLink[] { new SampleMenuLink(), new SampleMenuLinkTagged() };

      writeToLog("Number of links:  {0}.", links.Length);

      return links;
    }

    public override bool IsMenuItemEnabled(int cmdId, TrimMainObject forObject)
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);
      return true;
    }

    public override void ExecuteLink(int cmdId, TrimMainObject forObject, ref bool itemWasChanged)
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);

      writeToLog("Executed sample menu link for {0} (command id {1}).", forObject.NameString, cmdId);

    }

    public override void ExecuteLink(int cmdId, TrimMainObjectSearch forTaggedObjects)
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);

          writeToLog("Executed sample menu link for objects matching {0} (command id {1}):", forTaggedObjects.Title, cmdId);

        foreach (TrimMainObject obj in forTaggedObjects)
        {
            writeToLog("\t{0} ({1}): {2}", obj.TrimType, obj.Uri, obj.NameString);          
        }

    }

    public override void PostDelete(TrimMainObject deletedObject)
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);
      TrimMenuLink[] links = new TrimMenuLink[] { new SampleMenuLink(), new SampleMenuLinkTagged() };

      writeToLog("{0} was deleted (Code here is executed after an object was saved).", deletedObject.NameString);
    }

    public override void PostSave(TrimMainObject savedObject, bool itemWasJustCreated)
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);

      if (itemWasJustCreated)
      {
          writeToLog("{0} was just created and saved", savedObject.NameString);
      }
      else
      {
          writeToLog("{0} was saved", savedObject.NameString);
      }

    }

    public override bool PreDelete(TrimMainObject modifiedObject)
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);

      writeToLog("{0} will be deleted. (To prevent deleting certain objects, insert your code here and return false, else true.)", modifiedObject.NameString);
      return true;
    }

    public override bool PreSave(TrimMainObject modifiedObject)
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);

      writeToLog("{0} will be saved. (To prevent saving certain objects, insert your code here and return false, else true.)", modifiedObject.NameString);
      return true;
    }

    public override bool SelectFieldValue(FieldDefinition field, TrimMainObject trimObject, string previousValue)
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);

      writeToLog("Display user interface for selecting a value for the field {0} on {1} (previous value: {2}).", field.NameString, trimObject.NameString, previousValue);
      return false;
    }

    public override void Setup(TrimMainObject newObject)
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);

      writeToLog("New object of type {0} was just constructed (Code here is executed after an object's constructor was called, but before properties have been set).", newObject.TrimType);
    }

    public override bool SupportsField(FieldDefinition field)
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);
      bool doSupport = (field.Name == "Sample Field");

      writeToLog("SupportsField: {0}: {1}", field.Name, doSupport);
      return doSupport;
    }

    public override bool VerifyFieldValue(FieldDefinition field, TrimMainObject trimObject, string newValue)
    {
      m_errorMsg.Remove(0, m_errorMsg.Length);

      // simple test for non-blank
      bool isValid = (newValue != "");
      if (!isValid)
      {
        m_errorMsg.Append("SampleField cannot be blank");
      }


      writeToLog("VerifyFieldValue: {0}({1}):{2}. Value = {3}, {4}", trimObject.TrimType, trimObject.Uri, trimObject.NameString, newValue, isValid);
      return isValid;
    }
  }
}
