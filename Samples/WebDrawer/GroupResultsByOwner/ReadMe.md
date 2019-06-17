# Group Search Results by Owner

## Overview
While there is no built-in way to group search results by owner Location these two samples demonstrate how to achieve this in WebDrawer.


## Installing the samples

### Javascript sample
 1. copy WDRecordsByOwner.cshtml to your WebDrawer views folder
 2. copy the config below into routeDefaults in WebDrawer hptrim.config.

```.xml
<add
  name="ByOwner"
  model="Locations"
  template="WDRecordsByOwner" 
  q="unkUri:9000000000,9000000004,9000000028"  
  pageSize="100"
  stringDisplayType="TreeColumn"
  properties="LocationSortName"
/>
```

### Simple Sample
 1. copy WDRecordGrouped.cshtml into your WebDrawer views folder
 2. copy the config below into routeDefaults in WebDrawer hptrim.config.
 
`
<add
  name="Grouped"
  model="Records"
  template="WDRecordGrouped" 
  pageSize="500" 
  stringDisplayType="TreeColumn"
  properties="RecordOwnerLocation"
/>
` 
 
## Comparing the samples
Both samples:
 * allow you to do a Record search, 
 * show a list of Owner names for Records which match the search, and
 * allow you to link from the Owner Location to all all Records owned by that Location which match the search.
 
The simple sample gets the list of owners by returning a large number of Records and displaying the list of owner Locations that are found in these Records. The problem with this approach is that all relevant owner Locations may not be shown if the total result set is larger than the page size. 

The JavaScript sample requires the WebDrawer owner to pre-define which owners we are interested in and then does a seperate background search to determine if there are any matching Records.