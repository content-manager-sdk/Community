using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HP.HPTRIM.SDK;
using System.Xml.Linq;
using System.Globalization;
using System.Configuration;

namespace HP.HPTRIM.SDK.Samples.BulkLoading
{

    internal class bulkLoaderSample
    {

        private Origin m_origin;
        private BulkDataLoader m_loader;
        private int m_recordCount;

        public bulkLoaderSample()
        {
            m_origin = null;
            m_loader = null;
            m_recordCount = 0;
        }


        public bool run(Database db)
        {
            Console.WriteLine("Initialise BulkDataLoader sample ...");


            string originName = ConfigurationManager.AppSettings["originName"];

            if (string.IsNullOrEmpty(originName))
            {
                originName = "Bulk Loader Sample";
            }

            //  create an origin to use for this sample. Look it up first just so you can rerun the code.
            m_origin = db.FindTrimObjectByName(BaseObjectTypes.Origin, originName) as Origin;
            if (m_origin == null)
            {
                m_origin = new Origin(db, OriginType.Custom1);
                m_origin.Name = "Bulk Loader Sample";
                m_origin.OriginLocation = "N/A";

                // sample code assumes you have a record type defined called "Document"
                m_origin.DefaultRecordType = db.FindTrimObjectByName(BaseObjectTypes.RecordType, ConfigurationManager.AppSettings["recordType"]) as RecordType;

                // don't bother with other origin defaults for the sample, just save it so we can use it
                m_origin.Save();
            }

            // construct a BulkDataLoader for this origin
            m_loader = new BulkDataLoader(m_origin);

            m_loader.UseBulkLoaderRecordNumbering = false;

            // there are various optimisations use by the bulk loader, here is where we 
            // initialise them
            if (!m_loader.Initialise())
            {
                // this sample has no way of dealing with the error.
                Console.WriteLine(m_loader.ErrorMessage);
                return false;
            }

            Console.WriteLine("Starting up an import run ...");
            // the sample is going to do just one run, let's get started...
            // you will need to specify a working folder that works for you
            m_loader.StartRun("Simulated Input Data", ConfigurationManager.AppSettings["workPath"]);

            XDocument xdoc = XDocument.Load("SampleImport.xml");

            foreach (XElement invoice in xdoc.Element("Invoices").Elements("Invoice"))
            {
                Record importRec = m_loader.NewRecord();

                PropertyOrFieldValueList propList = new PropertyOrFieldValueList();
                propList.AddValue(PropertyIds.RecordTitle, invoice.Element("Number").Value);
                propList.AddValue(PropertyIds.RecordDateCreated, invoice.Element("Date").Value);
                propList.AddValue(PropertyIds.RecordNotes, invoice.Element("Notes").Value);


                string customerName = invoice.Element("Customer").Value;

                PropertyValue positionName = new PropertyValue(PropertyIds.LocationSortName);
                positionName.SetValue(customerName);
                        
                Int64 authorUri = m_loader.FindLocation(positionName);

                if (authorUri == 0)
                {
                    string[] customerNames = customerName.Split(',');

                    Location authorLoc = m_loader.NewLocation();
                    authorLoc.TypeOfLocation = LocationType.Person;
                    authorLoc.Surname = customerNames.First().Trim();
                    authorLoc.GivenNames = customerNames.Skip(1).First().Trim();

                    // now submit the location to the bulk loader queue
                    authorUri = m_loader.SubmitLocation(authorLoc);
                }               

                 propList.AddValue(PropertyIds.RecordAuthor, authorUri);
                

                 m_loader.SetProperties(importRec, propList);
               
                // If you have a document to attach then construct an InputDocument and do it here
                //   m_loader.SetDocument(importRec, doc, BulkLoaderCopyMode.WindowsCopy);

                // submit it to the bulk loader
                m_loader.SubmitRecord(importRec);

            }

            // by now the loader has accumulated record inserts and location inserts
            // if you set a breakpoint here and look into the right subfolder of your working folder
            // you will see a bunch of temporary files ready to be loaded into the SQL engine

            // process this batch
            Console.WriteLine("Processing import batch ...");
            m_loader.ProcessAccumulatedData();

            // grab a copy of the history object (it is not available in bulk loader after we end the run)
            Int64 runHistoryUri = m_loader.RunHistoryUri;

            // we're done, lets end the run now
            Console.WriteLine("Processing complete ...");
            m_loader.EndRun();

            // just for interest, lets look at the origin history object and output what it did
            OriginHistory hist = new OriginHistory(db, runHistoryUri);
            
            Console.WriteLine("Number of records created ..... " + System.Convert.ToString(hist.RecordsCreated));
            Console.WriteLine("Number of locations created ... " + System.Convert.ToString(hist.LocationsCreated));
            Console.WriteLine("Number of records in error ... " + System.Convert.ToString(hist.RecordsInError));

            return true;
        }


    };
}


