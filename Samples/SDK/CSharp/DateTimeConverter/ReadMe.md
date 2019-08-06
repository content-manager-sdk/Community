# DateTime converter
Using DateTimes from a web service application requires some careful thought to handle the user's time zones appropriately.  This sample code demonstrates one approach.


## Setting user's Timezone
The best way to support users from different time zones using the same web service is to request the user set their time-zone in the Web Client User options and then use that time zone whenever instantiating a Database object.

### Getting a list of time-zones
A list of timezones supported on the web server can be retrieved using TrimApplication.GetTimeZones().

```.cs
var timeZones = TrimApplication.GetTimeZones();

foreach (string tz in timeZones)
{
	Console.WriteLine(tz);
}
```

### Saving the user's time zone.
You can preserve the user's selected time zone in the web client user options as seen in the code below.

```.cs
TrimUserOptionSet webclientOption = new TrimUserOptionSet(database, UserOptionSetIds.WebClient);
webclientOption.SetPropertyString(PropertyIds.WebClientUserOptionsTimezone, "(UTC + 02:00) Tripoli");
webclientOption.Save();
```

### When a user makes a request of your web service you can set the time zone on the database object from their user options.

```.cs
TrimUserOptionSet webclientOption = new TrimUserOptionSet(database, UserOptionSetIds.WebClient);
string timeZone = webclientOption.GetPropertyString(PropertyIds.WebClientUserOptionsTimezone);

database.SetTimezoneString(timeZone);
```

## Setting the value of DateTime properties
Given that the TrimDateTime object operates in the time zone local to the machine, not the time zone set on the Database, it can cause incorrect results.  The best approach is to convert the DateTime to a the local time as per the user's database before setting it on a property.  The class DateTimeConvert in this sample does this in the method ToLocalTime.


## Getting UTC
As of CM 9.4 the method TrimDatetime.ToDateTimeUTC() can return an incorrect result, to avoid this use DateTimeComvert.ToUtc().