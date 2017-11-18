using System.IO;
using System;
using HP.HPTRIM.SDK;
using CMRamble.Ocr.Tesseract;
using log4net;

namespace CMRamble.Ocr.Core
{
    public static class RecordController
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(RecordController));

        #region Update Ocr Rendition
        public static bool GenerateOcrRendition(Record record, RecordRendition sourceRendition)
        {
            bool success = false;
            string extractedFilePath = string.Empty;
            string ocrFilePath = string.Empty;
            try
            {
                // get a temp working location on disk
                var rootDirectory = Path.Combine(Path.GetTempPath(), "cmramble_ocr");
                if (!Directory.Exists(rootDirectory)) Directory.CreateDirectory(rootDirectory);
                // formulate file name to extract, delete if exists for some reason
                extractedFilePath = Path.Combine(rootDirectory, $"{sourceRendition.Uri}.{sourceRendition.Extension}");
                ocrFilePath = Path.Combine(rootDirectory, $"{sourceRendition.Uri}.txt");
                FileHelper.Delete(extractedFilePath);
                FileHelper.Delete(ocrFilePath);
                // fetch document
                var extract = sourceRendition.GetExtractDocument();
                extract.FileName = Path.GetFileName(extractedFilePath);
                extract.DoExtract(Path.GetDirectoryName(extractedFilePath), true, false, "");
                if (!String.IsNullOrWhiteSpace(extract.FileName) && File.Exists(extractedFilePath)) {
                    ocrFilePath = TesseractOcr.ExtractFromFile(extractedFilePath);
                    // use record extension method that removes existing OCR rendition (if exists)
                    record.AddOcrRendition(ocrFilePath);
                    record.Save();
                    success = true;
                }
            }
            catch (Exception ex)
            {
            }
            finally
            {
                FileHelper.Delete(extractedFilePath);
                FileHelper.Delete(ocrFilePath);
            }
            return success;
        }
        public static bool UpdateOcrRendition(Record record)
        {
            bool success = false;
            string extractedFilePath = string.Empty;
            string ocrFilePath = string.Empty;
            try
            {
                // get a temp working location on disk
                var rootDirectory = Path.Combine(Path.GetTempPath(), "cmramble_ocr");
                if (!Directory.Exists(rootDirectory)) Directory.CreateDirectory(rootDirectory);
                // formulate file name to extract, delete if exists for some reason
                extractedFilePath = Path.Combine(rootDirectory, $"{record.Uri}.{record.Extension}");
                ocrFilePath = Path.Combine(rootDirectory, $"{record.Uri}.txt");
                FileHelper.Delete(extractedFilePath);
                FileHelper.Delete(ocrFilePath);
                // fetch document
                Log.Debug($"Extracting Record {record.Number}: {extractedFilePath}");
                record.GetDocument(extractedFilePath, false, "OCR", string.Empty);
                // get the OCR text
                Log.Debug($"Tesseract Ocr Record {record.Number}: {extractedFilePath}");
                ocrFilePath = TesseractOcr.ExtractFromFile(extractedFilePath);
                // use record extension method that removes existing OCR rendition (if exists)
                record.AddOcrRendition(ocrFilePath);

                Log.Debug($"Saving Record {record.Number}");
                record.Save();
                Log.Debug($"Saved Record {record.Number}");
                success = true;
            }
            catch (Exception ex)
            {
                Log.Error(ex);
            }
            finally
            {
                FileHelper.Delete(extractedFilePath);
                FileHelper.Delete(ocrFilePath);
            }
            return success;
        }
        public static void UpdateOcrRenditions(TrimMainObjectSearch forTaggedObjects)
        {
            foreach (var result in forTaggedObjects)
            {
                HP.HPTRIM.SDK.Record record = result as HP.HPTRIM.SDK.Record;
                if ((HP.HPTRIM.SDK.Record)record != null)
                {
                    UpdateOcrRendition(record);
                }
            }
        }
        #endregion

        #region Remove Ocr Rendition
        public static bool RemoveOcrRendition(Record record)
        {
            return record.RemoveOcrRendition();
        }
        public static void RemoveOcrRenditions(TrimMainObjectSearch forTaggedObjects)
        {
            foreach (var result in forTaggedObjects)
            {
                HP.HPTRIM.SDK.Record record = result as HP.HPTRIM.SDK.Record;
                if ((HP.HPTRIM.SDK.Record)record != null)
                {
                    RemoveOcrRendition(record);
                }
            }
        } 
        #endregion
    }
}
