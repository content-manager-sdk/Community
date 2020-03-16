# Stream Search
Searching via the TrimMainObject search constructs a sophisticated map of dependent objects for each search result.  This is useful in a native application where you expect to access many of the properties of the search result (e.g. the Record) but is less required in a web service style application where you are only interested in a few properties.


## TrimSearchDataStream
The TrimSearchDataStream class does a search that bypasses the pre-fetch stored procedures in the database and also bypasses the caching in the SDK.  The benefit is a much faster response for your search, the cost is reduced functionality.  The most significant limitation is that the search results are returned not as objects but as a JSON string.

### Sample JSON response
The JSON response is in the same format you would expect if this was a ServiceAPI search, as seen here.

```.json
{
        "TrimType": "Record",
        "Uri": 9000000222,
        "RecordOwnerLocation":
        {
                "TrimType": "Location",
                "Uri": 9000000056,
                "NameString": "Europe",
                "ToolTip": "Europe"
        },
        "RecordTitle":
        {
                "Value": "my record title"
        },
        "Fields":
        {
                "Speed":
                {
                        "__type": "HP.HPTRIM.ServiceModel.TrimProperty`1[[System.Int32, mscorlib]], HP.HPTRIM.ServiceAPI.Model",
                        "Value": 60
                }
        }
}
```

### Sample Code
The code in this sample does two simple searches, one using a standard search and one using the TrimSearchDataStream.  Although there is a timer the difference in speed should be evident with the naked eye.