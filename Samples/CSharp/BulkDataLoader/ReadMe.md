# Bulk Data Loader
This sample demonstrates using the BulkDataLoader class to create new Records.  BulkDataLoader is of use when you need to create large numbers of Records as it optimises much of the Record creation process.  The cost is that you must work within the BulkDataLoader pattern to take advantage of the performance benefits you get from using it.

## Setup
To use this sample:
 - edit the database ID in app.config
 - to use your own Origin object edit the originName in App.config
 - to create documents with a RecordType other than Document edit the recordType in App.config