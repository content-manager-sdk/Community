using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DownloadNotifierSample
{
    class Program
    {

        private static string _fn;
        static void Main(string[] args)
        {
            bool isRunning = true;
            ConsoleKeyInfo key;


            Console.WriteLine("Done... Press any key to close");


            using (Database database = new Database())
            {
                database.Id = "J1";
                database.Connect();

                Record record = new Record(database, "REC_1");
                _fn = record.SuggestedFileName;


                using (DownloadNotifier notifier = new DownloadNotifier(database))
                {
                    notifier.OnChunkAvailable += notifier_OnChunkAvailable;
                    record.GetDocument(null, false, "", "");
                }


                do
                {

                    key = Console.ReadKey(true);


                    if (key.KeyChar == 'q')
                    {
                        isRunning = false;
                    }

                } while (isRunning);

            }
        }

        static void notifier_OnChunkAvailable(byte[] chunk, long chunkPos, long chunkLen, bool lastChunk)
        {
            using (var stream = new FileStream("c:\\junk\\dntest\\" + _fn, FileMode.Append))
            {
                stream.Write(chunk, 0, chunk.Length);
            }
        }
    }
}
