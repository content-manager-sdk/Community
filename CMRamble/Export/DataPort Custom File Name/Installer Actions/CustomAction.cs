using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Deployment.WindowsInstaller;
using System.Xml.Serialization;
using System.Linq;
using System.IO;

namespace CMRamble.DataPort
{
    public class InstallerActions
    {
        [CustomAction]
        public static ActionResult RegisterDataFormatter(Session session)
        {
            ActionResult result = ActionResult.NotExecuted;
            try
            {
                var preferenceFile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), @"Hewlett-Packard\HP TRIM\DataPort\Preferences\ExportDataFormatters");
                if (File.Exists(preferenceFile))
                {
                    session.Log($"Preference File Found: {preferenceFile}");
                    XmlSerializer serializer = new XmlSerializer(typeof(ArrayOfDataFormatterDefinition));
                    ArrayOfDataFormatterDefinition importFormatters = LoadImportFormattersPreferenceFile(preferenceFile, serializer);
                    List<ArrayOfDataFormatterDefinitionDataFormatterDefinition> items = importFormatters.Items.ToList();
                    var item = importFormatters.Items.FirstOrDefault(x => x.ClassName.Equals("CMRamble.DataPort.Export.NumberedFileName"));
                    if (item == null)
                    {
                        item = new ArrayOfDataFormatterDefinitionDataFormatterDefinition();
                        items.Add(item);
                    }
                    // TODO: bind to the assembly file name?
                    item.AssemblyName = $"{session["INSTALLFOLDER"]}CMRamble.DataPort.Export.NumberedFileName.dll";
                    item.ClassName = "CMRamble.DataPort.Export.NumberedFileName";
                    item.DisplayName = "Tab Delimited with Numbered File Names";
                    importFormatters.Items = items.ToArray();
                    SaveImportFormattersPreferenceFile(preferenceFile, serializer, importFormatters);
                    session.Log("Successful save of preference file");
                    result = ActionResult.Success;
                }
                else
                {
                    session.Log($"Preference File Missing: {preferenceFile}");
                }
            }
            catch (Exception ex)
            {
                session.Log($"Exception: {ex.Message}");
                result = ActionResult.Failure;

            }
            return result;
        }

        [CustomAction]
        public static ActionResult UnRegisterDataFormatter(Session session)
        {
            ActionResult result = ActionResult.NotExecuted;
            try
            {
                var preferenceFile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), @"Hewlett-Packard\HP TRIM\DataPort\Preferences\ExportDataFormatters");
                if (File.Exists(preferenceFile))
                {
                    session.Log($"Preference File Found: {preferenceFile}");
                    XmlSerializer serializer = new XmlSerializer(typeof(ArrayOfDataFormatterDefinition));
                    ArrayOfDataFormatterDefinition importFormatters = LoadImportFormattersPreferenceFile(preferenceFile, serializer);
                    List<ArrayOfDataFormatterDefinitionDataFormatterDefinition> items = importFormatters.Items.ToList();
                    importFormatters.Items = items.Where(x => !x.ClassName.Equals("CMRamble.DataPort.Export.NumberedFileName")).ToArray();
                    SaveImportFormattersPreferenceFile(preferenceFile, serializer, importFormatters);
                    session.Log("Successful save of preference file");
                    result = ActionResult.Success;
                }
                else
                {
                    session.Log($"Preference File Missing: {preferenceFile}");
                }
            }
            catch (Exception ex)
            {
                session.Log($"Exception: {ex.Message}");
                result = ActionResult.Failure;
            }
            return result;
        }

        private static void SaveImportFormattersPreferenceFile(string preferenceFile, XmlSerializer serializer, ArrayOfDataFormatterDefinition importFormatters)
        {
            using (TextWriter writer = new StreamWriter(preferenceFile))
            {
                serializer.Serialize(writer, importFormatters);
                writer.Close();
            }
        }

        private static ArrayOfDataFormatterDefinition LoadImportFormattersPreferenceFile(string preferenceFile, XmlSerializer serializer)
        {
            ArrayOfDataFormatterDefinition importFormatters;
            using (StreamReader reader = new StreamReader(preferenceFile))
            {
                importFormatters = (ArrayOfDataFormatterDefinition)serializer.Deserialize(reader);
                reader.Close();
            }

            return importFormatters;
        }
    }
}
