# ServiceAPI Java file download

This sample demonstrates using the generated client classes to interact with the ServiceAPI. See the [console app sample](../MyTestConsole) for more details on connecting to the ServiceAPI via Java.

# Important - Version support

The techniques used in this sample on work in ServiceAPI 9.0 and later.

# Download a file

The metadata generated for the ServiceAPI is useful for updating and getting metadata but downloading an electronic file requires more code. This sample creates a ULR connection using the JsonServiceClient and then some [borrowed](https://www.codejava.net/java-se/networking/use-httpurlconnection-to-download-file-from-an-http-url) code to do the actual download.
