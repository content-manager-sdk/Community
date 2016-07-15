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

                    MainWindow wnd = new MainWindow(e.Args[1], e.Args[3]);
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
