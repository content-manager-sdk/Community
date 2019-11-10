using OneDriveAuthPlugin;
using OneDriveConnector;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace OneDriveSync
{
	class OneDriveSync
	{
		private BackgroundWorker worker;

		public OneDriveSync()
		{
			worker = new BackgroundWorker()
			{
				WorkerSupportsCancellation = true,
				WorkerReportsProgress = true
			};
			worker.DoWork += worker_DoWork;
			worker.ProgressChanged += worker_ProgressChanged;
			worker.RunWorkerCompleted += worker_RunWorkerCompleted;

			Timer timer = new Timer(1000 * 30);
			timer.Elapsed += timer_Elapsed;
			timer.Start();
		}

		void timer_Elapsed(object sender, ElapsedEventArgs e)
		{
			if (!worker.IsBusy)
				worker.RunWorkerAsync();
		}

		void worker_DoWork(object sender, DoWorkEventArgs e)
		{
			try
			{
				Console.WriteLine("Running sync");
				BackgroundWorker w = (BackgroundWorker)sender;

				var token = Tokens.getApplicationToken();

				using (TrimHelper trimHelper = new TrimHelper())
				{

					foreach (var doc in trimHelper.GetDeleteableDocuments())
					{
						Console.WriteLine($"rec: {doc.Id}");

						try
						{
							if (!string.IsNullOrWhiteSpace(doc.Id))
							{

								
								var fileResult = ODataHelper.GetItem<OneDriveItem>(GraphApiHelper.GetOneDriveItemIdUrl(doc.Id), token, null);
								fileResult.Wait();			

									var item = fileResult.Result;

								var isLocked =  ODataHelper.IsLocked(GraphApiHelper.GetOneDriveItemIdUrlForDelete(doc.Id), item.Name, token);
								isLocked.Wait();

								if (isLocked.Result == true)
								{
									Console.WriteLine("Item is locked will try again later");

								}
								else
								{
									var modified = doc.DateModified.ToUniversalTime();
									if (item.LastModifiedDateTime > modified)
									{
										trimHelper.CheckinFromDrive(doc, token);
									}

									StringContent content = new StringContent($"[TrimLink]{Environment.NewLine}Uri={doc.Uri}", Encoding.UTF8, "text/plain");
									string url = GraphApiHelper.GetOneDriveFileUploadUrlFromId(item.ParentReference.DriveId, item.ParentReference.Id, doc.LinkFileName);


									// delete original file
									var deleteResult = ODataHelper.DeleteWithToken(GraphApiHelper.GetOneDriveItemIdUrlForDelete(doc.Id), token);
									deleteResult.Wait();


									// Create link in Drive
									var uploadResult = ODataHelper.SendRequestWithAccessToken(url, token, content, method: HttpMethod.Put);
									uploadResult.Wait();

									trimHelper.ClearDriveId(doc);
									trimHelper.ResetDeleteNow(doc);

									Console.WriteLine(fileResult.Result.ParentReference.Id);
								}
							} else
							{
								trimHelper.ResetDeleteNow(doc);
							}

						
						}
						catch (Exception ex)
						{
							if (ex.InnerException != null)
							{
								Console.WriteLine(ex.InnerException.Message);
								Console.WriteLine(ex.InnerException.StackTrace);
							}
							else
							{
								Console.WriteLine(ex.Message);
								Console.WriteLine(ex.StackTrace);
							}
						}
					}

				}

				//	while (/*condition*/)
				//	{
				//check if cancellation was requested
				if (w.CancellationPending)
				{
					//take any necessary action upon cancelling (rollback, etc.)

					//notify the RunWorkerCompleted event handler
					//that the operation was cancelled
					e.Cancel = true;
					return;
				}
			}
			catch (Exception ex)
			{

				Console.WriteLine(ex.Message);
				Console.WriteLine(ex.StackTrace);

			}
			//report progress; this method has an overload which can also take
			//custom object (usually representing state) as an argument
			//	w.ReportProgress(/*percentage*/);

			//do whatever You want the background thread to do...
			//}
		}

		void worker_ProgressChanged(object sender, ProgressChangedEventArgs e)
		{
			//display the progress using e.ProgressPercentage and/or e.UserState
		}

		void worker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
		{
			if (e.Cancelled)
			{
				//do something
			}
			else
			{
				//do something else
			}
		}
	}
}
