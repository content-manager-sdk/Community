using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFirstSearchApplication
{
    class Program
    {
        static void Main(string[] args)
        {
            // Call Initialise first to load the native DLLs used by the SDK. This causes any exceptions (such as running in 64 bit mode on a 32 bit OS)
            // to be thrown at the start rather than when you first attempt to use the SDK.
            TrimApplication.Initialize();

            // Always Dispose the Database to clean up resources used by underlying managed code
            using (Database database = new Database())
            {

                database.Id = "J1";                
                database.Connect();



            }

        }
    }
}
