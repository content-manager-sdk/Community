# Date Range Selector for WebDrawer

## Overview
Dates in HPE CM may be specified in a number of ways, using standard date formats but also using special strings like 'today', 'yesterday', or 'this year'.  Both for this reason and also because WebDrawer is designed to have a simple user interface there is no date picker widget for date searches in WebDrawer, only a simple text field.

If you desire a date picker the extensible nature of WeDrawer means you can add one quite easily.

## Resources
The resources used to add a datepicker in this sample are:
 * [jQuery UI DateRangePicker](https://tamble.github.io/jquery-ui-daterangepicker/)
 * [jQuery](http://jquery.com/)
 * [jQuery UI](http://jqueryui.com/)
 * [moment.js](http://momentjs.com/)

## Installing the sample
This sample includes all of the files required (and links to [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) versions of others), this is for the sake of simplicity, it is best though to follow the [jQuery UI DateRangePicker](https://tamble.github.io/jquery-ui-daterangepicker/) to install the various files from the original source.

To install from the files here:
  * copy all the files from this repo to the matching folders under your WebDrawer root folder
  * reload WebDrawer, date fields should now look like this:

 ![image 2](date_range_picker.PNG)
 
 ##To install in Records Manager 81
 Version 81 does not automatically load scripts from the custom_head.cshtml and custom_scripts.cshtml files.  To include the date range picker in 81 you need to add the following lines immediately prior to the line (near the bottom of the file) that reads ' @RenderSection("scripts")'.
 
 ```.html
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.js"></script>
<script src="https://cdn.jsdelivr.net/momentjs/2.3.1/moment.min.js"></script>
<script src="~/scripts/jquery.comiseo.daterangepicker.js" type="text/javascript"></script>
<script src="~/scripts/custom_scripts.js" type="text/javascript"></script>
 ```