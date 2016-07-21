using HP.HPTRIM.SDK;
/*
 * This class(Form) will show how to create a Record in HPRM via program using SDK dll.
 * CreateDoc class having required controls and its event handlers. * 
 * To test this application simply run the CreateNewDocument.exe
 * */
using System;
using System.Configuration;
using System.IO;
//using System.Threading.Tasks;
using System.Windows.Forms;

namespace CreateNewDocument
{
    /// <summary>
    /// CreateDoc class having required controls and its event handlers.
    /// </summary>
    public partial class CreateDoc : Form
    {
        public CreateDoc()
        {
            InitializeComponent();
        }

        private void btnCreateDoc_Click(object sender, EventArgs e)
        {
            try
            {

                using (Database db = new Database())
                {

                    db.Id = ConfigurationManager.AppSettings["dbid"];
                    if (db.IsValid)//check whether db is valid, if not show error message
                    {
                        FileInfo fi = new FileInfo(txtFilePath.Text.Trim());

                        //define record type
                        RecordType recType = new RecordType(db, ConfigurationManager.AppSettings["recordType"]);

                        HP.HPTRIM.SDK.Record rd = new Record(recType);
                        rd.Title = fi.Name;

                        HP.HPTRIM.SDK.InputDocument objDoc = new InputDocument();
                        objDoc.SetAsFile(txtFilePath.Text.Trim());
                        

                        rd.Author = db.CurrentUser;
                        rd.SetDocument(objDoc, false, false, "Created via SDK");
                        rd.Save();

                        MessageBox.Show("Newly created document Record Number: " + rd.Number.ToString());
                        //nullify used objects before exit, so that  GC can collect it
                        rd = null;
                        objDoc = null;


                    }
                    else
                    {
                        MessageBox.Show("Loader database error: " + db.ErrorMessage);
                    }
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void brnBrowse_Click(object sender, EventArgs e)
        {
            DialogResult result = openFileDialog1.ShowDialog(); // Show the dialog.
            if (result == DialogResult.OK) // Test result.
            {
                txtFilePath.Text = openFileDialog1.FileName;
            }
        }
    }
}
