# Import using Origin
This is a somewhat redundant application as the TRIM client includes the Document Queue feature which is a more comprehensive document import tool.  Origins do have some capabilities not included in the Document Queue so may be of interest.  In addition this demonstrates how easy it is to build a simple windows application using the SDK.

## Operation
This sample allows the user to select an Origin and a Windows folder and then have any files in that folder imported to HPE CM and then deleted from the folder on a schedule.  As Origins may only be created by users with elevated priveldges this sample allows the user to select a pre-defined Origin and then choose which folder it will import from.

## Folder generation
One thing that Origins allow for that Document Queues do not is the auto creation of new containers based on a set of rules.  This sample shows this in action if you configure the Origin appropriately.
## SDK Usage
The parts of the SDK used in this sample include UI components, Origins and TrimMainObjectSearch.

## Running
To run:
 - download the code
 - copy HP.HPTRIM.SDK.dll to the lib folder
 - if you are running a 32 bit OS select 'Prefer 32-bit' in the project properties
 - run the project

You should see a screen like the one below.

![Importer UI](record_importer.PNG)