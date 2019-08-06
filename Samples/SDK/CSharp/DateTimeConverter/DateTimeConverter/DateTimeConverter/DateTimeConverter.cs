using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DateTimeConverter
{
	public class DateTimeConverter
	{
		private Database _database;

		public DateTimeConverter(Database database)
		{
			_database = database;
		}

		private static Dictionary<string, TimeZoneInfo> timeZonesByName;

		private TimeZoneInfo getTimeZoneInfo()
		{
			if (timeZonesByName == null)
			{
				timeZonesByName = new Dictionary<string, TimeZoneInfo>();

				var machineTimeZones = TimeZoneInfo.GetSystemTimeZones();

				foreach (var tz in machineTimeZones)
				{
					timeZonesByName.Add(tz.DisplayName, tz);
				}
			}

			string timeZoneString = this._database.GetTimezoneString();

			if (!string.IsNullOrWhiteSpace(timeZoneString))
			{
				if (timeZonesByName.ContainsKey(timeZoneString))
				{
					return timeZonesByName[timeZoneString];
				}

			}

			return TimeZoneInfo.Local;
		}


		public DateTime ToLocalTime(DateTime dateTime)
		{
			TimeZoneInfo userTimeZone = getTimeZoneInfo();

			return TimeZoneInfo.ConvertTime(dateTime, userTimeZone);
		}

		public DateTime ToUtc(TrimDateTime dateTime)
		{
			if (dateTime.IsTimeClear)
			{
				return DateTime.SpecifyKind(dateTime.ToDateTime(), DateTimeKind.Utc);
			}

			TimeZoneInfo userTimeZone = getTimeZoneInfo();

			return TimeZoneInfo.ConvertTimeToUtc(dateTime.ToDateTime(), userTimeZone);
		}
	}
}
