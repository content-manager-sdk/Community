using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HP.HPTRIM.SDK.Samples
{
    class Program
    {
        static void Main(string[] args)
        {
            TrimApplication.Initialize();

            Stopwatch watch = new Stopwatch();
            watch.Start();

            DatabasePoolEntry poolEntry = DatabasePool.Instance.AcquirePoolEntry("J1", "itu_tadmin");

            Console.WriteLine(poolEntry.TrimDatabase.CurrentUser.SortName);

            DatabasePool.Instance.ReleasePoolEntry(poolEntry.Id);

            watch.Stop();

            Console.WriteLine(watch.ElapsedMilliseconds);


            watch.Restart();

            poolEntry = DatabasePool.Instance.AcquirePoolEntry("J1", "itu_tadmin");


            Console.WriteLine(poolEntry.TrimDatabase.CurrentUser.SortName);

            DatabasePool.Instance.ReleasePoolEntry(poolEntry.Id);

            watch.Stop();

            Console.WriteLine(watch.ElapsedMilliseconds);

            DatabasePool.Instance.Dispose();
        }
    }
}
