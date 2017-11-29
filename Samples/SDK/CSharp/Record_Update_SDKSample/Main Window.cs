using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
//using System.Threading.Tasks;
using System.Windows.Forms;
using HP.HPTRIM.SDK;

namespace Record_Update_SDKSample
{
    ///This class provides an user interface to search a record using a record number.
    ///The record title, date of creation and assignee details are displayed.  An error message is displayed if 
    ///the record doesn't exist.
    ///The UI allows to update a record and save it.

    public partial class SampleForm : Form
    {
        /// <summary>
        /// Retrieves a handle to the desktop window. TRIM UI components require the handle of a parent window
        /// </summary>
        /// <returns></returns>
        [System.Runtime.InteropServices.DllImport("user32.dll", EntryPoint = "GetDesktopWindow")]
        public static extern IntPtr GetDesktopWindow();

        string title;//record title
        string recNumber;//record number
        TrimDateTime date;//record date of creation
        Location location;// record assignee
        string locName;// assignee name

        string dbid;
        string wgs;

        public SampleForm()
        {
            InitializeComponent();

            using (Database database = getDatabase())
            {
                label2.Text = $"{database.Id} / {database.WorkgroupServerName}";
            }
        }

        private Database getDatabase()
        {
            Database database = new Database();
            if (dbid != null)
            {
                database.Id = dbid;
            }

            if (wgs != null)
            {
                database.WorkgroupServerName = wgs;
            }

            if (!database.IsValid)
            {
                database.Dispose();

                DesktopHelper helper = new DesktopHelper();
                database = helper.SelectDatabase(GetDesktopWindow(), false, false);
            }
            // if the database id and work group server are not set we rely on a default already having been set in the client.
            database.Connect(); //connect to the db using DB id and workgroup server

            return database;
        }

        /// <summary>
        /// Search Button - used to search a record using a record number. IF the recorfd does not exist 
        /// an error is displayed.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnSearch_Click(object sender, EventArgs e)
        {
            try
            {

                using (Database objDB = getDatabase())//create a database object
                {

                    string recnum = RecordNum.Text;

                    Record rec = new Record(objDB, recnum);//record object
                    
                    location = new Location(objDB, rec.Assignee.Name);//location object

                    RecNumVal.Text = rec.Number.ToString();//record number
                    RecTitleVal.Text = rec.Title;//record title
                    DateCreatedVal.Text = rec.DateCreated.ToString();//record date of creation
                    AssigneeVal.Text = location.Name;//record assignee

                }
            }
            // If a record does not exist an exception is thrown and a msgbox is displayed
            catch (Exception k)
            {
                MessageBox.Show(k.Message);
            }

        }
        /// <summary>
        /// Save Button - used to save a record. If the assignee is invalid it displays an error.
        /// The record the verified before getting saved.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        
        private void Save_Click(object sender, EventArgs e)
        {
                  
            try
            {

                using (Database objDB = getDatabase())//create a database object
                {

                    recNumber = RecNumVal.Text; //record number
                    title = RecTitleVal.Text; //record title
                    date = new TrimDateTime(DateCreatedVal.Text); //record date of creation
                    locName = AssigneeVal.Text; //record assignee

                    Record rec = new Record(objDB, recNumber);//record object
                    rec.Title = title;
                    rec.DateCreated = date;
                    location = new Location(objDB, rec.Assignee.Name);//location object
                    if (location.Name != locName) //checking if the assignee name has changed
                    {
                        try
                        {
                            Location loc = new Location(objDB, locName);
                            rec.SetAssignee(loc);
                        }
                        //An exception is thrown if the location name is invalid
                        catch(Exception k)
                        {
                            System.Diagnostics.Trace.WriteLine(k.Message);
                            MessageBox.Show("The assingee is invalid or does not exist");
                            return;
                        }

                    }
                    //Saving the record object
                    if (rec.Verify(true))
                    {

                        rec.Save();
                        MessageBox.Show("Record Saved");

                    }
                    else //Error is displayed if record verification fails
                    {
                        MessageBox.Show(rec.ErrorMessage);
                    }
                }

            }
            // Display any exception thrown in a msgbox
            catch (Exception k)
            {
                MessageBox.Show(k.Message);
            }
                 
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Database database = null;

            try
            {
                DesktopHelper helper = new DesktopHelper();
                database = helper.SelectDatabase(GetDesktopWindow(), false, false);

                dbid = database?.Id;
                wgs = database?.WorkgroupServerName;

                label2.Text = $"{dbid} / {wgs}";
            }
            finally
            {
                if (database != null)
                {
                    database.Dispose();
                }
            }
        }


    }
}
