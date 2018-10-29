using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WordWebAddIn2Web.Model
{
    public class RecordDocument
    {
        //empty constructor required for serialization
        public RecordDocument()
        {
        }
        public RecordDocument(Record record)
        {
            Id = record.Uri;
            Title = record.Title;
            Number = record.Number;
            Modified = record.GetPropertyAsString(PropertyIds.RecordDateModified, StringDisplayType.TreeColumn, true);
        }
        public long Id { get; set; }

        public string Title { get; set; }

        public string Number { get; set; }

        public string Modified { get; set; }

        public byte[] Data { get; set; }
        public bool KeepBookedOut { get; set; }
    }
}