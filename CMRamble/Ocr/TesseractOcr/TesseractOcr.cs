using log4net;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using Tesseract;
namespace CMRamble.Ocr.Tesseract
{
    public static class TesseractOcr
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(TesseractOcr));
        public static string AssemblyDirectory
        {
            get
            {
                string codeBase = Assembly.GetExecutingAssembly().CodeBase;
                UriBuilder uri = new UriBuilder(codeBase);
                string path = Uri.UnescapeDataString(uri.Path);
                return Path.GetDirectoryName(path);
            }
        }
        /// <summary>
        /// Exports all images from PDF and then runs OCR over each image, returning the name of the file on disk holding the OCR results
        /// </summary>
        /// <param name="filePath">Source file to be OCR'd</param>
        /// <param name="tessData">Tesseract Data Path</param>
        /// <returns>Name of file containing OCR contents</returns>
        public static string ExtractFromFile(string filePath)
        {
            var ocrFileName = string.Empty;
            var extension = Path.GetExtension(filePath).ToLower();
            if (extension.Equals(".pdf"))
            {
                // remove any files that were previously generated but not cleaned-up
                Directory.GetFiles(Path.GetDirectoryName(filePath), "*.png").ToList().ForEach(x => File.Delete(x));
                // must break out the original images within the PDF and then OCR those
                var localDirectory = Path.Combine(Path.GetDirectoryName(filePath), Path.GetFileNameWithoutExtension(filePath) + @"\");
                if (!Directory.Exists(localDirectory)) Directory.CreateDirectory(localDirectory);
                ocrFileName = Path.Combine(Path.GetDirectoryName(filePath), Path.GetFileNameWithoutExtension(filePath) + ".txt");
                FileHelper.Delete(ocrFileName);
                // call xpdf util pdftopng passing PDF and location to place images
                Process p = new Process();
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.RedirectStandardOutput = true;
                p.StartInfo.FileName = "pdftopng";
                p.StartInfo.Arguments = $"{filePath} {localDirectory}";
                Log.Debug($"Invoke: '{p.StartInfo.FileName} {p.StartInfo.Arguments}'");
                p.Start();
                string output = p.StandardOutput.ReadToEnd();
                p.WaitForExit();

                // instantiate the tesseract engine and then process the images
                // spin up an OCR engine and have it dump text to the OCR text file
                var tessDataDirectory = Path.Combine(AssemblyDirectory, "tessdata\\");
                var language = "eng";
                var engineMode = EngineMode.Default;
                Log.Debug($"TesseractEngine Language {language}, Mode {engineMode}, Directory {tessDataDirectory}");
                using (var engine = new TesseractEngine(tessDataDirectory, language, engineMode))
                {
                    // find all the images that were extracted
                    Log.Debug($"Image Directory: {localDirectory}");
                    var images = Directory.GetFiles(localDirectory, "*.png").ToList();
                    Log.Debug($"File count: {images.Count}");
                    foreach (var image in images)
                    {
                        Log.Debug($"Tesseract Pix {image}");
                        using (var img = Pix.LoadFromFile(image))
                        {
                            using (var page = engine.Process(img))
                            {
                                var pageText = page.GetText();
                                Log.Debug($"PageText.Length={pageText.Length};File={img}");
                                File.AppendAllText(ocrFileName, pageText + Environment.NewLine);
                            }
                        }
                        // clean-up as we go along
                        File.Delete(image);
                    }
                    Log.Debug("Disposing Engine");
                }
                Directory.Delete(localDirectory);
            }
            return ocrFileName;
        }
    }
}
