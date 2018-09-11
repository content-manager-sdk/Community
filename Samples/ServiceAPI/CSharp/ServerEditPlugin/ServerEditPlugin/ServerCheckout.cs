using HP.HPTRIM.SDK;
using HP.HPTRIM.Service;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace ServerEditPlugin
{


    [Route("/ServerCheckout", "POST")]
    public class CommitRequest
    {
        public long Uri { get; set; } // URI of document to edit
        public bool KeepCheckedOut { get; set; }
        public bool NewRevision { get; set; }
        public string Comments { get; set; }
    }

    public class CommitResponse
    {

    }

    // The IReturn interface below allows this request to be used in the TrimClient.Get<> method
    [Route("/ServerCheckout/{Uri}", "GET")]
    public class ServerCheckout : IReturn<ServerCheckoutResponse>
    {
        public long Uri { get; set; }
    }

    public class ServerCheckoutResponse
    {
        public string Path { get; set; }
    }



    public class ServerCheckoutService : TrimServiceBase
    {
        // Changed this to the shared path you wish to use.
        const string SHARED_DIR = @"\\127.0.0.1\Shared\";
        private static string serviceUser = System.Security.Principal.WindowsIdentity.GetCurrent().Name;


        // This method creates a folder for the end user in which to check out their document.  you will probably wish to modify this to use a folder structure suitable for your organisation.
        private string GetUserWorkDir(Location trimUser, Database db)
        {
            try
            {
                string subdirName = Path.Combine(db.Id, trimUser.Uri.UriAsString);
                string physicalPath = Path.Combine(SHARED_DIR, subdirName);
                //string physicalPath = @"\\127.0.0.1\Shared\" + subdirName;
                if (!Directory.Exists(physicalPath))
                {
                    // Create new working directory for user under main DAVDir directory
                    try
                    {
                        DirectoryInfo physDir = System.IO.Directory.CreateDirectory(physicalPath);
                        // Apply appropriate Windows security.  Only the server user and the trim user should have control of this directory


                        // Some code to secure the folder.  I commented this out to simplify testing.  If folders are being auto generated you may wish to
                        // add this, or something similar, back.
                        /*
                        DirectorySecurity dirSec = physDir.GetAccessControl();
                        dirSec.SetAccessRuleProtection(true, false); // Disable security inheritance from parent and remove all inherited permissions
                        dirSec.SetOwner(new NTAccount(serviceUser));
                        dirSec.AddAccessRule(new FileSystemAccessRule(serviceUser, FileSystemRights.Modify, AccessControlType.Allow));
                        dirSec.AddAccessRule(new FileSystemAccessRule(trimUser.LogsInAs, FileSystemRights.ReadAndExecute | FileSystemRights.ListDirectory, AccessControlType.Allow));
                        physDir.SetAccessControl(dirSec);

                        */
                    }
                    catch (Exception ex)
                    {
                        throw new ApplicationException($"Exception occurred trying to create working directory path '{physicalPath}' for user '{trimUser.Name}'.  {ex.Message}");
                    }
                }
                return physicalPath;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Exception occurred trying to get working directory for user: {trimUser.Name}. {ex.Message}");
            }
        }

        private void GetDocPaths(Record record, out string physicalPath)
        {
            try
            {
                string userSubDir = GetUserWorkDir(record.CheckedOutTo != null ? record.CheckedOutTo : Database.CurrentUser, Database);
                physicalPath = record.GetSuggestedOutputPath(OutputPathTypes.ExtractDocument, userSubDir);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Exception occurred preparing working copy of electronic document in WebDAV share.  {ex.Message}");
            }
        }

        private void ExtractWorkingCopy(Record record, string physicalPath)
        {
            try
            {
                string whatIsThis = record.GetDocument(physicalPath, true, null, null);
                File.SetLastWriteTime(physicalPath, DateTime.Now);

            }
            catch (Exception ex)
            {
                Location trimUser = Database.CurrentUser;
                // If anything goes wrong, delete the file if it was created and check in the record if required
                if (record.CheckedOutTo != null && record.CheckedOutTo.Uri == trimUser.Uri)
                {
                    record.UndoCheckout("");
                    record.Save();
                }
                if (File.Exists(physicalPath)) { File.Delete(physicalPath); }
                throw new ApplicationException($"Exception occurred while extracting working copy for user '{trimUser.Name}' to path '{physicalPath}'.  {ex.Message}");
            }
        }

        public object Post(CommitRequest request)
        {
            // Locate record by URI
            long uri = request.Uri;
            if (uri <= 0)
            {
                throw new ApplicationException($"Invalid URI: {uri}");
            }

            Record record = new Record(Database, uri);
            Location trimUser = Database.CurrentUser;
            Location checkedOutTo = record.CheckedOutTo;

            string checkoutPath = record.CheckedOutPath;

            // Abort if not checked out to current user.
            if (checkedOutTo == null || (checkedOutTo != null && checkedOutTo.Uri != trimUser.Uri))
            {
                throw new ApplicationException("Document is not checked out to requesting user.");
            }


            if (!checkoutPath.StartsWith(SHARED_DIR))
            {
                throw new ApplicationException("Document is not checked out to the shared path.");
            }

            if (!System.IO.File.Exists(checkoutPath))
            {
                throw new ApplicationException($"Document is already checked out to '{trimUser.Name}' but working copy can't be found in expected location '{checkoutPath}' on server.");
            }

            // Electronic document was found.  Now update revision, check in document and return response.
            InputDocument inpDoc = new InputDocument(checkoutPath);
            inpDoc.CheckinAs = Path.GetFileName(record.ESource); // Preserve original file name when checking back in
            record.SetDocument(inpDoc, request.NewRevision, request.KeepCheckedOut, request.Comments);
            record.Save(); // Calling record.SetCheckedOutPath(WEBDAV_CHECKOUT_PATH) below prevents the new revision from being saved, so save the record first.
            if (request.KeepCheckedOut)
            {
                // SetDocument overrides checkedoutpath, so call this function to set it back to how we want it and save the record again
                // TODO - ask Rory why it works this way
                record.SetCheckedOutPath(checkoutPath);
                record.Save();
            }
            // Remove document from webdav if checking back in
            if (!request.KeepCheckedOut) { File.Delete(checkoutPath); }

            return new CommitResponse();
        }
        public object Get(ServerCheckout request)
        {
            ServerCheckoutResponse response = new ServerCheckoutResponse();
            if (request.Uri > 0)
            {
                Record record = new Record(this.Database, request.Uri);

                Location trimUser = Database.CurrentUser;
                // Check that the user making the request isn't the same as the user running the server
                if (trimUser.LogsInAs == serviceUser)
                {
                    throw new ApplicationException("Edit feature is not supported when accessing the web client as the same identity that is executing the web service.");
                }
                Location checkedOutTo = record.CheckedOutTo;
                // Abort if checked out to somebody else, or not checked out to webdav
                if (checkedOutTo != null)
                {
                    if (checkedOutTo.Uri != trimUser.Uri)
                    {
                        throw new ApplicationException("Document is already checked out to another user.");
                    }
                    else if (!record.CheckedOutPath.StartsWith(SHARED_DIR))
                    {
                        throw new ApplicationException("Document is already checked out to a different location.");
                    }
                }
                string physicalPath;
                GetDocPaths(record, out physicalPath);

                if (record.CheckedOutTo == null)
                {
                    // Document is not checked out.  We can extract a new working copy.  Change the modification date to current time when extracting
                    // a working copy of the electronic document so that MS Office recognises it as a more recent version 
                    // than its cached copy and discards the cached copy in favour of the working copy.
                    ExtractWorkingCopy(record, physicalPath);


                }
                else if (!System.IO.File.Exists(physicalPath))
                {
                    throw new ApplicationException($"Document is already checked out to '{trimUser.Name}' but working copy can't be found in expected location '{physicalPath}' on server.");
                }

                return new ServerCheckoutResponse() { Path = physicalPath };
            }
            return response;
        }
    }
}

