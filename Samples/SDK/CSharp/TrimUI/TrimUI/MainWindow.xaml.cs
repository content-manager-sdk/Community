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

namespace HP.HPTRIM.SDK.Samples
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
            DataContext = this;
            try
            {
                TrimApplication.Initialize();

                // There a are a few error messages which will only be displayed of you have set this to true.  By and large you application will work
                // whether you set this or not.  Still it does not hurt to set it if you have a UI application.
                TrimApplication.HasUserInterface = true;
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

        // The following three properties exist to support WPF Databinding
        public static readonly DependencyProperty IsDatabaseAvailableProperty = DependencyProperty.Register("IsDatabaseAvailable", typeof(bool), typeof(MainWindow));
        public bool IsDatabaseAvailable
        {
            get { return (bool)GetValue(IsDatabaseAvailableProperty); }
            set { SetValue(IsDatabaseAvailableProperty, value); }
        }


        public static readonly DependencyProperty SelectedRecordProperty = DependencyProperty.Register("SelectedRecord", typeof(Record), typeof(MainWindow));
        public Record SelectedRecord
        {
            get { return (Record)GetValue(SelectedRecordProperty); }
            set
            {
                SetValue(SelectedRecordProperty, value);

                IsRecordSelected = SelectedRecord != null;
            }
        }

        public static readonly DependencyProperty IsRecordSelectedProperty = DependencyProperty.Register("IsRecordSelected", typeof(bool), typeof(MainWindow));
        public bool IsRecordSelected
        {
            get { return (bool)GetValue(IsRecordSelectedProperty); }
            set { SetValue(IsRecordSelectedProperty, value); }
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

        private void Button_Click_Edit_Record(object sender, RoutedEventArgs e)
        {
            // setting tempRecord is so we can set it back on save and thus
            // force the databinding to update any bound controls (such as the TextBlock containing the Record.Title).

            Record tempRecord = new Record(_database, SelectedRecord.Uri);
            if (PropertyEditor.EditModal(GetDesktopWindow(), tempRecord))
            {
                tempRecord.Save();

                SelectedRecord = tempRecord;
            }

        }

        private void Button_Click_Display_Record(object sender, RoutedEventArgs e)
        {
            // This will Display a Search Results for one or more TrimMainObjects.
            // In this case we are simply selecting the one Record to display
            TrimMainObjectSearch search = new TrimMainObjectSearch(_database, BaseObjectTypes.Record);
            search.SelectByUris(new long[] { SelectedRecord.Uri });

            ObjectSelector.DisplayResults(GetDesktopWindow(), search);
        }

        private void Button_Click_Select_Record(object sender, RoutedEventArgs e)
        {
            // ObjectSelector has a number of methods allowing us to select one or more objects.
            // In this case we want to select one Record
            TrimMainObjectSearch search = new TrimMainObjectSearch(_database, BaseObjectTypes.Record);
            search.SelectAll();

            SelectedRecord = ObjectSelector.SelectOne(GetDesktopWindow(), search) as Record;

        }

        private void Button_Click_3(object sender, RoutedEventArgs e)
        {
            DesktopHelper helper = new DesktopHelper();
            Database newDatabase = helper.SelectDatabase(GetDesktopWindow(), false, false);

            if (newDatabase != null)
            {
                if (_database != null)
                {
                    _database.Dispose();
                }

                _database = newDatabase;

                IsDatabaseAvailable = newDatabase.IsValid;
            }
        }


    }
}
