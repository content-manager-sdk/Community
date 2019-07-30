using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace ExexutableAddin
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        private void Application_Startup(object sender, StartupEventArgs e)
        {

            try
            {
                TrimApplication.Initialize();

                if (e.Args.Length < 4)
                {
                    MessageBox.Show("Please tag one or more records.");
                }
                else
                {
					// the temp file contains a Newline seperated list of URIs, so I replace newlines with commas which is what MainWindow expects.
					string uris = System.IO.File.ReadAllText(e.Args[3]).Replace(System.Environment.NewLine, ",");

                    MainWindow wnd = new MainWindow(e.Args[1], uris);
                    wnd.Show();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        
    }
}
