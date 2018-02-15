using HP.HPTRIM.ServiceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace CustomPropertyPlugin
{
    [DataContract]
    public class MyRecord : Record
    {
        [DataMember(Name = "MyTestCustomProperty")]
        public string MyTestCustomProperty
        {
            get;
            set;
        }

        [DataMember(Name = "MyTestCustomLocation")]
        public LocationRef MyTestCustomLocation
        {
            get;
            set;
        }
    }
}
