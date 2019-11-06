
using HP.HPTRIM.SDK;
using System;

namespace OneDriveSync
{
	public class OneDriveDocument
	{
		public string Id { get; internal set; }
		public long Uri { get; internal set; }
		public string LinkFileName { get; internal set; }
		public DateTime DateModified { get; internal set; }
	}
}
