//using HP.HPTRIM.SDK;
using HP.HPTRIM.SDK;
using System;
using System.IO;
using System.Reflection;


namespace Test_Loading_Assembly
{
	class Program
	{

		// I am setting the path to the binaries in the app config
		// for production systems it might make more sense to check the registry, for example: 
		// * HKEY_LOCAL_MACHINE\SOFTWARE\Micro Focus\Content Manager\MSISettings\INSTALLDIR, or 
		// * HKEY_CURRENT_USER\SOFTWARE\Micro Focus\Content Manager\MSISettings\INSTALLDIR
		private static string _binPath;

		static Program()
		{
			_binPath = System.Configuration.ConfigurationManager.AppSettings["TrimPath"];

			AppDomain currentDomain = AppDomain.CurrentDomain;
						currentDomain.AssemblyResolve += CurrentDomain_AssemblyResolve;
		}

		static void Main(string[] args)
		{

			TrimApplication.TrimBinariesLoadPath = _binPath;

			using (Database database = new Database())
			{
				database.WorkgroupServerName = "local";
				database.Id = "L1";
				database.Connect();

				Console.WriteLine(database.CurrentUser.SortName);
			}
		}

		private static Assembly CurrentDomain_AssemblyResolve(object sender, ResolveEventArgs args)
		{
			//This handler is called only when the common language runtime tries to bind to the assembly and fails.

			//Retrieve the list of referenced assemblies in an array of AssemblyName.
			Assembly MyAssembly, objExecutingAssemblies;
			string strTempAssmbPath = "";

			objExecutingAssemblies = Assembly.GetExecutingAssembly();
			AssemblyName[] arrReferencedAssmbNames = objExecutingAssemblies.GetReferencedAssemblies();

			//Loop through the array of referenced assembly names.
			foreach (AssemblyName strAssmbName in arrReferencedAssmbNames)
			{
				//Check for the assembly names that have raised the "AssemblyResolve" event.
				if (strAssmbName.FullName.Substring(0, strAssmbName.FullName.IndexOf(",")) == args.Name.Substring(0, args.Name.IndexOf(",")))
				{
					//Build the path of the assembly from where it has to be loaded.
				   strTempAssmbPath = Path.Combine(_binPath, args.Name.Substring(0, args.Name.IndexOf(",")) + ".dll");
					break;
				}

			}
			//Load the assembly from the specified path. 
			MyAssembly = Assembly.LoadFrom(strTempAssmbPath);

			//Return the loaded assembly.
			return MyAssembly;


		}
	}
}
