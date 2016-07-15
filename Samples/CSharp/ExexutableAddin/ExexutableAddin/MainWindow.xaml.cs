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

namespace ExexutableAddin
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private string _databaseId;
        private string _recordUris;
        public MainWindow(string databaseId, string recordUris)
        {
            InitializeComponent();
            _databaseId = databaseId;


            _recordUris = recordUris;


        }


        

        private void Button_Click(object sender, RoutedEventArgs e)
        {

            using (Database database = new Database())
            {
                database.Id = _databaseId;
                database.Connect();


                TrimMainObjectSearch search = new TrimMainObjectSearch(database, BaseObjectTypes.Record);
                search.SetSearchString(string.Format("unkUri: {0}", _recordUris));

                string msg = string.Empty;

                foreach (Record record in search)
                {
                    msg += record.Title + "\n";
                }

                MessageBox.Show(msg, "Record Titles");
            }

           // ((App)Application.Current)
        }
    }
}
