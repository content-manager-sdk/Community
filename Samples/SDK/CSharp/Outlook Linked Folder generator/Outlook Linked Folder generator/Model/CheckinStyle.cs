using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FolderGenerator
{
    public class CheckinStyle
    {
        private long uri;
        public CheckinStyle(HP.HPTRIM.SDK.CheckinStyle sourceStyle)
        {
            Name = sourceStyle.Name;
            uri = sourceStyle.Uri;
            Link = true;
        }


        public bool Link { get; set; }

        public string Name { get; set; }

        public long GetUri()
        {
            return uri;
        }
    }
}
