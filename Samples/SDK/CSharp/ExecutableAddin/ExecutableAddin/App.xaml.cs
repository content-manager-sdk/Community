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


				string uris = null;
				string dbid = null;

				for (int counter = 0; counter < e.Args.Length; counter++)
				{
					if (e.Args[counter] == "--dbid")
					{
						dbid = e.Args[counter + 1];
					}

					if (e.Args[counter] == "--uris")
					{
						uris = e.Args[counter + 1];
					}
				}

				if (string.IsNullOrEmpty(uris))
				{
					MessageBox.Show("Please tag one or more records.", "Addin", MessageBoxButton.OK, MessageBoxImage.Information);
					return;
				}

				if (string.IsNullOrEmpty(dbid))
				{
					MessageBox.Show("Addin incorrectly configured, no database ID sent.", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
					return;
				}


				// if uris is a comma separated list do nothing, otherwise read the file containing the list of URIs
				long tmp;
				if (!Int64.TryParse(uris.Split(',').First(), out tmp))
				{
					// the temp file contains a Newline separated list of URIs, so I replace newlines with commas which is what MainWindow expects.
					uris = System.IO.File.ReadAllText(uris).Replace(System.Environment.NewLine, ",");
				}

				MainWindow wnd = new MainWindow(dbid, uris);
				wnd.Show();

			}
			catch (Exception ex)
			{
				MessageBox.Show(ex.Message);
			}
		}


	}
}
