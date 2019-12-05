using HP.HPTRIM.ServiceModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	[DataContract]
	public class CustomRecord : Record
	{
		[DataMember(Name = "CommandDefs")]
		public IList<MyCommandDef> CommandDefs { get; set; }


	}

	[DataContract]
	public class CustomCheckinPlace : CheckinPlace
	{
		[DataMember(Name = "CommandDefs")]
		public IList<MyCommandDef> CommandDefs { get; set; }


	}
}
