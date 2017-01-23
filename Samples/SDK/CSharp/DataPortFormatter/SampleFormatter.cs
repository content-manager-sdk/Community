using System;
using System.Collections.Generic;
using System.IO;
using System.Windows.Forms;
using HP.HPTRIM.DataPort;
using HP.HPTRIM.DataPort.Framework.DataFormatters;

namespace DataPortFormatter
{
	public class SampleFormatter : IImportDataFormatter
	{
		private string			m_fileName	= string.Empty;
		private StreamReader	m_reader	= null;
		private long			m_itemRow	= 0;

		/// <summary>
		/// The caption that will be displayed above the KwikSelect control with 
		/// which the user selects the source of the data to be imported.
		/// </summary>
		public string KwikSelectCaption
		{
			get
			{
				return "Path to the sample file";
			}
		}

		/// <summary>
		/// The type of Origin to be created in HP Content Manager for the import.
		/// Most likely one of either TextFile, WindowsFolder, XMLFile or Custom<n>.
		/// The others are used by various in house integrations.
		/// </summary>
		public HP.HPTRIM.SDK.OriginType OriginType
		{
			get
			{
				return HP.HPTRIM.SDK.OriginType.TextFile;
			}
		}

		/// <summary>
		/// This event is called when a user clicks on the data source KwikSelect's button.
		/// </summary>
		/// <param name="parentForm">The main TRIMDataPortConfig.exe form</param>
		/// <param name="searchPrefix">The value that is in the text portion of the KwikSelect</param>
		/// <param name="suggestedBrowseUILocation">The point at which we advise any dialogues should be placed.</param>
		/// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
		/// <returns>A string that this dataformatter will use to resolve the data source during an import</returns>
		public string Browse(System.Windows.Forms.Form parentForm, string searchPrefix, System.Drawing.Point suggestedBrowseUILocation, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
		{
			string retVal = "";
			FileDialog fileDialog = new OpenFileDialog();
			fileDialog.Filter = "Text Files|*.txt|All Files|*.*";
			fileDialog.InitialDirectory = searchPrefix;

			if (fileDialog.ShowDialog(parentForm) == DialogResult.OK)
			{
				retVal = fileDialog.FileName;
			}
			return retVal;
		}

		/// <summary>
		/// DataPort has finished importing the data and no longer requires the data source.
		/// </summary>
		/// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
		public void CloseConnection(Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
		{
			if (m_reader != null)
			{
				m_reader.Close();
				m_reader.Dispose();
				m_reader = null;
			}
		}

		/// <summary>
		/// This function is called by DataPort when it needs to display the fields contained in the data source
		/// </summary>
		/// <param name="validatedSource">The already validated connection string for the data source</param>
		/// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
		/// <returns>A list of field names available in the data source</returns>
		public List<string> GetFieldNames(string validatedSource, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
		{
			List<string> retVal = new List<string>();

			using (StreamReader reader = new StreamReader(validatedSource))
			{
				string line = reader.ReadLine();
				if (!string.IsNullOrWhiteSpace(line))
				{
					retVal = split(line, '\t');
				}

				reader.Close();
			}

			return retVal;
		}

		/// <summary>
		/// This function is called when DataPort is running an import to identify the data source 
		/// in a manner that is useful to humans.
		/// </summary>
		/// <param name="validatedSource">The already validated connection string for the data source</param>
		/// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
		/// <returns>A human readable identifier for this formatter</returns>
		public string GetFormatterInfo(string validatedSource, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
		{
			string retVal = "";

			using (StreamReader reader = new StreamReader(validatedSource))
			{
				reader.ReadLine();
				retVal = string.Format("{0}: {1}", validatedSource, reader.CurrentEncoding.EncodingName);
				reader.Close();
			}

			return retVal;
		}

		/// <summary>
		/// Called during an import to obtain the items contained in the data source
		/// </summary>
		/// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
		/// <returns></returns>
		public ImportItem GetNextItem(Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
		{
			if (m_reader == null)
			{
				MessageBox.Show("The reader is null.  Something terrible has occurred.", "Formatter Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
				return null;
			}

			List<string> values = new List<string>();

			if (m_reader.Peek() > 0)
			{
				values = split(m_reader.ReadLine(), '\t');
			}

			m_itemRow++;

			// Must return null when we're done.  A tab delim file is finished when it contains no more values...
			ImportItem retVal = null;

			if ( values.Count > 0 )
			{
				retVal = new ImportItem(m_itemRow.ToString(), values);
			}

			return retVal;
		}

		/// <summary>
		/// This function is called when DataPort has completed the import.
		/// </summary>
		/// <param name="stats">The statistics of what occurred in the import including things like the number created, updated or the errors that occurred.</param>
		/// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
		public void ImportCompleted(ProcessStatistics stats, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
		{
			// You may want to write the stats to your own file or send an email or anything else that pleases you...
		}

		/// <summary>
		/// This function is called before DataPort uses a data source
		/// </summary>
		/// <param name="validatedSource">The already validated connection string for the data source</param>
		/// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
		public void Initialize(string validatedSource, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
		{
			m_fileName = validatedSource;

			m_reader = new StreamReader(validatedSource);

			m_reader.ReadLine(); // read the header row so GetNextItem returns the first line of Data
		}

		/// <summary>
		/// This function is called after every item that is imported.  This is a synchronous call so anything 
		/// in this function will be processed before the next item can be imported.
		/// </summary>
		/// <param name="validatedSource">The already validated connection string for the data source</param>
		/// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
		public void ItemProcessed(ImportItem processedItem, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
		{
			// You may use your imagination with this call...
		}

		/// <summary>
		/// This function is called by DataPort to allow the formatter to determine if the connection string
		/// the user has selected is valid for the purpose.
		/// </summary>
		/// <param name="parentForm">The main DataPort Config form</param>
		/// <param name="connectionStringToValidate">The connection string that the user has entered</param>
		/// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
		/// <returns>The connection string if valid or an empty string if not</returns>
		public string Validate(System.Windows.Forms.Form parentForm, string connectionStringToValidate, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
		{
			string retVal = string.Empty;

			if (!string.IsNullOrWhiteSpace(connectionStringToValidate) 
				&& File.Exists(connectionStringToValidate))
			{
				// For the sample we're just checking that the file exists.  It would be 
				// prudent to open the file and check that it is in the correct format...
				retVal = connectionStringToValidate;
			}

			return retVal;
		}

		#region Helper functions

		/// <summary>
		/// Splits a string on a specific character as long as it is not escaped by a backslash '\'
		/// </summary>
		/// <param name="whichString">The string to split</param>
		/// <param name="onWhichUnescapedChar">The char on which to split</param>
		/// <returns></returns>
		public static List<string> split(string whichString, Char onWhichUnescapedChar)
		{
			bool escaped = false;
			List<string> retVal = new List<string>();
			List<Char> currentEntry = new List<Char>();

			foreach (Char c in whichString)
			{
				if (!escaped
					&& c == onWhichUnescapedChar)
				{
					retVal.Add(string.Join(string.Empty, currentEntry.ToArray()));
					currentEntry.Clear();
				}
				else
				{
					currentEntry.Add(c);
					escaped = !escaped && c.Equals('\\');
				}
			}

			retVal.Add(string.Join(string.Empty, currentEntry.ToArray()));

			return retVal;
		}

		#endregion

		#region IDisposable Support

		private bool disposedValue = false; // To detect redundant calls

		protected virtual void Dispose(bool disposing)
		{
			if (!disposedValue)
			{
				if (disposing)
				{
					if (m_reader != null)
					{
						this.CloseConnection(null);
					}
				}

				// TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
				// TODO: set large fields to null.

				disposedValue = true;
			}
		}

		// TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
		// ~SampleFormatter() {
		//   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
		//   Dispose(false);
		// }

		// This code added to correctly implement the disposable pattern.
		public void Dispose( )
		{
			// Do not change this code. Put cleanup code in Dispose(bool disposing) above.
			Dispose(true);
			// TODO: uncomment the following line if the finalizer is overridden above.
			// GC.SuppressFinalize(this);
		}
		#endregion
	}
}
