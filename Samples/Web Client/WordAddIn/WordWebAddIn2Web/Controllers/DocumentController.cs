using DocumentFormat.OpenXml.CustomProperties;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.VariantTypes;
using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Http;
using WordWebAddIn2Web.Model;

namespace WordWebAddIn2Web.Controllers
{

    public class DocumentController : BaseController
    {

        public async System.Threading.Tasks.Task<IList<RecordDocument>> Get()
        {
            string userUPN = await GetUser();
            List<RecordDocument> records = new List<RecordDocument>();
            using (Database db = getDatabase(userUPN))
            {
                TrimMainObjectSearch search = new TrimMainObjectSearch(db, BaseObjectTypes.Record);
                search.SetSearchString("recExtension:docx");
                //TrimSearchClause clause = new TrimSearchClause(db, BaseObjectTypes.Record, SearchClauseIds.Favorite);
                //search.AddSearchClause(clause);

                //TrimSearchClause extClause = new TrimSearchClause(db, BaseObjectTypes.Record, SearchClauseIds.RecordExtension);
                //extClause.SetCriteriaFromString("docx");

                //search.AddSearchClause(extClause);
                //search.And();

                foreach (Record record in search)
                {
                    records.Add(new RecordDocument(record));
                }

                return records;
            }
         }

        public enum PropertyTypes : int
        {
            YesNo,
            Text,
            DateTime,
            NumberInteger,
            NumberDouble
        }

        public static string SetCustomProperty(
            string fileName,
            string propertyName,
            object propertyValue,
            PropertyTypes propertyType)
        {
            // Given a document name, a property name/value, and the property type, 
            // add a custom property to a document. The method returns the original
            // value, if it existed.

            string returnValue = null;

            var newProp = new CustomDocumentProperty();
            bool propSet = false;

            // Calculate the correct type.
            switch (propertyType)
            {
                case PropertyTypes.DateTime:

                    // Be sure you were passed a real date, 
                    // and if so, format in the correct way. 
                    // The date/time value passed in should 
                    // represent a UTC date/time.
                    if ((propertyValue) is DateTime)
                    {
                        newProp.VTFileTime =
                            new VTFileTime(string.Format("{0:s}Z",
                                Convert.ToDateTime(propertyValue)));
                        propSet = true;
                    }

                    break;

                case PropertyTypes.NumberInteger:
                    if ((propertyValue) is int)
                    {
                        newProp.VTInt32 = new VTInt32(propertyValue.ToString());
                        propSet = true;
                    }

                    break;

                case PropertyTypes.NumberDouble:
                    if (propertyValue is double)
                    {
                        newProp.VTFloat = new VTFloat(propertyValue.ToString());
                        propSet = true;
                    }

                    break;

                case PropertyTypes.Text:
                    newProp.VTLPWSTR = new VTLPWSTR(propertyValue.ToString());
                    propSet = true;

                    break;

                case PropertyTypes.YesNo:
                    if (propertyValue is bool)
                    {
                        // Must be lowercase.
                        newProp.VTBool = new VTBool(
                          Convert.ToBoolean(propertyValue).ToString().ToLower());
                        propSet = true;
                    }
                    break;
            }

            if (!propSet)
            {
                // If the code was not able to convert the 
                // property to a valid value, throw an exception.
                throw new InvalidDataException("propertyValue");
            }

            // Now that you have handled the parameters, start
            // working on the document.
            newProp.FormatId = "{D5CDD505-2E9C-101B-9397-08002B2CF9AE}";
            newProp.Name = propertyName;

            using (var document = WordprocessingDocument.Open(fileName, true))
            {
                var customProps = document.CustomFilePropertiesPart;
                if (customProps == null)
                {
                    // No custom properties? Add the part, and the
                    // collection of properties now.
                    customProps = document.AddCustomFilePropertiesPart();
                    customProps.Properties =
                        new DocumentFormat.OpenXml.CustomProperties.Properties();
                }

                var props = customProps.Properties;
                if (props != null)
                {
                    // This will trigger an exception if the property's Name 
                    // property is null, but if that happens, the property is damaged, 
                    // and probably should raise an exception.
                    var prop =
                        props.Where(
                        p => ((CustomDocumentProperty)p).Name.Value
                            == propertyName).FirstOrDefault();

                    // Does the property exist? If so, get the return value, 
                    // and then delete the property.
                    if (prop != null)
                    {
                        returnValue = prop.InnerText;
                        prop.Remove();
                    }

                    // Append the new property, and 
                    // fix up all the property ID values. 
                    // The PropertyId value must start at 2.
                    props.AppendChild(newProp);
                    int pid = 2;
                    foreach (CustomDocumentProperty item in props)
                    {
                        item.PropertyId = pid++;
                    }
                    props.Save();
                }
            }
            return returnValue;
        }

        public static string GetCustomProperty( string fileName, string propertyName)
        {
            // Given a document name, a property name/value, and the property type, 
            // add a custom property to a document. The method returns the original
            // value, if it existed.

            string returnValue = null;

         //   var newProp = new CustomDocumentProperty();
        //    bool propSet = false;

            // Calculate the correct type.
            //switch (propertyType)
            //{
            //    case PropertyTypes.DateTime:

            //        // Be sure you were passed a real date, 
            //        // and if so, format in the correct way. 
            //        // The date/time value passed in should 
            //        // represent a UTC date/time.
            //        if ((propertyValue) is DateTime)
            //        {
            //            newProp.VTFileTime =
            //                new VTFileTime(string.Format("{0:s}Z",
            //                    Convert.ToDateTime(propertyValue)));
            //            propSet = true;
            //        }

            //        break;

            //    case PropertyTypes.NumberInteger:
            //        if ((propertyValue) is int)
            //        {
            //            newProp.VTInt32 = new VTInt32(propertyValue.ToString());
            //            propSet = true;
            //        }

            //        break;

            //    case PropertyTypes.NumberDouble:
            //        if (propertyValue is double)
            //        {
            //            newProp.VTFloat = new VTFloat(propertyValue.ToString());
            //            propSet = true;
            //        }

            //        break;

            //    case PropertyTypes.Text:
            //        newProp.VTLPWSTR = new VTLPWSTR(propertyValue.ToString());
            //        propSet = true;

            //        break;

            //    case PropertyTypes.YesNo:
            //        if (propertyValue is bool)
            //        {
            //            // Must be lowercase.
            //            newProp.VTBool = new VTBool(
            //              Convert.ToBoolean(propertyValue).ToString().ToLower());
            //            propSet = true;
            //        }
            //        break;
            //}

            //if (!propSet)
            //{
            //    // If the code was not able to convert the 
            //    // property to a valid value, throw an exception.
            //    throw new InvalidDataException("propertyValue");
            //}

            //// Now that you have handled the parameters, start
            //// working on the document.
            //newProp.FormatId = "{D5CDD505-2E9C-101B-9397-08002B2CF9AE}";
            //newProp.Name = propertyName;

            using (var document = WordprocessingDocument.Open(fileName, true))
            {
                var customProps = document.CustomFilePropertiesPart;
                if (customProps == null)
                {
                    // No custom properties? Add the part, and the
                    // collection of properties now.
                    customProps = document.AddCustomFilePropertiesPart();
                    customProps.Properties =
                        new DocumentFormat.OpenXml.CustomProperties.Properties();
                }

                var props = customProps.Properties;
                if (props != null)
                {
                    // This will trigger an exception if the property's Name 
                    // property is null, but if that happens, the property is damaged, 
                    // and probably should raise an exception.
                    var prop =
                        props.Where(
                        p => ((CustomDocumentProperty)p).Name.Value
                            == propertyName).FirstOrDefault();

                    // Does the property exist? If so, get the return value, 
                    // and then delete the property.
                    if (prop != null)
                    {
                        returnValue = prop.InnerText;
                        prop.Remove();
                    }
                }
            }
            return returnValue;
        }


        // GET api/<controller>
        public async System.Threading.Tasks.Task<HttpResponseMessage> Get(long id)
        {
            string userUPN = await GetUser();

            using (Database db = getDatabase(userUPN))
            {
                Record record = new Record(db, id);

                //if (!record.IsDocumentInClientCache)
                //{
                //    record.LoadDocumentIntoClientCache();
                //}
                string filePath;
                if (record.IsCheckedOut && record.CheckedOutTo.Uri != db.CurrentUser.Uri)
                {
                    throw new ApplicationException($"Record already checkout out to {record.CheckedOutTo.FullFormattedName}");
              


                } else
                {
                    filePath = record.GetDocument($@"c:\junk\dctest.docx", !record.IsCheckedOut, null, null);
                }

                SetCustomProperty(filePath, "CM_Record_Uri", record.Uri.ToString(), PropertyTypes.Text);

                //HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
                //var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                //result.Content = new StreamContent(stream);
                //result.Content.Headers.ContentType = new MediaTypeHeaderValue(record.MimeType);
                //return result;

                Byte[] bytes = File.ReadAllBytes(filePath);
                string rr = Convert.ToBase64String(bytes);

                return new HttpResponseMessage()
                {
                    Content = new StringContent(
                        rr,
                        Encoding.UTF8,
                        "text/plain"
                    )
                };
            }

        }

        public async System.Threading.Tasks.Task<RecordDocument> Post(RecordDocument recordDocument)
        {
           // string result = await Request.Content.ReadAsStringAsync();

            string userUPN = await GetUser();

            string fileName = Path.Combine("c:\\junk", "WordAddin", $"{Guid.NewGuid()}.docx");

            using (var file = File.Create(fileName))
            {
                file.Write(recordDocument.Data, 0, recordDocument.Data.Length);
                file.Close();
            }

            long uri;

            if (Int64.TryParse(GetCustomProperty(fileName, "CM_Record_Uri"), out uri))
            {
                using (Database db = getDatabase(userUPN))
                {
                    Record record = new Record(db, uri);

                    //    byte[] data = Convert.FromBase64String(result);


                    record.SetDocument(new InputDocument(fileName), true, recordDocument.KeepBookedOut, null);
                    record.Save();

                    File.Delete(fileName);
                    return new RecordDocument(record);
                }
            }

            throw new ApplicationException($"Error with document");


        }
    }
}