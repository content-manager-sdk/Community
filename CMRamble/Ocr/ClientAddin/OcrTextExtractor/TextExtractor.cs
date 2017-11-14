using CMRamble.Ocr.Util;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using Tesseract;
namespace CMRamble.Ocr
{
    public static class TextExtractor
    {
        /// <summary>
        /// Exports all images from PDF and then runs OCR over each image, returning the name of the file on disk holding the OCR results
        /// </summary>
        /// <param name="filePath">Source file to be OCR'd</param>
        /// <returns>Name of file containing OCR contents</returns>
        public static string ExtractFromFile(string filePath)
        {
            var ocrFileName = string.Empty;
            var extension = Path.GetExtension(filePath).ToLower();
            if (extension.Equals(".pdf"))
            {   
                // must break out the original images within the PDF and then OCR those
                var localDirectory = Path.Combine(Path.GetDirectoryName(filePath), Path.GetFileNameWithoutExtension(filePath));
                ocrFileName = Path.Combine(Path.GetDirectoryName(filePath), Path.GetFileNameWithoutExtension(filePath) + ".txt");
                FileHelper.Delete(ocrFileName);
                // call xpdf util pdftopng passing PDF and location to place images
                Process p = new Process();
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.RedirectStandardOutput = true;
                p.StartInfo.FileName = "pdftopng";
                p.StartInfo.Arguments = $"\"{filePath}\" \"{localDirectory}\"";
                p.Start();
                string output = p.StandardOutput.ReadToEnd();
                p.WaitForExit();
                // find all the images that were extracted
                var images = Directory.GetFiles(Directory.GetParent(localDirectory).FullName, "*.png").ToList();
                foreach (var image in images)
                {
                    // spin up an OCR engine and have it dump text to the OCR text file
                    using (var engine = new TesseractEngine(@"./tessdata", "eng", EngineMode.Default))
                    {
                        using (var img = Pix.LoadFromFile(image))
                        {
                            using (var page = engine.Process(img))
                            {
                                File.AppendAllText(ocrFileName, page.GetText() + Environment.NewLine);
                            }
                        }
                    }
                    // clean-up as we go along
                    File.Delete(image);
                }
            }
            return ocrFileName;
        }
    }
}
