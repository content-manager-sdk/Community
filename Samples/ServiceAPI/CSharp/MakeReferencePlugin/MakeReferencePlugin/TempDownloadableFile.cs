using ServiceStack.IO;
using System;
using System.IO;

namespace HP.HPTRIM.ServiceAPI.Samples
{
    /// <summary>
    /// A virtual file that will load the file into memory and then delete then delete the file.
    /// </summary>
    public class TempDownloadableFile : IVirtualFile
    {

        // I created this class simply so that I could delete the temp file once we have downloaded.
        // Trying to achieve this in the service using a finally block always resulted in the file
        // being deleted before the service framework had actually downloaded it.

        MemoryStream _stream = null;

        FileInfo _fileInfo;
        public TempDownloadableFile(string fileName)
        {
  

            _fileInfo = new FileInfo(fileName);

            try
            {
                VirtualPath = fileName;
                Extension = _fileInfo.Extension;
                LastModified = File.GetLastWriteTime(fileName);
                Length = _fileInfo.Length;
                Name = _fileInfo.Name;
                RealPath = fileName;

                _stream = new MemoryStream();

                using (FileStream fs = _fileInfo.OpenRead())
                {
                    fs.CopyTo(_stream);
                    fs.Close();
                }


            }
            finally
            {
                _fileInfo.Delete();
            }
        }

        public IVirtualDirectory Directory
        {
            get
            {
                return null;
            }
        }

        public string Extension
        {
            private set;
            get;
        }

        public bool IsDirectory
        {
            get
            {
                return false;
            }
        }

        public DateTime LastModified
        {
            private set;
            get;
        }

        public long Length
        {
            private set;
            get;
        }

        public string Name
        {
            private set;
            get;
        }

        public string RealPath
        {
            private set;
            get;
        }

        public string VirtualPath
        {
            private set;
            get;
        }

        public IVirtualPathProvider VirtualPathProvider
        {
            get
            {
                return null;
            }
        }

        public string GetFileHash()
        {
            return null;
        }

        public Stream OpenRead()
        {
            try
            {
                return _stream;
            }
            finally
            {
                _stream.Dispose();
                _stream = null;
            }

        }

        public StreamReader OpenText()
        {
            return null;
        }

        public string ReadAllText()
        {
            return null;
        }
    }
}
