using System;
using System.Collections;
using System.Windows.Forms;

using HP.HPTRIM.SDK;

namespace SDK_Basics_Searching
{
  /// <summary>
  /// This Class provides a user interface to connect and disconnect from a 
  /// certain TRIM database. The database can either be selected from a list of
  /// available databases or found via an entered ID or the default.
  /// 
  /// Further on it provides Record and Location Searching. Any kind of 
  /// searchable TRIM type can be added.
  /// </summary>
  public partial class StartForm : Form
  {
    /* The string to indicate, that the user wants to use the default database. */
    private const string Default_DB_String = "default";

    /* The database to operate on. */
    private Database m_db = null;

    /// <summary>
    /// Constructor for initializing the Form.
    /// </summary>
    public StartForm()
    {
      InitializeComponent();
    }

    /*
     * 
     * File - all methods only for the "File"-menu
     * 
     * The Connect submenu is only available in a disconnectet state.
     * The Disconnect submenu is only available in a connected state.
     * 
     */

    /// <summary>
    /// This method is invoked when the user clicks on "File - Exit".
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void exitToolStripMenuItem_Click(object sender, EventArgs e)
    {
      statusBox.AppendText("\r\nCleaning up...");

      if (m_db != null)
      {
        if (m_db.IsConnected) m_db.Disconnect(); 
        m_db.Dispose();
      }

      Hide();
      Dispose();
    }

    /// <summary>
    /// This method is invoked when the user clicks on "File - Connect - 
    /// Default DB". It initiates a connection to the default database.
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void defaultDBToolStripMenuItem_Click(object sender, EventArgs e)
    {
      ConnectDB(Default_DB_String);
    }

    /// <summary>
    /// This method is invoked when the user clicks on "File - Connect - 
    /// via DB ID". It opens a dialog to enter the ID and connects to the 
    /// associated database.
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void viaDBIDToolStripMenuItem_Click(object sender, EventArgs e)
    {
      InputForm inForm = new InputForm("Database ID Chooser", 
        "Database ID (2 chars)");
      inForm.ShowDialog();

      ConnectDB(inForm.Input);
    }

    /// <summary>
    /// This method is invoked when the user clicks on "File - Connect - 
    /// Choose from List". It opens a dialog with known databases the user 
    /// can choose from.
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void chooseListToolStripMenuItem_Click(object sender, EventArgs e)
    {
      string[] databases = TrimApplication.GetDatabaseIds("localhost", 1137);

      SelectForm selForm = 
        new SelectForm(databases, "Databases:", "Available Databases");
      selForm.ShowDialog();

      ConnectDB(selForm.SelectedItem);
    }

    /// <summary>
    /// This method is invoked when the user clicks on "File - Disconnect".
    /// It disconnects from the database.
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void disconnectToolStripMenuItem_Click(object sender, EventArgs e)
    {      
      statusBox.AppendText("\r\nDisconnecting from " + m_db.Name + "...");

      m_db.Disconnect();
      m_db.Dispose();
      m_db = null;

      /* Lock menus that are not allowed while disconnected. */
      disconnectToolStripMenuItem.Enabled = false;
      recordToolStripMenuItem.Enabled     = false;
      locationToolStripMenuItem.Enabled   = false;
      connectToolStripMenuItem.Enabled    = true;


      statusBox.AppendText("\r\nSuccessfully disconnected.");      
    }

    /*
     * 
     * Record - all methods only for the "Record"-menu
     * 
     */

    /// <summary>
    /// This method is invoked when the user clicks on "Record - Search By - 
    /// %SUB_MENU%". It identifies the submenu it was invoked from and calls 
    /// InitiateSearch().
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void searchRecordToolStripMenuItem_Click(object sender, EventArgs e)
    {
      Hashtable ids = new Hashtable();

      switch (sender.ToString())
      {
        case "Title":
          ids.Add(SearchClauseIds.RecordTitle, false);
        break;

        case "Record Number":
          ids.Add(SearchClauseIds.RecordNumber, false);
        break;

        case "URI":
          ids.Add(SearchClauseIds.Uri, false);
        break;

        case "Title and Content":
          ids.Add(SearchClauseIds.RecordTitle, false);
          ids.Add(SearchClauseIds.RecordContent, false);
        break;

        /* 
         * Any other SearchClauseId to be searched for can be added here. 
         * Further modifications in InitiateSearch() and / or the Searcher class
         * might be required.
         */

        default:
          statusBox.AppendText("\r\nSomething is wrong with your UI! *sigh*");
        return;
      }

      InitiateSearch(ids, BaseObjectTypes.Record);
    }

    /*
     * 
     * Location - all methods only for the "Location"-menu
     * 
     */

    /// <summary>
    /// This method is invoked when the user clicks on "Location - Search By
    /// - %SUB_MENU%". It identifies the submenu it was invoked from and calls 
    /// InitiateSearch().
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void findLocationToolStripMenuItem_Click(object sender, EventArgs e)
    {
      Hashtable ids = new Hashtable();

      switch (sender.ToString())
      {
        case "Name":
          ids.Add(SearchClauseIds.LocationName, false);
          break;

        case "Type of Location":
          ids.Add(SearchClauseIds.LocationType, true);
          break;

        /* Any other SearchClauseId to be searched for can be added here. (But 
         * might need slightly modification in the following methods.)
         */

        default:
          statusBox.AppendText("\r\nSomething is wrong with your UI! *sigh*");
          return;
      }

      InitiateSearch(ids, BaseObjectTypes.Location);
    }

    /*
     * 
     * Helper methods for connecting to the database and for searching.
     * 
     */

    /// <summary>
    /// This method uses the Searcher class to perform a search for Objects with 
    /// the given BaseObjectType matching the defined SearchClauses.
    /// 
    /// The search string is picked up either via a selection form or a simple
    /// input form. (Depending on the bool value for the search clause in the
    /// Hashtable.)
    /// 
    /// The result is displayed at the end. 
    /// </summary>
    /// <param name="ids"></param>
    /// <param name="objectType"></param>
    private void InitiateSearch(Hashtable ids, BaseObjectTypes objectType)
    {
      SearchResult      result;
      Searcher          searcher      = new Searcher(m_db);
      string[]          searchStrings = new string[ids.Count];
      SearchClauseIds[] listOfIDs     = new SearchClauseIds[ids.Count];
      
      /* 
       * The if branch can be used for SearchClauseId type that requires the 
       * user to make a selection out of predefined, already existing things.
       * (example here: searching by LocationType)
       * 
       * The else branch can be used for any SearchClauseId that only requires
       * the user to enter a search string.
       * (example here: searching by Name)
       * 
       */
      int i = 0;
      foreach (SearchClauseIds id in ids.Keys)
      {
        /* Test, if use of selection form or normal input form. */
        if ((bool) ids[id])
        {
          if (id == SearchClauseIds.LocationType)
          {
            /* Here we get all available location types. */
            string[] typeNames = System.Enum.GetNames(typeof(LocationType));

            /* Now we let the user choose one. */
            SelectForm selForm =
              new SelectForm(typeNames, "Location Type:", "Choose a Location Type");
            selForm.ShowDialog();
            searchStrings[i] = selForm.SelectedItem;
          }

          /* Here you can add more if clauses, or modify it to a switch, so that
           * you can have more search clauses that use a selection window.
           */
        }
        else
        {
          /* We need to get the search string from the user. */
          InputForm inForm =
            new InputForm("Enter the search string", id.ToString() + ":");
          inForm.ShowDialog();
          searchStrings[i] = inForm.Input;
        }
        listOfIDs[i] = id;
        i++;
      }
      
      /* Perform the search. */
      try
      {
          result = searcher.Search(searchStrings, listOfIDs, objectType);
          statusBox.AppendText(result.LogText);

          /* Finally display the results. */
          DisplayResultsForm resForm =
            new DisplayResultsForm(result.ResultObjects, objectType);
          resForm.ShowDialog();

      }
      catch (Exception ex)
      {
        statusBox.AppendText(ex.Message);
        return;
      }
    }

    /// <summary>
    /// This method connects to the database with the given id and performs
    /// logging actions and user interface changes (like making submenus 
    /// available / unavailable, etc.).
    /// </summary>
    /// <param name="id"></param>
    private void ConnectDB(string id)
    {
      statusBox.AppendText("\r\n\r\nConnecting to database with ID: " + id);
      try
      {
          TrimApplication.Initialize();

        m_db = new Database();

        /* This already connects to the database with the given id. */
        if (id != Default_DB_String)
        {
          m_db.Id = id;
        }
        m_db.Connect();

        statusBox.AppendText("\r\n" + m_db.Name + " is a valid database.");
        statusBox.AppendText("\r\nConnection to TRIM version "
          + TrimApplication.SoftwareVersion + " successful.\n");

        connectToolStripMenuItem.Enabled    = false;
        recordToolStripMenuItem.Enabled     = true;
        locationToolStripMenuItem.Enabled   = true;
        disconnectToolStripMenuItem.Enabled = true;
      }
      catch (Exception e)
      {
        statusBox.AppendText("\r\nUnable to connect to database. (Reason: "
          + e.Message + ")");

        if (m_db != null)
        {
            m_db.Dispose();
            m_db = null;
        }
      }
    }
  }
}
