using HP.HPTRIM.ServiceModel;
using Microsoft.Identity.Client;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Diagnostics.Eventing.Reader;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Threading.Tasks;
using System.Web;

namespace ConsoleServiceAPIClient
{
    class Program
    {

        private static JsonHttpClient _trimClient;
        private static HttpClient _httpClient;
        static IPublicClientApplication _app;

        static async Task<string> getAuthToken()
        {
            string clientId = System.Configuration.ConfigurationManager.AppSettings["clientId"];
            string tenantId = System.Configuration.ConfigurationManager.AppSettings["tenantId"];

            if (_app == null)
            {
                _app = PublicClientApplicationBuilder.Create(clientId)
                    .WithRedirectUri("https://login.microsoftonline.com/common/oauth2/nativeclient")
                    .WithAuthority(AzureCloudInstance.AzurePublic, tenantId)
                    .Build();

                TokenCacheHelper.EnableSerialization(_app.UserTokenCache);
            }

            var accounts = await _app.GetAccountsAsync();
            AuthenticationResult result;

            var scopes = new string[] { "User.Read", "offline_access", "openid", "profile" };

            try
            {
                result = await _app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
                       .ExecuteAsync();
            }
            catch (MsalUiRequiredException ex)
            {
                // A MsalUiRequiredException happened on AcquireTokenSilent.
                // This indicates you need to call AcquireTokenInteractive to acquire a token
                System.Diagnostics.Debug.WriteLine($"MsalUiRequiredException: {ex.Message}");

                try
                {
                    result = await _app.AcquireTokenInteractive(scopes)
                          .ExecuteAsync();
                }
                catch (MsalException msalex)
                {
                    Console.WriteLine($"Error Acquiring Token:{System.Environment.NewLine}{msalex}");
                    throw;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error Acquiring Token Silently:{System.Environment.NewLine}{ex}");
                throw;
            }

            return result.IdToken;
        }

        static async Task<string> getConfidentialClientAuthToken()
        {
            string clientId = System.Configuration.ConfigurationManager.AppSettings["clientId"];
            string scopeClientId = System.Configuration.ConfigurationManager.AppSettings["scopeClientId"];
            string tenantId = System.Configuration.ConfigurationManager.AppSettings["tenantId"];
            string clientSecret = System.Configuration.ConfigurationManager.AppSettings["clientSecret"];

            string[] scopes = new string[] { $"{scopeClientId}/.default" };


            IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(clientId)
      .WithAuthority(AzureCloudInstance.AzurePublic, tenantId)
     .WithClientSecret(clientSecret)
     .Build();

            //    Microsoft.Identity.Client.AuthenticationResult result;
            // var authResult = app.AcquireTokenForClient(scopes).ExecuteAsync();

            try
            {
                var result = await app.AcquireTokenForClient(scopes).ExecuteAsync();


                return result.AccessToken;

            }
            catch (AggregateException agEx)
            {
                foreach (var ex in agEx.InnerExceptions)
                {
                    Console.WriteLine(ex.Message, ex);
                }

                throw new TimeoutException($"Error connecting to identity provider.");
            }


        }
        static async Task<JsonHttpClient> getServiceClient()
        {
            // this is only test code so we will bypass TLS certificate errors...
            ServicePointManager
                .ServerCertificateValidationCallback +=
                (sender, cert, chain, sslPolicyErrors) => true;



            if (_trimClient == null)
            {
                string url = System.Configuration.ConfigurationManager.AppSettings["url"];

                if (string.IsNullOrWhiteSpace(url))
                {
                    throw new ConfigurationErrorsException("Unable to find URL in my.config");
                }

                _trimClient = new JsonHttpClient(url);


            }

            string userName = System.Configuration.ConfigurationManager.AppSettings["userName"];
            string password = System.Configuration.ConfigurationManager.AppSettings["password"];
            string clientSecret = System.Configuration.ConfigurationManager.AppSettings["clientSecret"];
            if (!string.IsNullOrWhiteSpace(clientSecret))
            {
                string token = await getConfidentialClientAuthToken();
                _trimClient.Headers["Authorization"] = $"Bearer {token}";
            }
            else if (string.IsNullOrWhiteSpace(userName))
            {
                string token = await getAuthToken();
                _trimClient.Headers["Authorization"] = $"Bearer {token}";
            }
            else
            {
                _trimClient.SetCredentials(userName, password);
                _trimClient.AlwaysSendBasicAuthHeader = true;
            }

            return _trimClient;


        }



        static async Task<HttpClient> getHttpClient()
        {

            string token = await getAuthToken();

            if (_httpClient == null)
            {
                _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            }

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            return _httpClient;
        }

        static async Task Main(string[] args)
        {

            var stopWatch = Stopwatch.StartNew();

            //   await updateRecord();

            //     await removeContact();

            //	await getRecordByUri();
            //		await recordTypeSearch();

            //	await getRecordUri();

            //   await getMe();

            //	await getRecordTitle();

            //	await createRecord();

            //   await recordSearch();

            // await streamSearch();

            //await createRecordWithDocument();

            //await getDocument();

            await getDocumentInChunks();

            //	await uploadFileAndCreateRecord();

            //await uploadBinaryFileAndCreateRecord();

            Console.WriteLine($"=================== {stopWatch.ElapsedMilliseconds} =======================");
            Console.ReadKey();
        }


        private async static Task recordTypeSearch()
        {
            var trimClient = await getServiceClient();

            var response = trimClient.Get<RecordTypesResponse>(new RecordTypes() { q = "all" });
            Console.WriteLine(response.Results[0].Uri);


        }

        private async static Task steamSearch()
        {
            var trimClient = await getServiceClient();
            var response = trimClient.Get<RecordsResponse>(new RecordFind() { Id = "1501", Properties = new List<string>() { $"{PropertyIds.RecordTitle}" } });
            Console.WriteLine(response.Results[0].Number);
            Console.WriteLine(response.Results[0].Title);
        }

        private async static Task getRecordUri()
        {
            var trimClient = await getServiceClient();
            var response = trimClient.Get<RecordsResponse>(new RecordFind() { Id = "REC_1" });
            Console.WriteLine(response.Results[0].Uri);
        }

        private async static Task getMe()
        {
            var trimClient = await getServiceClient();
            var response = trimClient.Get<LocationsResponse>(new LocationFind() { Id = "me" });
            Console.WriteLine(response.Results[0].Uri);
        }

        private async static Task getRecordTitle()
        {
            var trimClient = await getServiceClient();
            var response = trimClient.Get<RecordsResponse>(new RecordFind()
            {
                Id = "REC_1",
                Properties = new List<string>() { $"{PropertyIds.RecordTitle}" }
            });


            Console.WriteLine(response.Results[0].Title);
        }

        private async static Task createRecord()
        {
            var trimClient = await getServiceClient();

            var record = new Record()
            {
                RecordType = new RecordTypeRef() { FindBy = "Document" },
                Title = "my test",
                Properties = new List<string>() { $"{PropertyIds.RecordTitle}" }
            };

            var response = trimClient.Post<RecordsResponse>(record);

            Console.WriteLine(response.Results[0].Title);
        }

        private async static Task updateRecord()
        {
            var trimClient = await getServiceClient();

            var surfaces = new string[] { "Dirt", "Bitumen", "Concrete", "Blue Metal" };


            for (int counter = 0; counter < 100; counter++)
            {
                Random random = new Random();
                int number = random.Next(0, 3);

                var fields = new Dictionary<string, string>();
                fields["RoadSurface"] = surfaces[number];
                Console.WriteLine("*****************************");
                Console.WriteLine(fields["RoadSurface"]);

                var record = new Record()
                {
                    Uri = 9000000221,
                    AdditionalFields = fields,

                };

                trimClient.Post<RecordsResponse>(record);



                var response = trimClient.Get<RecordsResponse>(new RecordFind()
                {
                    Id = "9000000221",
                    Properties = new List<string>() { $"RoadSurface" },
                    PropertyValue = PropertyType.Both
                });


                Console.WriteLine(response.Results[0].Fields["RoadSurface"].StringValue);


                Console.WriteLine("*****************************");

            }









        }

        private async static Task recordSearch()
        {
            var trimClient = await getServiceClient();

            trimClient.AddHeader("Next-Page-Id", $"{Guid.NewGuid()}");

            PropertyIds[] propertyIds = new PropertyIds[] {
                        PropertyIds.RecordNumber,
                 //       PropertyIds.RecordAuthor,
                  //      PropertyIds.RecordAssignee,
                 //    PropertyIds.RecordTitle,
              //  PropertyIds.RecordRevisionNumber,
               //         PropertyIds.RecordClassification,
               //         PropertyIds.RecordNotes,
               //         PropertyIds.RecordContainer,
               //         PropertyIds.RecordIsElectronic,
            };


            RecordsResponse response;
            int pageSize = 3;
            int start = 1;
            do
            {
                response = trimClient.Get<RecordsResponse>(new Records()
                {
                    q = "electronic",
                    Properties = propertyIds.Select(pid => $"{pid}").ToList(),
                    ResultsOnly = true,
                    PropertyValue = PropertyType.Both,
                    pageSize = pageSize,
                    //    start = start, 
                    sortBy = new string[] { "uri" }
                });

                Console.WriteLine("***********************************************");
                foreach (var record in response.Results)
                {
                    Console.WriteLine(record.Number);
                }
                start = start + pageSize;
            } while (response.HasMoreItems == true && start < 70);
        }

        private async static Task removeContact()
        {
            var trimClient = await getServiceClient();
            var response = trimClient.Post<RecordsResponse>(new Record()
            {
                Uri = 9000000001,
                ChildLocations = new List<RecordLocation>() {
                    new RecordLocation() {
                        Uri = 9000004217,
                        TypeOfRecordLocation = RecordLocationType.Contact,
                        Delete = true
                    }
                }
            });



        }

        private async static Task streamSearch()
        {
            PropertyIds[] propertyIds = new PropertyIds[] {
                PropertyIds.RecordNumber,
             //   PropertyIds.RecordAuthor,
                PropertyIds.RecordAssignee,
               PropertyIds.RecordTitle,
                PropertyIds.RecordRevisionNumber,
                PropertyIds.RecordClassification,
              //  PropertyIds.RecordNotes,
                PropertyIds.RecordContainer,
                PropertyIds.RecordIsElectronic,
            };


            bool more = false;
            int start = 0;
            var trimClient = await getServiceClient();

            var hc = trimClient.GetHttpClient();
            hc.Timeout = new System.TimeSpan(1, 30, 0);
            string id = $"{Guid.NewGuid()}";
            do
            {
                try
                {
                    var response = trimClient.Get<RecordsResponse>(new TrimStreamSearch()
                    {
                        TrimType = BaseObjectTypes.Record,
                        q = "recElectronic",
                        Properties = propertyIds.Select(pid => $"{pid}").ToList(),
                        pageSize = 2000,
                        sortBy = new string[] { "updated" },
                        Filter = "updated>1970-01-01 00:00:00Z",
                        start = start,
                        Id = id
                    });



                    more = response.HasMoreItems;
                    start = start + response.Results.Count;

                    foreach (var record in response.Results)
                    {

                        Console.WriteLine($"{record.IsElectronic} - {record.Uri} - {record.Title} - {record.Number} - {record.Assignee}");
                    }
                    return;
                }
                catch (Exception ex)
                {
                    Console.WriteLine("============ ERROR ==========");
                    Console.WriteLine(ex.Message);
                    more = true;
                }
            } while (more == true);
        }


        private async static Task createRecordWithDocument()
        {
            var trimClient = await getServiceClient();

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
        }

        private async static Task uploadFileAndCreateRecord()
        {
            var trimClient = await getServiceClient();
            var httpClient = await getHttpClient();

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

        }



        // this is not supported up to CM 10.  It may be supported in a later release.
        private async static Task uploadBinaryFileAndCreateRecord()
        {
            var trimClient = await getServiceClient();
            var httpClient = await getHttpClient();

            HP.HPTRIM.ServiceModel.UploadFile uploadFileRequest = new HP.HPTRIM.ServiceModel.UploadFile();

            string url = trimClient.ResolveTypedUrl("POST", uploadFileRequest);

            using (var fileStream = File.OpenRead("d:\\junk\\trim.png"))
            using (var streamContent = new StreamContent(fileStream))
            {
                streamContent.Headers.ContentType = new MediaTypeHeaderValue("image/png");

                var uploadedFileResponse = await httpClient.PostAsync(url + "/trim.png", streamContent);

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

        }


        private async static Task getDocument()
        {
            var trimClient = await getServiceClient();
            var httpClient = await getHttpClient();

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

        }

        // This only works in Content Manager versions subsequent to version 10.1 as the Content-Range header
        // was not supported in 10.1.x and earlier
        private async static Task getDocumentInChunks()
        {
            var trimClient = await getServiceClient();
            var httpClient = await getHttpClient();
 
            long to = 0;
            long length = 0;
            string filePath = null;

            // long chunkSize = 1024 * 1000;
            long chunkSize = 999;

            var recordDownload = new RecordDownload()
            {
                Id = "REC_264",
                DownloadType = DownloadType.Document
            };

            string url = trimClient.ResolveTypedUrl("GET", recordDownload);



            do
            {
                var request = new HttpRequestMessage()
                {
                    RequestUri = new Uri(url),
                    Method = HttpMethod.Get,
                };

                long endRange = chunkSize;
                if (to > 0)
                {
                    if ((length - to) > chunkSize)
                    {
                        endRange = (to + 1) + chunkSize;
                    }
                    else
                    {
                        endRange = length - 1;
                    }
                }
                request.Headers.Range = new RangeHeaderValue(to > 0 ? to + 1 : 0, endRange);


                var response = await httpClient.SendAsync(request).ConfigureAwait(false);

                if (response.Content.Headers.ContentRange.Length.HasValue
                    && response.Content.Headers.ContentRange.To.HasValue)
                {
                    length = (long)response.Content.Headers.ContentRange.Length;
                }
              

                if (response.Content.Headers.ContentRange.To.HasValue)
                {
                    to = (long)response.Content.Headers.ContentRange.To;
                }

                if (string.IsNullOrWhiteSpace(filePath))
                {
                    string fileName = "test.dat";
                    IEnumerable<string> values;
                    if (response.Content.Headers.TryGetValues("Content-Disposition", out values))
                    {
                        ContentDisposition contentDisposition = new ContentDisposition(values.First());
                        fileName = HttpUtility.UrlDecode(contentDisposition.FileName);
                    }

                    filePath = $"C:\\junk\\{fileName}";

                    File.Delete(filePath);
                }

                using (var fileStream = new FileStream(filePath, FileMode.Append))
                {
                    var stream = await response.Content.ReadAsStreamAsync();

                    fileStream.Write(stream.ReadFully(), 0, Convert.ToInt32(stream.Length));                   
                }


            } while ((to + 1) < length);

        }

    }

}
