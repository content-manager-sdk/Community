using HP.HPTRIM.Service;
using System;
using System.Collections.Generic;
using HP.HPTRIM.ServiceModel;
using ServiceStack;

namespace GoogleAuthPlugin
{
    [Api(Description = @"This is my custom property.")]
    public class MyCustomProp : BaseCustomProperty
    {
        public override string PropertyName
        {
            get
            {
                return "MyTestCustomProperty";
            }
        }

        public override bool IsUsedFor(HP.HPTRIM.SDK.TrimObject tmo, string propName)
        {
            return tmo is HP.HPTRIM.SDK.Record;
        }



        public override object GetProperty(HP.HPTRIM.SDK.TrimObject tmo, HP.HPTRIM.SDK.Database database, IMainObjectRequest request)
        {
            return new TrimStringProperty() { Value = string.Format("test - {0}", DateTime.Now) };
        }

        
    }
}
