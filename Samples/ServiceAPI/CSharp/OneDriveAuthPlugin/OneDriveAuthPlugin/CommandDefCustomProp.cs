using HP.HPTRIM.Service;
using HP.HPTRIM.ServiceModel;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneDriveAuthPlugin
{
	public class CommandDefCustomProp : BaseCustomProperty
	{
		public override string PropertyName
		{
			get
			{
				return "CommandDefs";
			}
		}

		// IsUsedFor is used in the process of parsing custom properties to check whether this property applies to a particular record.
		// Make sure this method is as per formant as possible.
		public override bool IsUsedFor(HP.HPTRIM.SDK.TrimObject tmo, string propName)
		{
			return tmo is HP.HPTRIM.SDK.Record;
		}



		public override object GetProperty(HP.HPTRIM.SDK.TrimObject tmo, HP.HPTRIM.SDK.Database database, IMainObjectRequest request)
		{
			return RegisterFileService.getCommandDefs(tmo as HP.HPTRIM.SDK.Record);
		}

		public override PropertyOrFieldFormat? Format => PropertyOrFieldFormat.String;

		public override string DisplayName => "My Custom Property";
	}

}