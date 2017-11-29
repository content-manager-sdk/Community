using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreateLocation.DesignTime
{
    public class CreateLocationDT
    {
        public CreateLocationDT()
        {
            NewLocationType = 4;
        }
        public int NewLocationType
        {

            get;
            set;
        }

        private PropertyCaptions propertyCaptions;
        public PropertyCaptions PropertyCaptions
        {
            get
            {
                return propertyCaptions ?? (propertyCaptions = new PropertyCaptions());
            }
        }
    }
}
