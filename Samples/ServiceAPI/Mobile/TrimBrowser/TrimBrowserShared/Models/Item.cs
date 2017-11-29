using HP.HPTRIM.ServiceModel;
using System;
using System.IO;

namespace TrimBrowser
{
    public class Item
    {
        public Item()
        {
        }

        public Item(Record record)
        {
            Id = record.Uri.ToString();
            Text = record.Number;
            Description = record.Title;
            Extension = record.Extension;
        }

        public string Id { get; set; }
        public string Text { get; set; }
        public string Description { get; set; }
        public string Extension { get; set; }
        public string File { get; set; }
    }
}
