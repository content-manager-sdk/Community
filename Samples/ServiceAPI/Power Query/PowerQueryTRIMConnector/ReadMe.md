# Power BI Connector
This connector simplifies the process of connecting to CM from Power BI, allowing you to use and Saved Search as a Power BI datasource. 

## Saved Searches
The connector requires you construct a Saved Search in CM to which you will connect from Power BI.  The reason for this is that it is much simpler to compose your query in the CM application than to do so in Power BI.
 
## Installation
To use this connector:
 * make sure Power BI Desktop is installed
 * copy the file [TRIMConnector.pqx](Published) to  Documents\Power BI Desktop\Custom Connectors
 * [install](https://docs.microsoft.com/en-us/power-bi/desktop-trusted-third-party-connectors) the thumbprint for the connector certificate in your registry (`186130535E0FF7C0B05AD66EF2167E004FBB2C45`), 
 * open Power BI and find the connector in 'Get Data\Other'

## Using the connector
To get data from CM using this connector:
 * create a saved search of the data (Records, Locations, any data supported by Saved Searches),
 * in the Saved Search properties use 'Edit Query\Results' to choose the columns to include in your Saved Search,
 * from Power BI use 'Get Data\Other' to access the connector,
 * use either Basic or Windows authentication to connect to the Web Service,
 * enter the URL to the web service (e.g. `http://myserver/ServiceAPI`)
 * enter the name or URI of the saved search.

## Authentication
The only authentication that has been implemented is Windows and Basic.

