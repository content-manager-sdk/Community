# Infinite scroll for WebDrawer

## Overview
WebDrawer uses a simple pagination model to retrieve subsequent pages from a search response.  This sample adds an infinite scroll for the Record search.


## Installing the sample
Copy the file Views\Shared\custom_scripts.cshtml to the Views\Shared folder in your WebDrawer installation.

## Optimising performance
Since the page numbering is no longer required you may choose to optimise the searching, this can be done by setting resultsOnly to true in the Records route.

```
    <add
      name="Record"
      model="Records"
      resultsOnly="true"
      template="WDRecordList" 
      stringDisplayType="TreeColumn"
      properties="RecordRecordType,RecordExtension,RecordTitle,RecordNumber,RecordIsElectronic"
    />
```

## Hiding the page number
If you have optimised the search the page number and 'Get Count' button will still be displayed at the bottom of the page, you may choose to hide these, to do this:
 1) edit the file Views\Shared\searchResults.cshtml
 2) add the code 'if (!(this.Request.Dto is HP.HPTRIM.ServiceModel.Records))' after the else statement that surrounds the page number code
 
### Before
  ![image 1](code_before.PNG)
  
### Before
  ![image 1](code_after.PNG)