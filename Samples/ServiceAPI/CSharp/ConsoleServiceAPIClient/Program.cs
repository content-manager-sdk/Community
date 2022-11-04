using HP.HPTRIM.ServiceModel;
using Microsoft.Identity.Client;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Threading.Tasks;

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

            if (string.IsNullOrWhiteSpace(userName))
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

            //     await removeContact();

            //	await getRecordByUri();
            //		await recordTypeSearch();

            //	await getRecordUri();

            //	await getRecordTitle();

            //	await createRecord();

            //await recordSearch();

            await streamSearch();

            //await createRecordWithDocument();

            // await getDocument();

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

        private async static Task recordSearch()
        {
            var trimClient = await getServiceClient();
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
                PropertyIds.RecordAuthor,
                PropertyIds.RecordAssignee,
               PropertyIds.RecordTitle,
                PropertyIds.RecordRevisionNumber,
                PropertyIds.RecordClassification,
                PropertyIds.RecordNotes,
                PropertyIds.RecordContainer,
                PropertyIds.RecordIsElectronic,
            };


            bool more = false;
            int start = 0;
            var trimClient = await getServiceClient();

            var hc = trimClient.GetHttpClient();
            hc.Timeout = new System.TimeSpan(1, 30, 0);

            do
            {
                try
                {
                    var response = trimClient.Get<RecordsResponse>(new TrimStreamSearch()
                    {
                        TrimType = BaseObjectTypes.Record,
                        q = "recElectronic",
                        Properties = propertyIds.Select(pid => $"{pid}").ToList(),
                        pageSize = 20,
                        sortBy = new string[] { "updated" },
                        Filter = "updated>1970-01-01 00:00:00Z",
                        start = start
                    });



                    more = response.HasMoreItems;
                    start = start + response.Results.Count;

                    foreach (var record in response.Results)
                    {

                        Console.WriteLine($"{record.IsElectronic} - {record.Uri} - {record.Title} - {record.Number} - {record.Assignee}");
                    }

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

    }

}
