using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Xamarin.Forms;

namespace TrimBrowser
{
    public class FilePreviewViewModel : BaseViewModel
    {
        private Item _item;
        public FilePreviewViewModel(Item item)
        {
            _item = item;


            MessagingCenter.Subscribe<FilePreviewPage>(this, "GetFile", async (obj) =>
            {
                var docsPath = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);
                var filePath = System.IO.Path.Combine(docsPath, $"{item.Id}.{item.Extension}");

                File.Delete(filePath);
                using (FileStream fileStream = File.Create(filePath))
                using (Stream stream = await DataStore.GetDocument(_item))
                {
                    stream.CopyTo(fileStream);
                }

                FileUrl = filePath;

                obj.ShowFile(filePath);
            });
        }



        private string fileUrl;
        public string FileUrl
        {
            get { return fileUrl; }
            set
            {
                SetProperty(ref fileUrl, value);

            }
        }
    }
}
