
using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Configuration;
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


namespace HP.HPTRIM.SDK.Samples.ImportUsingOrigin
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


        Scheduler _scheduler = null;

        public MainWindow()
        {
            InitializeComponent();

            DataContext = this;
            try
            {
                // I call Initialize here to make sure any errors connecting to the core code get report at the start
                TrimApplication.Initialize();

                if (!string.IsNullOrEmpty(Properties.Settings.Default["dbid"] as string))
                {
                    // rather than doing this I should probably create a Factory to connect the Database and get the Origin both here and
                    // in the background thread
                    Database.AllowAccessFromMultipleThreads = true;

                    Database = new Database();
                    Database.Id = Properties.Settings.Default["dbid"].ToString();
                    Database.Connect();
                    

                    IsDatabaseAvailable = Database.IsValid;
                }

                long originUri = Convert.ToInt64(Properties.Settings.Default["origin_uri"]);
                if (originUri > 0)
                {
                    SelectedOrigin = new Origin(Database, originUri);
                }

                SourceFolder = Properties.Settings.Default["source_folder"] as string;

                if ((int)Properties.Settings.Default["interval"] > 0)
                {
                    Interval = Properties.Settings.Default["interval"].ToString();
                }
                IsOnSchedule = (bool)Properties.Settings.Default["on_schedule"];

                if (IsOnSchedule)
                {
                    _scheduler = new Scheduler(new Importer(SelectedOrigin, SourceFolder), Convert.ToInt32(Interval));
                    _scheduler.Start();
                }

            }
            catch (Exception ex)
            {
                System.Windows.MessageBox.Show("Error starting application: " + ex.Message);

                this.Close();
            }
        }



        public static readonly DependencyProperty IsDatabaseAvailableProperty = DependencyProperty.Register("IsDatabaseAvailable", typeof(bool), typeof(MainWindow));
        public bool IsDatabaseAvailable
        {
            get { return (bool)GetValue(IsDatabaseAvailableProperty); }
            set { SetValue(IsDatabaseAvailableProperty, value); }
        }

        public static readonly DependencyProperty IsOnScheduleProperty = DependencyProperty.Register("IsOnSchedule", typeof(bool), typeof(MainWindow));
        public bool IsOnSchedule
        {
            get { return (bool)GetValue(IsOnScheduleProperty); }
            set { SetValue(IsOnScheduleProperty, value); }
        }

        public static readonly DependencyProperty SourceFolderProperty = DependencyProperty.Register("SourceFolder", typeof(string), typeof(MainWindow));
        public string SourceFolder
        {
            get { return (string)GetValue(SourceFolderProperty); }
            set
            {
                SetValue(SourceFolderProperty, value);
            }
        }

        public static readonly DependencyProperty IntervalProperty = DependencyProperty.Register("Interval", typeof(string), typeof(MainWindow));
        public string Interval
        {
            get { return (string)GetValue(IntervalProperty); }
            set
            { SetValue(IntervalProperty, value); }
        }

        public static readonly DependencyProperty DatabaseProperty = DependencyProperty.Register("Database", typeof(Database), typeof(MainWindow));
        public Database Database
        {
            get { return (Database)GetValue(DatabaseProperty); }
            set
            {
                SetValue(DatabaseProperty, value);
            }

        }

        public static readonly DependencyProperty SelectedOriginProperty = DependencyProperty.Register("SelectedOrigin", typeof(Origin), typeof(MainWindow));
        public Origin SelectedOrigin
        {
            get { return (Origin)GetValue(SelectedOriginProperty); }
            set
            {
                SetValue(SelectedOriginProperty, value);

                if (value != null)
                {
                    Properties.Settings.Default["origin_uri"] = value.Uri.Value;
                }
                else
                {
                    Properties.Settings.Default["origin_uri"] = 0;
                }
            }

        }


        private void Origin_Chooser_Button_Click(object sender, RoutedEventArgs e)
        {
            // First filter the Origins to select from and then allow the user to choose an Origin
            TrimMainObjectSearch search = new TrimMainObjectSearch(Database, BaseObjectTypes.Origin);
            search.SetSearchString(string.Format("ognType:{0}", OriginType.WindowsFolder));

            SelectedOrigin = ObjectSelector.SelectOne(GetDesktopWindow(), search) as Origin;

            if (string.IsNullOrEmpty(SourceFolder))
            {
                SourceFolder = SelectedOrigin.OriginLocation;
            }
        }

        private void Select_Database_Button_Click(object sender, RoutedEventArgs e)
        {
            // Choose a different database
            DesktopHelper helper = new DesktopHelper();
            Database newDatabase = helper.SelectDatabase(GetDesktopWindow(), false, false);

            if (newDatabase != null)
            {
                if (Database != null)
                {
                    Database.Dispose();
                }

                Database = newDatabase;

                Properties.Settings.Default["dbid"] = Database.Id;

                IsDatabaseAvailable = Database.IsValid;
            }
        }

        protected override void OnClosing(System.ComponentModel.CancelEventArgs e)
        {
            // I am not a WPF expert and am not sure if OnClosing is the most reliable place to Dispose stuff.
            // In a cpmmercial app I would probably have a Controller where all this happened
            Properties.Settings.Default["on_schedule"] = IsOnSchedule;
            Properties.Settings.Default["source_folder"] = SourceFolder;
            Properties.Settings.Default["interval"] = Convert.ToInt32(Interval);

            Properties.Settings.Default.Save();

            if (Database != null)
            {
                Database.Dispose();
                Database = null;
            }

            if (_scheduler != null)
            {
                _scheduler.Dispose();
                _scheduler = null;
            }

            base.OnClosing(e);
        }

        private void Origin_Create_Btton_Click(object sender, RoutedEventArgs e)
        {
            // allow the user to create a new WindowsFolder type Origin
            if (Database.CurrentUser.HasPermission(UserPermissions.OriginManager))
            {
                Origin origin = new Origin(Database, OriginType.WindowsFolder);
                //  origin.Name = "test";
                if (PropertyEditor.EditModal(GetDesktopWindow(), origin))
                {
                    origin.Save();
                }
            }
            else
            {
                MessageBox.Show("You do not have sufficient privileges to create Origins.  Select an existing Origin or request a new one be created.");
            }
        }

        private void Source_Chooser_Button_Click(object sender, RoutedEventArgs e)
        {
            // choose the folder if you want to override the one set in the Origin
            System.Windows.Forms.FolderBrowserDialog folderBrowser = new System.Windows.Forms.FolderBrowserDialog();
            System.Windows.Forms.DialogResult result = folderBrowser.ShowDialog();

            SourceFolder = folderBrowser.SelectedPath;
        }

        private void Scan_Folder_Button_Click(object sender, RoutedEventArgs e)
        {
            // Import now
            Importer importer = new Importer(SelectedOrigin, SourceFolder);
            importer.Run();
        }


        private void Schedule_Run_Button_Click(object sender, RoutedEventArgs e)
        {
            // If the user changes the Scheduled Checkbox we start the scheduler, if appropriate
            if (_scheduler == null && IsOnSchedule)
            {
                if (string.IsNullOrEmpty(Interval)) {
                    Interval = "1";
                }

                _scheduler = new Scheduler(new Importer(SelectedOrigin, SourceFolder), Convert.ToInt32(Interval));
                _scheduler.Start();
            }
        }
    }
}
