using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace HP.HPTRIM.SDK.Samples.ImportUsingOrigin
{
    public class Importer : IRunnable
    {

        Origin _origin;
        string _folder;
        bool _running;

        public Importer(Origin origin, string folder)
        {
            _origin = origin;
            _folder = folder;
        }

        public void Run()
        {
            _running = true;
            try
            {
                OriginHistory history = _origin.StartBatch(_folder);


                foreach (string file in scanFolder(_folder))
                {
                   
                    Record record = _origin.NewRecord(history);

                    // We need to call this to trigger the Origin functionality to create a new folder
                    // and put this Record in the folder
                    _origin.AllocateContainer(record);

                    record.SetDocument(file);
                    record.Save();

                    File.Delete(file);
                }
            }
            finally
            {
                _running = false;
            }

        }


        private IEnumerable<string> scanFolder(string folder)
        {

            if (!_origin.ExcludeDirectoryList.Any(dd => dd.Equals(folder, StringComparison.InvariantCultureIgnoreCase)))
            {
                foreach (string subFolder in Directory.GetDirectories(folder))
                {
                    foreach (string fp in scanFolder(subFolder))
                    {
                        yield return fp;
                    }
                }

                foreach (string filePath in Directory.GetFiles(folder))
                {
                    if (!_origin.ExcludeFileList.Any(ff => ff.Equals(Path.GetFileName(filePath), StringComparison.InvariantCultureIgnoreCase)))
                    {
                        FileAttributes attributes = File.GetAttributes(filePath);

                        if (_origin.ExcludeHiddenFiles
                            && (attributes & FileAttributes.Hidden) == FileAttributes.Hidden)
                        {
                            continue;
                        }

                        if (fileisExcluded(filePath))
                        {
                            continue;
                        }

                        yield return filePath;
                    }
                }
            }
        }

        private bool fileisExcluded(string filePath)
        {
            List<string> exludeExtension = new List<string>();

            if (_origin.ExcludeBinaryFiles)
            {
                exludeExtension.AddRange(new string[] { "exe", "dll", "obj" });
            }

            if (_origin.ExcludeRenditions)
            {
                exludeExtension.AddRange(new string[] { "ann", "ocr", "dsg" });
            }

            if (_origin.ExcludeTRIMReferenceFiles)
            {
                exludeExtension.Add("tr5");
            }

            if (exludeExtension.Any(ss => ss.Equals(Path.GetExtension(filePath), StringComparison.InvariantCultureIgnoreCase)))
            {
                return true;
            }

            if (!string.IsNullOrEmpty(_origin.FilterRegex) 
                && Regex.IsMatch(filePath, _origin.FilterRegex))
            {
                return true;
            }

            if (_origin.ExcludeFileList.Any(ss => ss.Equals( Path.GetFileName(filePath), StringComparison.InvariantCultureIgnoreCase)))
            {
                return true;
            }

            return false;
        }


        public bool Running
        {
            get { return _running; }
        }
    }
}

