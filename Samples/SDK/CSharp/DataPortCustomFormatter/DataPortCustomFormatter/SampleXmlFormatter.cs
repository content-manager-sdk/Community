using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Windows.Forms;
using System.Xml.Linq;
using HP.HPTRIM.DataPort;
using HP.HPTRIM.DataPort.Framework.DataFormatters;
using HP.HPTRIM.SDK;
using System.Linq;

namespace DataPortCustomFormatter
{
    public class SampleXmlFormatter : IImportDataFormatter
    {
        const string EL_PEOPLE = "people";
        const string EL_PERSON = "person";
        const string ATTR_TYPE = "type";
        const string PERSON_TYPE = "type";

        private XDocument _xmlDocument;
        private string _fileName;
        private int _itemRow = 0;
        HashSet<string> _fieldNames = new HashSet<string>();

        /// <summary>
        /// The caption that will be displayed above the KwikSelect control with 
        /// which the user selects the source of the data to be imported.
        /// </summary>
        public string KwikSelectCaption => "Path to XML file";

        /// <summary>
        /// The type of Origin to be created in Content Manager for the import.
        /// Most likely one of either TextFile, WindowsFolder, XMLFile or Custom<n>.
        /// The others are used by various in house integrations.
        /// </summary>
        public OriginType OriginType => HP.HPTRIM.SDK.OriginType.XmlFile;

        private XDocument getXmlDocument()
        {
            if (_xmlDocument == null)
            {
                _xmlDocument = XDocument.Load(_fileName);
            }
            return _xmlDocument;
        }


        /// <summary>
        /// This event is called when a user clicks on the data source KwikSelect's button.
        /// </summary>
        /// <param name="parentForm">The main TRIMDataPortConfig.exe form</param>
        /// <param name="searchPrefix">The value that is in the text portion of the KwikSelect</param>
        /// <param name="suggestedBrowseUILocation">The point at which we advise any dialogues should be placed.</param>
        /// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
        /// <returns>A string that this dataformatter will use to resolve the data source during an import</returns>
        public string Browse(Form parentForm, string searchPrefix, Point suggestedBrowseUILocation, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            string retVal = "";
            FileDialog fileDialog = new OpenFileDialog();
            fileDialog.Filter = "XML Files|*.xml|All Files|*.*";
            fileDialog.InitialDirectory = searchPrefix;

            if (fileDialog.ShowDialog(parentForm) == DialogResult.OK)
            {
                retVal = fileDialog.FileName;
            }
            return retVal;
        }


        /// <summary>
        /// DataPort has finished importing the data and no longer requires the data source.
        /// </summary>
        /// <param name="additionalData">Reserved for passing additional data through. </param>
        public void CloseConnection(Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {

        }

        public void Dispose()
        {
            //  throw new NotImplementedException();
        }

        /// <summary>
        /// This function is called by DataPort when it needs to display the fields contained in the data source
        /// </summary>
        /// <param name="validatedSource">The already validated connection string for the data source</param>
        /// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
        /// <returns>A list of field names available in the data source</returns>
        public List<string> GetFieldNames(string validatedSource, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            _fileName = validatedSource;

            foreach (XElement item in getXmlDocument().Root.Elements())
            {
                foreach (var attribute in item.Attributes())
                {
                    _fieldNames.Add(attribute.Name.LocalName);
                }

                foreach (var childElement in item.Elements())
                {
                    if (!childElement.HasElements)
                    {
                        _fieldNames.Add($"{childElement.Name}");
                    }

                    if (childElement.Name == EL_PEOPLE)
                    {
                        foreach (var personElement in childElement.Elements())
                        {
                            if (personElement.Name == EL_PERSON)
                            {
                                string personType = personElement.Attribute(ATTR_TYPE).Value;

                                if (!string.IsNullOrEmpty(personType))
                                {
                                    // manually add a person type as some Location  properties are not able to be Unknown
                                    // when returning data below we will return 'Person' for this field.
                                    _fieldNames.Add($"{personType}.{PERSON_TYPE}");

                                    foreach (var personAttribute in personElement.Attributes())
                                    {
                                        if (personAttribute.Name != ATTR_TYPE)
                                        {
                                            _fieldNames.Add($"{personType}.{personAttribute.Name}");
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }

            return _fieldNames.ToList();
        }

        public string GetFormatterInfo(string validatedSource, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            return validatedSource;
        }

        IEnumerable<string> getFieldValues(XElement element)
        {
            // we must return values corresponding to the field names.  If the corresponding value is not in the XML then we must return an empty string.
            // so the returned enumeration must be the same length as _fieldNames with corresponding values in each position.

            foreach (string fieldName in _fieldNames)
            {
                string fieldValue = "";
                if (!fieldName.Contains("."))
                {
                    var attr = element.Attribute(fieldName);
                    if (attr != null)
                    {
                        fieldValue = attr.Value;
                    }
                    else
                    {
                        var el = element.Element(fieldName);
                        if (el != null)
                        {
                            fieldValue = el.Value;
                        }
                    }
                }
                else
                {
                    var people = element.Element(EL_PEOPLE);

                    if (people != null)
                    {
                        foreach (var person in people.Elements())
                        {
                            if (fieldName.Substring(0, fieldName.IndexOf(".")) == person.Attribute(ATTR_TYPE)?.Value)
                            {
                                var attrName = fieldName.Substring(fieldName.IndexOf(".") + 1);

                                if (attrName == PERSON_TYPE)
                                {
                                    fieldValue = "Person";
                                }
                                else
                                {
                                    fieldValue = person.Attribute(fieldName.Substring(fieldName.IndexOf(".") + 1)).Value;
                                }
                            }
                        }
                    }
                }


                yield return fieldValue;


            }
        }


        /// <summary>
        /// Called during an import to obtain the items contained in the data source
        /// </summary>
        /// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
        /// <returns></returns>
        public ImportItem GetNextItem(Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            XElement row = getXmlDocument().Root.Elements().Skip(_itemRow).FirstOrDefault();

            if (row != null)
            {
                var values = getFieldValues(row);
                _itemRow++;

                return new ImportItem(_itemRow.ToString(), values);

            }
            return null;
        }

        /// <summary>
        /// This function is called when DataPort has completed the import.
        /// </summary>
        /// <param name="stats">The statistics of what occurred in the import including things like the number created, updated or the errors that occurred.</param>
        /// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
        public void ImportCompleted(ProcessStatistics stats, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            
        }

        public void Initialize(string validatedSource, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            _fileName = validatedSource;
        }


        /// <summary>
        /// This function is called after every item that is imported.  This is a synchronous call so anything 
        /// in this function will be processed before the next item can be imported.
        /// </summary>
        /// <param name="validatedSource">The already validated connection string for the data source</param>
        /// <param name="additionalData">Reserved for passing additional data through.  As of December 2016 only the DBid is provided.</param>
        public void ItemProcessed(ImportItem processedItem, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
     
        }

        public string Validate(Form parentForm, string connectionStringToValidate, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            string retVal = string.Empty;

            if (!string.IsNullOrWhiteSpace(connectionStringToValidate)
                && File.Exists(connectionStringToValidate))
            {
                // For the sample we're just checking that the file exists.  It would be 
                // prudent to open the file and check that it is in the correct format...
                retVal = connectionStringToValidate;
            }

            return retVal;
        }
    }
}
