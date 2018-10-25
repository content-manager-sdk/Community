# DataPort Custom Formatter
While the 'out of the box' DataPort supports tab delimited files it is also possible to create a custom formatter to import any data source. This sample code imports a very simple XML file.

## Building this project
To build this project copy the following two files from your Content Manager folder to the lib folder (in this folders parent):
 * HP.HPTRIM.DataPort.Common.dll
 * HP.HPTRIM.SDK.dll

 ## Registering the formatter
 Once your new formatter has been built you need to register it with DataPort.  To do this you need to edit the file %appdata%\Hewlett-Packard\HP TRIM\DataPort\Preferences\ImportDataFormatters.  The formatter needs to be registered on any machine that will create DataPort projects with DataPort Config Manager or run the import with the DataPort engine.

 You will need to add XML in the format below to the ImportDataFormatters file.

 ```xml
 <DataFormatterDefinition>
  <DisplayName>What name would you like to display?</DisplayName>
  <AssemblyName>Path and name of the binary containing the formatter</AssemblyName>
  <ClassName>DataPortFormatter.SampleFormatter</ClassName>
</DataFormatterDefinition>
 ```