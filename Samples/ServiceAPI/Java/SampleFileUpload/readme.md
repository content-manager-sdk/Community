# ServiceAPI Java file upload
The auto ServiceAPI client does not include a facility for uploading files.  This sample demonstrates uploading a file and creating a Record with that file using the [Appache HttpClient](https://hc.apache.org/httpcomponents-client-ga/).


# Error handling
As this sample uses the HttpClient for the file upload it requires its own error handling to parse any JSON error response from the ServiceAPI.  This is done in the createException method.

# Request flow
Record creation is handled in two requests in this sample.  
 1. first the file is uploaded to a temporary location on the server,
 2. the response from the first request contains the relative path of the uploaded file,
 3. post a request to create a new Record including the FilePath property.
 4. the ServiceAPI deletes the temporary file after the record is created
 5. as the sample does not set the Record Title explicitly the title is derived from the attached file.

# Multi-part form
The FileUpload end point currently requires that a multi-part form post be used to upload the file.