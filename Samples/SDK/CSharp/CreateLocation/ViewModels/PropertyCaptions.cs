using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreateLocation
{
    public class PropertyCaptions : Dictionary<PropertyIds, string>
    {
        Database _database;
        public PropertyCaptions()
        {
        }

        public PropertyCaptions(Database database)
        {
            _database = database;
        }


        private Dictionary<PropertyIds, string> _captions = new Dictionary<PropertyIds, string>();
        public new string this[PropertyIds propertyId]
        {
            get
            {
                if (_database == null)
                { 
                    return $"{propertyId}";
                }

                if (!_captions.ContainsKey(propertyId))
                {
                    _captions.Add(propertyId, new PropertyDef(propertyId, _database).Caption);
                }
                return _captions[propertyId];
            }
        }
    }
}
