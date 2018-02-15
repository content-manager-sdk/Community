using HP.HPTRIM.Service;
using HP.HPTRIM.ServiceModel;
using HP.HPTRIM.Service.ModelToSDKconvert;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Device.Location;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CustomPropertyPlugin
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

        // IsUsedFor is used in the process of parsing custom properties to check whether this property applies to a particular record.
        // Make sure this method is as per formant as possible.
        public override bool IsUsedFor(HP.HPTRIM.SDK.TrimObject tmo, string propName)
        {
            return tmo is HP.HPTRIM.SDK.Record;
        }

        public override object GetProperty(HP.HPTRIM.SDK.TrimObject tmo, HP.HPTRIM.SDK.Database database, IMainObjectRequest request)
        {
            return string.Format("test - {0}", DateTime.Now);
        }

        public override PropertyOrFieldFormat? Format => PropertyOrFieldFormat.String;

        public override string DisplayName => "My Custom Property";
    }

    [Api(Description = @"This is my custom property.")]
    public class MyCustomLocationProp : BaseCustomProperty
    {
        public override string PropertyName
        {
            get
            {
                return "MyTestCustomLocation";
            }
        }

        // IsUsedFor is used in the process of parsing custom properties to check whether this property applies to a particular record.
        // Make sure this method is as per formant as possible.
        public override bool IsUsedFor(HP.HPTRIM.SDK.TrimObject tmo, string propName)
        {
            return tmo is HP.HPTRIM.SDK.Record;
        }

        private bool tryGetCoordinate(string gps, out GeoCoordinate coordinate )
        {
            coordinate = null;
            if (gps.StartsWith("POINT"))
            {
                double longtitude = double.Parse(gps.Substring(gps.IndexOf("(") + 1, gps.IndexOf(" ") - (gps.IndexOf("(") + 1)));
                double latitude = double.Parse(gps.Substring(gps.IndexOf(" ")).Trim(')'));

                coordinate = new GeoCoordinate(latitude, longtitude);
                return true;
            }

            return false;
        }



        public override object GetProperty(HP.HPTRIM.SDK.TrimObject tmo, HP.HPTRIM.SDK.Database database, IMainObjectRequest request)
        {
            HP.HPTRIM.SDK.Record record = tmo as HP.HPTRIM.SDK.Record;
            HP.HPTRIM.SDK.Location closestLocation = null;

            double lastDistanceTo = 0;
            if (record != null)
            {

                if (!string.IsNullOrEmpty(record.GpsLocation))
                {
                    GeoCoordinate coord;
                    if (tryGetCoordinate(record.GpsLocation, out coord))
                    {


                        HP.HPTRIM.SDK.TrimMainObjectSearch search = new HP.HPTRIM.SDK.TrimMainObjectSearch(database, HP.HPTRIM.SDK.BaseObjectTypes.Location);
                        search.SetSearchString($"locGps:within 5 kilometres of record {record.Uri} and type:ProjectTeam");


                        foreach (HP.HPTRIM.SDK.Location location in search)
                        {
                            GeoCoordinate locationCoord;
                            if (tryGetCoordinate(location.GpsLocation, out locationCoord))
                            {
                                if (closestLocation == null)
                                {
                                    closestLocation = location;
                                    lastDistanceTo = locationCoord.GetDistanceTo(coord);
                                }
                                else if (locationCoord.GetDistanceTo(coord) < lastDistanceTo)
                                {
                                    closestLocation = location;
                                    lastDistanceTo = locationCoord.GetDistanceTo(coord);
                                }
                            }
                        }
                    }
                }
            }
            if (closestLocation != null)
            {
                return closestLocation.ToRefModel(request) as LocationRef;
            }

            return null;
        }

        public override PropertyOrFieldFormat? Format => PropertyOrFieldFormat.Object;

        public override BaseObjectTypes ObjectType => BaseObjectTypes.Location;

        public override string DisplayName => "Closest project team";
    }

}
