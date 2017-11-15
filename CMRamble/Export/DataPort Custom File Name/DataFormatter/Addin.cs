using HP.HPTRIM.DataPort.Framework.DataFormatters;
using System.Collections.Generic;
using System.Linq;
using HP.HPTRIM.DataPort;
using HP.HPTRIM.DataPort.Framework;
using HP.HPTRIM.SDK;
using System.IO;

namespace CMRamble.DataPort.Export
{
    public class NumberedFileName : IExportDataFormatter
    {
        private bool correctExportedFileName = false;
        private string exportPath;
        private DataPortConfig.SupportedBaseObjectTypes objectType;
       
        private static readonly ExportDataFormatterTab tab = new ExportDataFormatterTab();

        public string KwikSelectCaption => tab.KwikSelectCaption;

        public OriginType OriginType => tab.OriginType;

        public string Browse(System.Windows.Forms.Form parentForm, string searchPrefix, System.Drawing.Point suggestedBrowseUILocation, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            return tab.Browse(parentForm, searchPrefix, suggestedBrowseUILocation, additionalData);
        }

        public void Dispose()
        {
            tab.Dispose();
            return;
        }

        public void EndExport(Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            tab.EndExport(additionalData);
        }

        public void ExportCompleted(ProcessStatistics stats, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            tab.ExportCompleted(stats, additionalData);
        }

        public void ExportNextItem(List<ExportItem> items, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            if ( correctExportedFileName )
            {
                var numberField = items.FirstOrDefault(x => x.ItemCaption.Equals(new EnumItem(AllEnumerations.PropertyIds, (int)PropertyIds.AgendaItemExpandedNumber).Caption));
                var fileField = items.FirstOrDefault(x => x.ItemCaption.Equals(new EnumItem(AllEnumerations.PropertyIds, (int)PropertyIds.RecordFilePath).Caption));
                if ( numberField != null && fileField != null )
                {
                    var originalFileName = Path.Combine(exportPath, fileField.ItemValue);
                    if ( File.Exists(originalFileName) )
                    {
                        var newFileName = $"{numberField.ItemValue}{System.IO.Path.GetExtension(fileField.ItemValue)}";
                        var newFilePath = Path.Combine(exportPath, newFileName);
                        if (File.Exists(newFilePath) && File.Exists(originalFileName))
                        {
                            File.Delete(newFilePath);
                        }
                        File.Move(originalFileName, newFilePath);
                        fileField.ItemValue = newFileName;
                    }
                }
            }
            tab.ExportNextItem(items, additionalData);
        }

        public string GetFormatterInfo(Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            return tab.GetFormatterInfo(additionalData);
        }

        public void StartExport(string exportPath, bool overWriteIfExists, DataPortConfig.SupportedBaseObjectTypes objectType, string TRIMVersionInfo, string[] headerCaptions)
        {
            this.exportPath = $"{Path.GetDirectoryName(exportPath)}\\Documents";
            var captions = headerCaptions.ToList();
            var numberField = captions.FirstOrDefault(x => x.Equals(new EnumItem(AllEnumerations.PropertyIds, (int)PropertyIds.AgendaItemExpandedNumber).Caption));
            var fileField = captions.FirstOrDefault(x => x.Equals(new EnumItem(AllEnumerations.PropertyIds, (int)PropertyIds.RecordFilePath).Caption));
            if ( numberField != null & fileField != null )
            {
                correctExportedFileName = true;
            }
            tab.StartExport(exportPath, overWriteIfExists, objectType, TRIMVersionInfo, headerCaptions);
        }

        public string Validate(System.Windows.Forms.Form parentForm, string connectionStringToValidate, Dictionary<AdditionalDataKeys, DescriptiveData> additionalData)
        {
            return tab.Validate(parentForm, connectionStringToValidate, additionalData);
        }
    }
}
