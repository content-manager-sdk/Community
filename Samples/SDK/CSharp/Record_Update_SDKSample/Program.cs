using System;
using System.Collections.Generic;
using System.Linq;
//using System.Threading.Tasks;
using System.Windows.Forms;
using HP.HPTRIM.SDK;

namespace Record_Update_SDKSample
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new SampleForm());
            //Calling initialize() loads the Content Manager runtime environment and reports errors if there are any.
            TrimApplication.Initialize();
        }
    }
}
