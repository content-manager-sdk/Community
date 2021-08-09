# Object Notifier in WebDrawer

## Overview
The object notifier may be used to get notifications of changes to all objects of a particular type, for example all Records or all Locations.  Once the notification is received you have the opportunity to respond to that change, maybe by updating your object cache which, in turn, refreshes your user interface.

## Setup
The only setup to enable the object notifier is to provide the list of object types you wish to monitor for change. These can be any of the main object types such as Record, Location. Add the list of types in hptrim.config.

```xml
 <setup databaseId="O1" notificationTypes="Record" />
```

## Operation
The events code waits for the onMessage event to fire.  In this sample we:
 * check that the ObjectUri is greater than 0,
 * use jquery to iterate through all the A elements in the second column of the search results table,
 * extract the Record URI from the HREF attribute of the A
 * if the URI matches the URI of the modified Record then fetch the Record and update it's title.
 
## custom_scripts.cshtml
The custom_scripts.cshtml file is a file supported by WebDrawer to allow for the injection of JavaScript into WebDrawer without modification of the supplied templates, it should be created in the folder Views\Shared. 