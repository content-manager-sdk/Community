# Starred Record Plugin

## Overview
This is an experimental label browser, no doubt there are many potential improvements.

## Pre-requisites
*HPRM version*
Tested in RM 83 but should work in earlier versions.


## Customisation
### Add the following inside the routeDefaults element in hptrim.config
```
    <add
      name="UserLabel"
      model="UserLabels"
      properties="Icon,UserLabelName"
      pageSize="1000"
    />

    <add
      name="UserLabel"
      model="UserLabel"
    />
```
### Support JSON
In the serviceFeatures property in hptrim.config add JSON (e.g.: serviceFeatures="Html,Razor,Json")
## Files
Copy Browse.cshtml to the WebDrawer root folder and LabelBrowser.js to the scripts folder.