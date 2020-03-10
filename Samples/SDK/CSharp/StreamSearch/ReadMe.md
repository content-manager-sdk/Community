# Stream Search
Searching via the TrimMainObject search constructs a sophisticated map of dependent objects for each search result.  This is useful in a native application where you expect to access many of the properties of the search result (e.g. the Record) but is less required in a web service style application where you are only interested in a few properties.


## TrimSearchDataStream
The TrimSearchDataStream class does a search that bypasses the pre-fetch stored procedures in the database and also bypasses the caching in the SDK.  The benefit is a much faster response for your search, the cost is reduced functionality.  The most significant limitation is that the search results are returned not as objects but as a JSON string.

### Sample JSON response
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