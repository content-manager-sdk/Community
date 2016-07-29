using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace HP.HPTRIM.SDK.Samples.BulkLoading
{
    public static class Extensions
    {
        public static void AddValue(this PropertyOrFieldValueList propList, PropertyIds pid, object value)
        {
            PropertyDef propDef = new PropertyDef(pid);

            PropertyOrFieldValue propValue = new PropertyOrFieldValue(pid);

            if (propDef.Format == PropertyFormats.Date
                || propDef.Format == PropertyFormats.Datetime)
            {
                propValue.SetValue(DateTime.ParseExact((string)value, "yyyy-MM-ddTHH:mm:ssK", CultureInfo.InvariantCulture));
            }
            else if (propDef.Format == PropertyFormats.Object)
            {
                propValue.SetValue((long)value);
            }
            else
            {

                propValue.SetValue((string)value);
            }

            propList.Add(propValue);
        }
    }
}
