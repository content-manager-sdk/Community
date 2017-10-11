using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace TestWPF
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        /// <summary>
        /// Retrieves a handle to the desktop window. TRIM UI components require the handle of a parent window
        /// </summary>
        /// <returns></returns>
        [System.Runtime.InteropServices.DllImport("user32.dll", EntryPoint = "GetDesktopWindow")]
        public static extern IntPtr GetDesktopWindow();

        Database _database = null;

        public MainWindow()
        {
            InitializeComponent();

            try
            {
                TrimApplication.Initialize();

                _database = new Database();             
                _database.Connect();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        public override void BeginInit()
        {

            base.BeginInit();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Record record = new Record(_database, 9000000000);

            if (HP.HPTRIM.SDK.PropertyEditor.EditModal(GetDesktopWindow(), record))
            {
                record.Save();
            }

        }

        protected override void OnClosing(System.ComponentModel.CancelEventArgs e)
        {
            if (_database != null)
            {
                _database.Dispose();
                _database = null;
            }
            base.OnClosing(e);
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            TrimMainObjectSearch search = new TrimMainObjectSearch(_database, BaseObjectTypes.Record);
            search.SelectAll();

            ObjectSelector.DisplayResults(GetDesktopWindow(), search);
        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {
            TrimMainObjectSearch search = new TrimMainObjectSearch(_database, BaseObjectTypes.Record);


            TrimSearchClause recentClause = new TrimSearchClause(_database, BaseObjectTypes.Record, SearchClauseIds.RecordMyDocuments);
            search.AddSearchClause(recentClause);

            search.SetPurpose((int)RecordPurposes.FindTemplate, (int)AllEnumerations.WordOpenFileTypes);




            var selectedSearch = ObjectSelector.SelectOne(GetDesktopWindow(), search);

            if (selectedSearch != null)
            {
                string gg = selectedSearch.Uri.ToString();
            }
        }

        private void Button_Click_3(object sender, RoutedEventArgs e)
        {
            DesktopHelper helper = new DesktopHelper();
            Database newDatabase = helper.SelectDatabase(GetDesktopWindow(), false, false);

            if (newDatabase != null)
            {
                _database.Dispose();
                _database = newDatabase;
            }
        }
    }
}
