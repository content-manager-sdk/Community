using HP.HPTRIM.SDK;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SDKLocationResolver
{
    class Program
    {
        private static string FindInstalledTRIMPath()
        {
            RegistryKey[] registryHives =
            {
            Registry.LocalMachine,
            Registry.CurrentUser
        };

            string[] registryPaths =
            {
            @"SOFTWARE\Micro Focus\Content Manager\MSISettings",
            @"SOFTWARE\Hewlett-Packard\HP TRIM\MSISettings"
        };

            string INSTALLDIR = "INSTALLDIR";

            foreach (var hive in registryHives)
            {
                foreach (var regPath in registryPaths)
                {
                    RegistryKey msiSettingsKey = hive.OpenSubKey(regPath);
                    if (msiSettingsKey != null)
                    {
                        string installDir = msiSettingsKey.GetValue(INSTALLDIR) as string;
                        if (installDir != null && installDir.Length > 0)
                        {
                            return installDir;
                        }
                    }
                }
            }

            return null;
        }

        private static Assembly AssemblyResolveEventHandler(object sender, ResolveEventArgs args, string pathToSdkDll)
        {
            if (args.Name.Contains("HP.HPTRIM.SDK"))
            {
                Assembly assembly = Assembly.LoadFrom(pathToSdkDll);
                return assembly;
            }
            return null;
        }


        static void doSomething()
        {
            TrimApplication.Initialize();

            Database db = new Database();
            db.WorkgroupServerName = "local";
            db.Id = "L1";
            db.Connect();

            Console.WriteLine(db.CurrentUser.SortName);
        }



        static void Main(string[] args)
        {
            string installDir = FindInstalledTRIMPath();
            string pathToSdkDll = Path.Combine(installDir, "HP.HPTRIM.SDK.dll");
            AppDomain.CurrentDomain.AssemblyResolve += (sender, e) => AssemblyResolveEventHandler(sender, e, pathToSdkDll);


            // ensure that no SDK code is loaded in the method that configures the assembly resolver otherwise the .Net runtime will attempt
            // to load the SDK prior to the resolver being configured.
            doSomething();

        }
    }
}
