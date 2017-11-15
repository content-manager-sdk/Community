using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMRamble.Ocr.Core
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
