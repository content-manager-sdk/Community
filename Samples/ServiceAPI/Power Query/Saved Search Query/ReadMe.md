# Excel Saved Search Query
This sample is an Office data connector to fetch all objects for a Saved Search from Content Manager.  It creates a table containing columns for each property included in the Saved Search.

## Setup
To use this sample:
 - copy the ODC file to [My Documents]\My Data Sources
 - from the Excel Data ribbon choose 'Existing Connections'
 - select 'Query - CMSavedSearch'
 - select 'Only create Connection'
 - from the Excel Data ribbon choose 'Queries and Connections'
 - from the Queries and Connections pane:
	  - set the location of your ServiceAPI instance in the ServiceURL parameter
	  - Invoke CMSavedSearch
	  - enter the name of a SavedSearch
 
 
## Choosing the data 
Use the 'Edit Query' button in the Saved Search properties to select which columns should appear in the Saved Search. It is best not rely on the default columns as these can change over time and from user to user.
![Saved Search Properties](savedsearchresults.PNG)

## Authentication
The only authentication that has been tested is Windows and Basic.

