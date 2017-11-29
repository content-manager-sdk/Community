using HP.HPTRIM.ServiceModel;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace GoogleAuthPlugin
{
    // It is very important to include the DataContract attribute otherwise this class will cause all properties on the Record
    // object to be improperly named when de-serialized.
    [DataContract]
    public class MyRecord : Record
    {
        [DataMember(Name = "MyTestCustomProperty")]
        public TrimStringProperty MyTestCustomProperty
        {
            get;
            set;
        }
    }
}
