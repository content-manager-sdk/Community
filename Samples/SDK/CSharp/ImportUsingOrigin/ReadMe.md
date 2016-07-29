# Import using Origin
This is a somewhat redundant application as the TRIM client includes the Document Queue feature which is a more comprehensive document import tool.  Origins do have some capabilities not included in the Document Queue so may be of interest.  In addition this demonstrates how easy it is to build a simple windows application using the SDK.

## Operation
This sample allows the user to select an Origin and a Windows folder and then have any files in that folder imported to HPE CM and then deleted from the folder on a schedule.

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