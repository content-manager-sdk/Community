using System;
using System.Configuration;
using System.Linq;
using System.Xml.Linq;

namespace HP.HPTRIM.SDK.Samples.BulkLoadingFolders
{
    public class Loader
    {
        private const string ORIGIN_NAME = "Bulk Loader Folder Sample";
        Database _database;
        BulkDataLoader _bulkLoader;

        // private Loader() { }
        public Loader(Database database)
        {
            _database = database;

            Origin origin = getOrigin();
            _bulkLoader = new BulkDataLoader(origin);

            _bulkLoader.DoOriginContainerAllocations = true;
            _bulkLoader.UseBulkLoaderRecordNumbering = false;
            _bulkLoader.AutoCommitLocations = true;
        }

        private Origin getOrigin()
        {
            string originName = ConfigurationManager.AppSettings["originName"];

            if (string.IsNullOrEmpty(originName))
            {
                originName = ORIGIN_NAME;
            }

            //  create an origin to use for this sample. Look it up first just so you can rerun the code.
            Origin origin = _database.FindTrimObjectByName(BaseObjectTypes.Origin, originName) as Origin;
            if (origin == null)
            {
                origin = new Origin(_database, OriginType.Capstone);
                origin.Name = ORIGIN_NAME;
                origin.OriginLocation = "N/A";


                // sample code assumes you have a record type defined called "Document"
                origin.DefaultRecordType = _database.FindTrimObjectByName(BaseObjectTypes.RecordType, "Document") as RecordType;

                origin.ContainerCreation = true;
                origin.ContainerType = new RecordType(_database, "Folder");
                origin.ContainerSizeThreshold = 5;

                // don't bother with other origin defaults for the sample, just save it so we can use it
                origin.Save();
            }
            return origin;
        }

        public void Load()
        {


            if (!_bulkLoader.Initialise())
            {
                // this sample has no way of dealing with the error.
                Console.WriteLine(_bulkLoader.ErrorMessage);
                return;
            }

            Console.WriteLine("Starting up an import run ...");
            // the sample is going to do just one run, let's get started...
            // you will need to specify a working folder that works for you
            _bulkLoader.StartRun("Simulated Input Data", ConfigurationManager.AppSettings["workPath"]);

            XDocument xdoc = XDocument.Load("SampleImport.xml");
            int counter = 0;
            foreach (XElement invoice in xdoc.Element("Invoices").Elements("Invoice"))
            {
                Record importRec = _bulkLoader.NewRecord();

                importRec.Title = string.Format("title {0}", ++counter);

                PropertyOrFieldValueList propList = new PropertyOrFieldValueList();
                propList.AddValue(PropertyIds.RecordTitle, invoice.Element("Number").Value);
                propList.AddValue(PropertyIds.RecordDateCreated, invoice.Element("Date").Value);
                propList.AddValue(PropertyIds.RecordNotes, invoice.Element("Notes").Value);


                string customerName = invoice.Element("Customer").Value;

                PropertyValue positionName = new PropertyValue(PropertyIds.LocationSortName);
                positionName.SetValue(customerName);

    Int64 ownerUri = _bulkLoader.FindLocation(positionName);

    if (ownerUri == 0)
    {
        string[] customerNames = customerName.Split(',');

        Location authorLoc = _bulkLoader.NewLocation();
        authorLoc.TypeOfLocation = LocationType.Person;
        authorLoc.Surname = customerNames.First().Trim();
        authorLoc.GivenNames = customerNames.Skip(1).First().Trim();

        // now submit the location to the bulk loader queue
        ownerUri = _bulkLoader.SubmitLocation(authorLoc);
    }

    propList.AddValue(PropertyIds.RecordOwnerLocation, ownerUri);


    _bulkLoader.SetProperties(importRec, propList);

    // If you have a document to attach then construct an InputDocument and do it here
    //   m_loader.SetDocument(importRec, doc, BulkLoaderCopyMode.WindowsCopy);

    // submit it to the bulk loader
    _bulkLoader.SubmitRecord(importRec);

            }

            // by now the loader has accumulated record inserts and location inserts
            // if you set a breakpoint here and look into the right subfolder of your working folder
            // you will see a bunch of temporary files ready to be loaded into the SQL engine

            // process this batch
            Console.WriteLine("Processing import batch ...");
            _bulkLoader.ProcessAccumulatedData();

            // grab a copy of the history object (it is not available in bulk loader after we end the run)
            Int64 runHistoryUri = _bulkLoader.RunHistoryUri;

            // we're done, lets end the run now
            Console.WriteLine("Processing complete ...");
            _bulkLoader.EndRun();

            // just for interest, lets look at the origin history object and output what it did
            OriginHistory hist = new OriginHistory(_database, runHistoryUri);

            Console.WriteLine("Number of records created ..... " + System.Convert.ToString(hist.RecordsCreated));
            Console.WriteLine("Number of locations created ... " + System.Convert.ToString(hist.LocationsCreated));
            Console.WriteLine("Number of records in error ... " + System.Convert.ToString(hist.RecordsInError));

        }
    }
}
