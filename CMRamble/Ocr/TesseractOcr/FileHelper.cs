using System;
using System.IO;

namespace CMRamble.Ocr.Tesseract
{
    public static class FileHelper
    {
        public static void Delete(string fileName)
        {
            try
            {
                if ( File.Exists(fileName) )
                {
                    File.Delete(fileName);
                }
            }
            catch ( Exception ex )
            {

            }
        }
    }
}
