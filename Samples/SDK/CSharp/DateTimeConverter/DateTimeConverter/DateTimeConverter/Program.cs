using Framework;
using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DateTimeConverter
{
	class Program
	{

		private static void updateRecord()
		{
			using (Database database = new Database())
			{
				database.Connect();

				database.SetTimezoneString("(UTC+02:00) Tripoli");

				DateTime dt = DateTime.Parse("2019-08-05T22:35:06Z");

				DateTimeConverter converter = new DateTimeConverter(database);

				Record record = new Record(database, "REC_1");

				record.DateDue = converter.ToLocalTime(dt);
				record.Save();
				Console.WriteLine(converter.ToUtc(record.DateDue));

			}
		}

		static void Main(string[] args)
		{
			SDKLoader.load();

			updateRecord();

		}
	}
}
