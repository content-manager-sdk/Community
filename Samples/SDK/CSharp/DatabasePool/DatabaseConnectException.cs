using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HP.HPTRIM.SDK.Samples
{
   public class DatabaseConnectException : Exception
    {
        public DatabaseConnectException(string message) : base(message) { }
    }
}
