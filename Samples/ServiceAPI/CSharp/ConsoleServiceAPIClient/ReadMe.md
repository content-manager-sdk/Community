# ServiceAPI Client Samples

## Overview
These samples use C# to connec to the Micro Focus Content web service (the ServiceAPI).

## Setup
The following Nuget packages are used in this project:
 * MicroFocus.ContentManager.ServiceModel
 * ServiceStack.HttpClient
 * Microsoft.Identity.Client

## Authentication
These samples use the Microsoft Identity Client to connect via [OpenID connect authentication](https://content-manager-sdk.github.io/Community/10/oidc.html#oidc_azuread) with Content Manager 10. The code could be changed to use either basic or Windows integrated authentication. Before using these samples copy the client and tenant IDs from your Azure AD App to the appSettins in app.config.

## ServiceModel
Prior to Content Manager 10 the ServiceAPI model classes were available from the insallation folder, they are are now downloadable from Nuget.



## Examples
The examples in program.cs are:

### Get Record by Number
A very simple request to find a Record by number and display the Uri.

```cs
var response = trimClient.Get<RecordsResponse>(new RecordFind() { Id = "REC_1" });
Console.WriteLine(response.Results[0].Uri);
```

### Get Record Title
Shows how top requestion object properties such as Record Title.

```cs
var response = trimClient.Get<RecordsResponse>(new RecordFind()
{
	Id = "REC_1",
	Properties = new List<string>() { $"{PropertyIds.RecordTitle}" }
});


Console.WriteLine(response.Results[0].Title);
```

### Create a Record
Create a new Record object from the Record Type.

```cs
var record = new Record()
{
	RecordType = new RecordTypeRef() { FindBy = "Document" },
	Title = "my test",
	Properties = new List<string>() { $"{PropertyIds.RecordTitle}" }
};

var response = trimClient.Post<RecordsResponse>(record);

Console.WriteLine(response.Results[0].Title);
```

### Record Search
Search for Records using a string search query.

```cs
var response = trimClient.Get<RecordsResponse>(new Records()
{
	q = "all",
	Properties = new List<string>() { $"{PropertyIds.RecordOwnerLocation}" },
	ResultsOnly = true,
	PropertyValue = PropertyType.String,
	pageSize = 100
});


foreach (var record in response.Results)
{
	Console.WriteLine(record.OwnerLocation.StringValue);
}
```

### Stream Search
The stream search provides a faster but less feature rich search mechanism.

```cs
var response = trimClient.Get<RecordsResponse>(new TrimStreamSearch()
{
	TrimType = BaseObjectTypes.Record,
	q = "all",
	Properties = new List<string>() { $"{PropertyIds.RecordOwnerLocation}", $"{PropertyIds.RecordTitle}" },
	pageSize = 100,
});


foreach (var record in response.Results)
{
	Console.WriteLine(record.Uri);
	Console.WriteLine(record.OwnerLocation);

}
```

### Create a Record and attach a document
Create the Record and upload a document to attach in the same request.

```cs
var record = new Record()
{
	RecordType = new RecordTypeRef() { FindBy = "Document" },
	Title = "my test document",
	Properties = new List<string>() { $"{PropertyIds.RecordTitle}" }
};

using (FileStream filestream = new FileStream("d:\\junk\\trim.png", FileMode.Open))
{
	var uploadFile = new ServiceStack.UploadFile("trim.png", filestream);
	uploadFile.ContentType = "image/png";

	var response = trimClient.PostFilesWithRequest<RecordsResponse>(record, new ServiceStack.UploadFile[] { uploadFile });
	Console.WriteLine(response.Results[0].Title);
}
```


### Upload a file and Create a Record
First upload the file and then post the Record.  This has advantages over the 'PostFilesWithRequest' in that the Record JSON is not compressed into a format that will fit inside a multipart upload.
A limitation of the UploadFile end point is that it only accepts multipart file uploads, so the file must be sent as part of a multipart request.  As with all other samples error handling is not considered in this sample.

```cs
HP.HPTRIM.ServiceModel.UploadFile uploadFileRequest = new HP.HPTRIM.ServiceModel.UploadFile();

string url = trimClient.ResolveTypedUrl("POST", uploadFileRequest);

using (var fileStream = File.OpenRead("d:\\junk\\trim.png"))
using (var formContent = new MultipartFormDataContent("NKdKd9Yk"))
using (var streamContent = new StreamContent(fileStream))
{

	formContent.Headers.ContentType.MediaType = "multipart/form-data";
	formContent.Add(streamContent, "Files", "trim.png");

	var uploadedFileResponse = await httpClient.PostAsync(url, formContent);

	var uploadedJson = await uploadedFileResponse.Content.ReadAsStringAsync();
	var uploadedFile = uploadedJson.FromJson<UploadFileResponse>();

	var record = new Record()
	{
		RecordType = new RecordTypeRef() { FindBy = "Document" },
		Title = "my test document",
		Properties = new List<string>() { $"{PropertyIds.RecordTitle}" },
		FilePath = uploadedFile.FilePath
	};

	var response = await trimClient.PostAsync<RecordsResponse>(record);
	Console.WriteLine(response.Results[0].Title);
}

```

### Download document
Download a document and write it to the local file system using the file name contained on the content disposition response header.

```cs
var recordDownload = new RecordDownload()
{
	Id = "REC_1",
	DownloadType = DownloadType.Document
};

string url = trimClient.ResolveTypedUrl("GET", recordDownload);


var response = await httpClient.GetAsync(url).ConfigureAwait(false); 
string fileName = "test.dat";
IEnumerable<string> values;
if (response.Content.Headers.TryGetValues("Content-Disposition", out values))
{
	ContentDisposition contentDisposition = new ContentDisposition(values.First());
	fileName = contentDisposition.FileName;
}

using (var fileStream = File.Create(Path.Combine($"C:\\junk\\{fileName}")))
{
	var stream = await response.Content.ReadAsStreamAsync();
	stream.CopyTo(fileStream);
}

```