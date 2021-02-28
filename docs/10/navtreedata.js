/*
 @licstart  The following is the entire license notice for the JavaScript code in this file.

 The MIT License (MIT)

 Copyright (C) 1997-2020 by Dimitri van Heesch

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 and associated documentation files (the "Software"), to deal in the Software without restriction,
 including without limitation the rights to use, copy, modify, merge, publish, distribute,
 sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or
 substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 @licend  The above is the entire license notice for the JavaScript code in this file
*/
var NAVTREE =
[
  [ "Micro Focus Content Manager SDK 10.0", "index.html", [
    [ "Welcome to the Content Manager SDK Documentation", "index.html", [
      [ "Overview", "index.html#autotoc_md120", null ],
      [ "Important", "index.html#autotoc_md121", null ],
      [ "Older Versions", "index.html#autotoc_md122", null ],
      [ "More Help", "index.html#autotoc_md123", null ]
    ] ],
    [ "Supporting Information", "md_doc_00____legal.html", [
      [ "Legal Notices", "md_doc_00____legal.html#legal", [
        [ "Trademark notices", "md_doc_00____legal.html#trademark", null ],
        [ "Copyright Notice", "md_doc_00____legal.html#copyright", null ]
      ] ],
      [ "Support", "md_doc_00____legal.html#support", null ]
    ] ],
    [ "Release Notes", "release_notes.html", [
      [ "Content Manager 10.0", "release_notes.html#rn_100", [
        [ "Content Manager SDK assembly and namespace renamed", "release_notes.html#rn_10_SdkRename", null ],
        [ "Deleted methods and properties:", "release_notes.html#autotoc_md1", null ],
        [ "Get the field definition for this word", "release_notes.html#autotoc_md2", null ],
        [ "Create External Link from SDK", "release_notes.html#autotoc_md3", null ],
        [ "Monitor event processor", "release_notes.html#rn_10_EventProcessor", null ],
        [ "Get a string listing all the record types to which this classification is allowed to be attached", "release_notes.html#rn_10_OnlyRecordTypes", null ],
        [ "Get the Location object which is the assignee of the first activity in this workflow", "release_notes.html#rn_10_InitialAssignee", null ],
        [ "A boolean property indicating whether the current user can view all the details of this location", "release_notes.html#rn_10_CanViewAllDetails", null ],
        [ "Gets a number indicating how many times the electronic document attached to this record has been viewed", "release_notes.html#rn_10_ViewCounter", null ],
        [ "Get a string which represents the global default for user preferences for the nominated application", "release_notes.html#rn_10_AppConfig", null ],
        [ "Support aggregated search results", "release_notes.html#rn_10_CR_304037", null ],
        [ "Suppress document extract logging", "release_notes.html#rn_10_CR_321043", null ],
        [ "New search clause to do a raw elastic query", "release_notes.html#rn_10_CR_241863", null ],
        [ "New search clauses to find all ancestors recursively", "release_notes.html#rn_10_CR_243144", null ],
        [ "UserLabel Owner now a modifiable property", "release_notes.html#rn_10_lbl_owner", null ],
        [ "Copy security annotations to email headers", "release_notes.html#rn_10_CR_282059", null ],
        [ "Enhancements to Record recycle and restore", "release_notes.html#rn_10_CR_333019", null ],
        [ "Custom Icons", "release_notes.html#rn_10_CR_343044", null ],
        [ "Add saved search as a filter to Search Form", "release_notes.html#rn_10_CR_345008", null ],
        [ "Superseded by information in Schedule", "release_notes.html#rn_10_Schedule", null ],
        [ "Option to set how to deal with the situation when new contents get added to this container and it has a different scheduled disposal type", "release_notes.html#rn_10_CR_317155", null ],
        [ "Manually delete a single Record from the recycle bin", "release_notes.html#rn_10_CR_324026", null ],
        [ "Attach 'Workflow' template or 'Action Tracking' Procedure to Classification as default to be applied to record when attaching Classification to record", "release_notes.html#rn_10_CR_333029", null ],
        [ "Link non Record objects to a ToDo item", "release_notes.html#rn_10_CR_324012", null ],
        [ "New search method for Location Job Title", "release_notes.html#rn_10_CR_355002", null ],
        [ "Make Icon files available in the SDK", "release_notes.html#rn_10_Icons", null ],
        [ "Find Saved Searches that have not been recently used", "release_notes.html#rn_10_CR_3234339", null ],
        [ "System option to update Record Number on change of Classification", "release_notes.html#rn_10_CLS_UPD", null ],
        [ "Improve display of decimal field values", "release_notes.html#rn_10_CR_358003", null ],
        [ "Search by Edit Status", "release_notes.html#rn_10_CR_356058", null ],
        [ "Workflow Templates provide ability to activate Additional fields per template", "release_notes.html#rn_10_CR_353024", null ],
        [ "Control whether clauses are added to recent search methods", "release_notes.html#rn_10_RecentClauses", null ],
        [ "Get blocked file extensions", "release_notes.html#rn_10_CR_362022", null ],
        [ "Additions to FormDefinition", "release_notes.html#rn_10_CR_373046", null ],
        [ "Include Tags in the metadata options of electronic records", "release_notes.html#rn_10_CR_373007", null ],
        [ "Introduce a UDF that can be updated once disposition is Destroyed", "release_notes.html#rn_10_CR_379030", null ],
        [ "Ability to suppress legal hold designation", "release_notes.html#rn_10_CR_242100", null ],
        [ "Light weight Records", "release_notes.html#rn_10_CR_379045", [
          [ "Example", "release_notes.html#autotoc_md4", null ]
        ] ],
        [ "Indicator on a record when Notes have been added", "release_notes.html#rn_10_CR_384012", null ],
        [ "Provide a version of TransferStorage just for older revisions", "release_notes.html#rn_10_CR_335066", null ],
        [ "New DocumentStoreIncrementalCheckTask", "release_notes.html#rn_10_CR_373041", null ],
        [ "Changes to Consignment processing", "release_notes.html#rn_10_CR_387008", null ],
        [ "Unknown Location type validation", "release_notes.html#autotoc_md5", null ],
        [ "Display Child lists in the .Net SDK", "release_notes.html#autotoc_md6", [
          [ "Sample Code", "release_notes.html#autotoc_md7", null ]
        ] ],
        [ "Provide a way of limiting users from extracting and printing sensitive documents", "release_notes.html#rn_10_CR_339007", null ],
        [ "Make Notes user stamp mandatory", "release_notes.html#rn_10_CR_394004", null ],
        [ "Detect whether a search is using the user's default sort and filters", "release_notes.html#rn_10_CR_401078", null ],
        [ "Improve performance and stability of document integrity check", "release_notes.html#rn_10_CR_421003", null ],
        [ "InputDocument.SetAsAlreadyStoredItem SDK function sets record Date Modified to current date rather than Date Modified from document profile", "release_notes.html#rn_10_CR_398052", null ],
        [ "Allow content index updates of missing Records using the SDK so that users can automate the process", "release_notes.html#rn_10_CR_360002", null ],
        [ "More user-friendly style of displaying record types for selection", "release_notes.html#rn_10_CR_343056", [
          [ "Sample Code", "release_notes.html#autotoc_md8", null ]
        ] ],
        [ "More control on copying a record using Record.CreateNewCopy() method", "release_notes.html#rn_100_CreateNewCopy", null ]
      ] ],
      [ "Content Manager 9.4", "release_notes.html#rn_94", [
        [ "BREAKING CHANGE - History.EventType changed enum type", "release_notes.html#rn_94_History_Event_Type", null ],
        [ "Unrestricted file upload vulnerability", "release_notes.html#rn_94_CR_68008", null ],
        [ "Refine a search to returned the current or latest version of documents", "release_notes.html#rn_94_CR_40696", null ],
        [ "Include more functionality to handle deleted and cancelled record requests and audit all actions", "release_notes.html#rn_94_CR_68155", null ],
        [ "Record Title as column in historical event search", "release_notes.html#rn_94_CR_68162", null ],
        [ "No email notifications for requested records located in Space Management", "release_notes.html#rn_94_235932", null ],
        [ "Online Audit log - The audit history does not include all changes when a person location is associated to a position", "release_notes.html#rn_94_240852", null ],
        [ "Provide a default for the author property for a Document Queue", "release_notes.html#rn_94_242619", null ],
        [ "Automatic Sub folders sort order for Record Types", "release_notes.html#rn_94_243471", null ],
        [ "Search for records has no Hold returns records has Hold", "release_notes.html#rn_94_243890", null ],
        [ "Expose RestartDocumentReview to the SDK", "release_notes.html#rn_94_RestartDocumentReview", null ],
        [ "Searching Browse Via Classification - ability to select a sort method for listed records under Classifications", "release_notes.html#rn_94_243330", null ],
        [ "HasMore property on TrimMainObjectSearch", "release_notes.html#rn_94_244326", null ],
        [ "Expose ChangeMatter and ChangeClient functionality in SDK", "release_notes.html#rn_94_275049", null ],
        [ "Knowledge workers can't request Pickup Requests", "release_notes.html#rn_94_276062", null ],
        [ "Implement a generic origin type for third party applications to use for bulk loading", "release_notes.html#rn_94_281059", null ],
        [ "SDK available as NuGet package", "release_notes.html#rn_94_sdk_nuget", null ],
        [ "Provide a way of doing server side updates in a custom event processor and preserving the lastUpdatedBy (and dateLastUpdated) fields", "release_notes.html#rn_94_254005", null ],
        [ "Expose SDK connection pool configuration", "release_notes.html#rn_94_244672", null ],
        [ "Auto Profiling - provide a per-record option to choose the record title from the document properties or the document file name", "release_notes.html#rn_94_242263", null ],
        [ "Add access control to User Labels", "release_notes.html#rn_94_237243", null ],
        [ "Resolve ambiguities as to who can see a classification", "release_notes.html#rn_94_241217", null ],
        [ "Issues with \"Due Date for completion of review process\" and \"Due Date for the reviewer to complete their work\" fields.", "release_notes.html#rn_94_237708", null ],
        [ "Allocate a custom title to an alert.", "release_notes.html#rn_94_236524", null ],
        [ "Unable to send more than 100 Records at a time to External Link", "release_notes.html#rn_94_237958", null ],
        [ "Specify which record type is allowed to be placed into closed containers", "release_notes.html#rn_94_263031", null ],
        [ "Add Notes to User Labels", "release_notes.html#rn_94_270010", null ],
        [ "Check-in Styles and Document Queues to include additional options", "release_notes.html#rn_94_237525", null ],
        [ "Send to Recycle Bin - Soft delete for Records", "release_notes.html#rn_94_237934", null ],
        [ "Hide custom record types from search response", "release_notes.html#rn_94_CR_68013", null ],
        [ "Folder Synchronization - provide a way of detecting when content is removed from a folder for offline synchronization purposes", "release_notes.html#rn_94_Folder_Sync", null ],
        [ "Provide a data stream capability to avoid delays caused by object cache instantiation", "release_notes.html#rn_94_CR_68152", null ],
        [ "Implement new Record methods for closing (and reopening) containers", "release_notes.html#rn_94_CR_68065", null ],
        [ "Searches to be able to filter / clause based on enum", "release_notes.html#rn_94_CR_43842", null ],
        [ "Need a way to inform SDK applications of object change notifications and other system messages", "release_notes.html#rn_94_notifications", null ]
      ] ],
      [ "Content Manager 9.3", "release_notes.html#rn_93", [
        [ "SDK no longer installed in GAC", "release_notes.html#rn_sdk_GAC", null ],
        [ "Removed properties", "release_notes.html#autotoc_md9", null ],
        [ "Audits - Unable to see the Audit log for the records placed on hold as a group", "release_notes.html#rn_93_audits", null ],
        [ "Record import not working when lookup item additional field is on a record", "release_notes.html#rn_93_lookupset", null ],
        [ "Property on Offline Record object to tell us whether auto checkin has is enabled", "release_notes.html#rn_93_offlinerecord", null ],
        [ "Consignments", "release_notes.html#rn_93_consignment", null ],
        [ "History", "release_notes.html#rn_93_history", null ],
        [ "RecordAction", "release_notes.html#rn_93_recordaction", null ],
        [ "Retention Schedules - provide support for event based scheduling", "release_notes.html#rn_93_archive", null ],
        [ "View Panel - Add the To Do items in record View Panel", "release_notes.html#rn_93_todoitems", null ],
        [ "Record Type", "release_notes.html#rn_93_recordtype", null ],
        [ "Database", "release_notes.html#rn_93_database", null ],
        [ "Request", "release_notes.html#rn_93_request", null ],
        [ "UserLabel", "release_notes.html#rn_93_userlabel", null ],
        [ "DroppedFileUserOptions", "release_notes.html#rn_93_droppedfileuseroptions", null ],
        [ "Ability to manage favourite and recent search clauses in user profile", "release_notes.html#rn_93_favoritesearchmethodsuseroptions", null ],
        [ "Providing a custom sort order specifically for Tray searches", "release_notes.html#rn_93_TraySortAndFilterUserOptions", null ]
      ] ],
      [ "Content Manager 9.2", "release_notes.html#rn_92", [
        [ "Checking for duplicate documents by hash", "release_notes.html#rn_92_hashing", null ],
        [ "Searching for Record types: 'can contain' and 'can be contained in'", "release_notes.html#rn_92_rt_contains_searching", null ],
        [ "Updates to Lookupsets", "release_notes.html#rn_92_lookupsets", null ],
        [ "Issues with constructors", "release_notes.html#rn_92_constructors", null ],
        [ "IsValidFor throws an exception rather than returning false with information", "release_notes.html#rn_92_IsValidFor", null ],
        [ "Promote Revision function that works like the functions inside trim.exe", "release_notes.html#rn_92_PromoteRevision", null ],
        [ "Database pool built into SDK", "release_notes.html#rn_92_DatabasePool", null ],
        [ "Provide a HasPermission function for the TRIM main object", "release_notes.html#rn_92_HasPermission", null ],
        [ "Prevent invalid extensions from interfering with the checkout process", "release_notes.html#rn_92_InvalidExtensions", null ],
        [ "SDK methods to support field sorting", "release_notes.html#rn_92_FieldSorting", null ],
        [ "SDK methods to support blocking of search methods", "release_notes.html#rn_92_BlockedSearchMethods", null ],
        [ "Exposing the Initiating Workflow template concept in the SDK", "release_notes.html#autotoc_md10", null ],
        [ "Provide a way of \"crawling\" the repository without tripping the LastUpdatedOn date", "release_notes.html#autotoc_md11", null ]
      ] ]
    ] ],
    [ "Start here", "start_here.html", [
      [ "Using the Content Manager .NET SDK", "start_here.html#using_the_sdk", [
        [ "Technical Prerequisites and Assumptions", "start_here.html#tech_prereq", null ],
        [ "Binary compatibility", "start_here.html#bin_compat", null ]
      ] ],
      [ "Content Manager .NET SDK", "start_here.html#sdkIntro", null ],
      [ "Using the Content Manager .NET SDK", "start_here.html#usingTheSDK", null ],
      [ "Getting started", "start_here.html#sdkGettingStarted", [
        [ "Creating a reference to the .NET SDK", "start_here.html#createRef", null ],
        [ "Downloading the .NET SDK from NuGet", "start_here.html#autotoc_md12", null ],
        [ "Finding Content Manager libraries at runtime", "start_here.html#findingAssemblies", [
          [ "Code Example (with explicit initialization)", "start_here.html#autotoc_md13", null ],
          [ "Code Example (without explicit initialization)", "start_here.html#autotoc_md14", null ]
        ] ],
        [ "Loading TRIM.SDK.dll assembly dynamically", "start_here.html#dynamicSdkLoading", null ],
        [ "Memory Management", "start_here.html#memory_management", [
          [ "Examples", "start_here.html#autotoc_md15", null ],
          [ "Using statement", "start_here.html#autotoc_md16", null ],
          [ "Try/Finally", "start_here.html#autotoc_md17", null ]
        ] ],
        [ "Leak tracking", "start_here.html#autotoc_md18", null ]
      ] ]
    ] ],
    [ "Open ID Connect Authentication", "oidc.html", [
      [ "Authentication overview", "oidc.html#auth_overview", null ],
      [ "ADFS for WebClient and ServiceAPI", "oidc.html#oidc_adfs", [
        [ "Create the AD FS  Application", "oidc.html#autotoc_md19", [
          [ "Examples", "oidc.html#autotoc_md20", [
            [ "New AD FS application", "oidc.html#autotoc_md21", null ],
            [ "Add Redirect URI", "oidc.html#autotoc_md22", null ],
            [ "Generate Secret", "oidc.html#autotoc_md23", null ],
            [ "Specify Web API identifier", "oidc.html#autotoc_md24", null ]
          ] ]
        ] ],
        [ "Add the settings to the Web Client", "oidc.html#autotoc_md25", [
          [ "Example", "oidc.html#autotoc_md26", null ]
        ] ],
        [ "Configure AD FS for Office Integration access", "oidc.html#autotoc_md27", [
          [ "Examples", "oidc.html#autotoc_md28", [
            [ "Add native application", "oidc.html#autotoc_md29", null ],
            [ "Add permissions for native application", "oidc.html#autotoc_md30", null ],
            [ "Specifiy claims to be included in token", "oidc.html#autotoc_md31", null ]
          ] ]
        ] ],
        [ "Add office integration the settings to the Web Client", "oidc.html#autotoc_md32", null ]
      ] ],
      [ "AzureAD for WebClient and ServiceAPI", "oidc.html#oidc_azuread", [
        [ "Create the Azure AD Application", "oidc.html#autotoc_md33", [
          [ "Example", "oidc.html#autotoc_md34", null ]
        ] ],
        [ "Add a secret", "oidc.html#autotoc_md35", [
          [ "Example", "oidc.html#autotoc_md36", null ]
        ] ],
        [ "Configure authentication in hptrim.config", "oidc.html#autotoc_md37", [
          [ "Example config", "oidc.html#autotoc_md38", null ]
        ] ],
        [ "Enable redirect", "oidc.html#autotoc_md39", null ],
        [ "Logout", "oidc.html#autotoc_md40", [
          [ "Example", "oidc.html#autotoc_md41", null ]
        ] ],
        [ "Allow anonymous access in the IIS", "oidc.html#autotoc_md42", null ]
      ] ],
      [ "Google authentication for WebClient and ServiceAPI", "oidc.html#oidc_google", [
        [ "Create the Google Credentials", "oidc.html#autotoc_md43", [
          [ "Example", "oidc.html#autotoc_md44", null ]
        ] ],
        [ "Configure authentication in hptrim.config", "oidc.html#autotoc_md45", [
          [ "Example config", "oidc.html#autotoc_md46", null ]
        ] ],
        [ "Enable redirect", "oidc.html#autotoc_md47", null ],
        [ "Logout", "oidc.html#autotoc_md48", [
          [ "Example", "oidc.html#autotoc_md49", null ]
        ] ],
        [ "Allow anonymous access in the IIS", "oidc.html#autotoc_md50", null ]
      ] ],
      [ "AzureAD for Content Manager Desktop", "oidc.html#oidc_azuread_desktop", [
        [ "Create the Azure AD Application", "oidc.html#autotoc_md51", [
          [ "Example", "oidc.html#autotoc_md52", null ]
        ] ],
        [ "Configure permissions", "oidc.html#autotoc_md53", [
          [ "Example", "oidc.html#autotoc_md54", null ]
        ] ],
        [ "Configure authentication in Content Manager Enterprise Studio", "oidc.html#autotoc_md55", [
          [ "Example", "oidc.html#autotoc_md56", null ]
        ] ],
        [ "Configure Azure AD for Office Integration access", "oidc.html#autotoc_md57", [
          [ "Example Config", "oidc.html#autotoc_md58", null ]
        ] ],
        [ "Troubleshooting Azure AD for Office Integration access", "oidc.html#autotoc_md59", [
          [ "Error AADSTS500011: The resource principal named https://MYSERVER/contentmanager/ was not found in the tenant named XXXX-XXXX-XXXXX-XXXXXX.", "oidc.html#autotoc_md60", null ]
        ] ]
      ] ]
    ] ],
    [ "Zero Footprint OfficeIntegration", "zero_office.html", [
      [ "Components", "zero_office.html#autotoc_md61", null ],
      [ "Requirements", "zero_office.html#autotoc_md62", [
        [ "ServiceAPI", "zero_office.html#autotoc_md63", [
          [ "ServiceAPI Configuration", "zero_office.html#autotoc_md64", [
            [ "Office Integration configuration", "zero_office.html#autotoc_md65", null ],
            [ "Authentication", "zero_office.html#autotoc_md66", null ]
          ] ]
        ] ],
        [ "Manifests", "zero_office.html#autotoc_md67", null ],
        [ "Email Link", "zero_office.html#autotoc_md68", null ],
        [ "OneDrive file handler", "zero_office.html#autotoc_md69", [
          [ "Refreshing the file handler", "zero_office.html#refresh_access_token", null ]
        ] ]
      ] ]
    ] ],
    [ "Programming in Content Manager", "programming_guide.html", [
      [ "Introduction", "programming_guide.html#programming_in", [
        [ "The main objects", "programming_guide.html#main_objects", null ],
        [ "Using the TrimApplication object", "programming_guide.html#application_object", null ],
        [ "Using the Database object", "programming_guide.html#database_object", [
          [ "Code Example", "programming_guide.html#autotoc_md70", null ]
        ] ],
        [ "Database pooling", "programming_guide.html#database_pooling", [
          [ "Code Example", "programming_guide.html#autotoc_md71", null ]
        ] ]
      ] ],
      [ "Creating and modifying Records", "programming_guide.html#creating_records", [
        [ "Creating new Records", "programming_guide.html#new_record", [
          [ "Code example", "programming_guide.html#autotoc_md72", null ]
        ] ],
        [ "Setting the Container and Classification", "programming_guide.html#creating_records_container", null ],
        [ "Accessing existing records", "programming_guide.html#access_existing_record", null ],
        [ "Getting a record by record number", "programming_guide.html#get_existing_record", [
          [ "Code Example", "programming_guide.html#autotoc_md73", null ]
        ] ],
        [ "Getting a Record by URI", "programming_guide.html#record_by_uri", [
          [ "Code Example", "programming_guide.html#autotoc_md74", null ]
        ] ]
      ] ],
      [ "Reading record data", "programming_guide.html#reading_record_data", [
        [ "Basic properties", "programming_guide.html#reading_basic_properties", [
          [ "Examples of basic readable properties of a record are:", "programming_guide.html#autotoc_md75", null ],
          [ "Code Example", "programming_guide.html#autotoc_md76", null ]
        ] ],
        [ "Accessing related objects", "programming_guide.html#related_objects", [
          [ "Code Example", "programming_guide.html#autotoc_md77", null ]
        ] ],
        [ "Accessing record Location information", "programming_guide.html#record_Location_info", [
          [ "Code Example", "programming_guide.html#autotoc_md78", null ]
        ] ]
      ] ],
      [ "Updating records", "programming_guide.html#updating_records", [
        [ "Modifying properties", "programming_guide.html#modifying_properties", [
          [ "Code Example", "programming_guide.html#autotoc_md79", null ]
        ] ],
        [ "Calling update methods", "programming_guide.html#update_methods", [
          [ "Code Example", "programming_guide.html#autotoc_md80", null ],
          [ "Code Example", "programming_guide.html#autotoc_md81", null ]
        ] ],
        [ "Updating properties using SetProperty", "programming_guide.html#updating_properties", [
          [ "Code Example", "programming_guide.html#autotoc_md82", null ]
        ] ],
        [ "User Defined Fields", "programming_guide.html#update_user_defined_fields", [
          [ "Code Example (GetFieldValue())", "programming_guide.html#autotoc_md83", null ],
          [ "Code Example (SetFieldValue())", "programming_guide.html#autotoc_md84", null ]
        ] ]
      ] ],
      [ "Verifying and error trapping", "programming_guide.html#Verifying_and_error_trapping", [
        [ "The Verify() method", "programming_guide.html#The_Verify_method", [
          [ "Code Example", "programming_guide.html#autotoc_md85", null ]
        ] ],
        [ "The Verified property", "programming_guide.html#The_Verified_property", null ],
        [ "Trapping run-time errors", "programming_guide.html#Trapping_run-time_errors", null ],
        [ "Saving the record to the database", "programming_guide.html#Saving_the_record_to_the_database", null ]
      ] ],
      [ "New records and electronic documents", "programming_guide.html#New_records_and_electronic_documents", [
        [ "Creating a container file", "programming_guide.html#autotoc_md86", null ],
        [ "Creating a record of a given type", "programming_guide.html#Creating_a_record_of_a_given_type", null ],
        [ "Controlled and free text titling", "programming_guide.html#Controlled_and_free_text_titling", [
          [ "Code Example", "programming_guide.html#autotoc_md87", null ]
        ] ],
        [ "Security Levels and Caveats", "programming_guide.html#Security_Levels_and_Caveats", [
          [ "Code Example", "programming_guide.html#autotoc_md88", null ],
          [ "Code Example", "programming_guide.html#autotoc_md89", null ]
        ] ],
        [ "Record Locations", "programming_guide.html#Record_Locations", [
          [ "Code Example", "programming_guide.html#autotoc_md90", null ]
        ] ],
        [ "Record Contacts", "programming_guide.html#Record_Contacts", [
          [ "Code Example", "programming_guide.html#autotoc_md91", null ]
        ] ],
        [ "Creating a Document", "programming_guide.html#Creating_a_Document", null ],
        [ "Titling and numbering", "programming_guide.html#Titling_and_numbering", [
          [ "Code Example", "programming_guide.html#autotoc_md92", null ]
        ] ],
        [ "Assigning to a container", "programming_guide.html#Assigning_to_a_container", [
          [ "Code Example", "programming_guide.html#autotoc_md93", null ]
        ] ],
        [ "Attaching an electronic document", "programming_guide.html#Attaching_an_electronic_document", [
          [ "Code Example", "programming_guide.html#autotoc_md94", null ]
        ] ],
        [ "Document Author", "programming_guide.html#Document_Author", null ]
      ] ],
      [ "Locations", "programming_guide.html#Locations", [
        [ "Working with Locations", "programming_guide.html#Working_with_Locations", null ],
        [ "Finding a Person by Name", "programming_guide.html#Finding_a_Person_by_Name", [
          [ "Code Example", "programming_guide.html#autotoc_md95", null ]
        ] ],
        [ "Creating a new Staff Member", "programming_guide.html#Creating_a_new_Staff_Member", [
          [ "Code Example", "programming_guide.html#autotoc_md96", null ],
          [ "Code Example", "programming_guide.html#autotoc_md97", null ],
          [ "Code Example", "programming_guide.html#autotoc_md98", null ]
        ] ]
      ] ],
      [ "Searching Content Manager using the .NET SDK", "programming_guide.html#Searching_Content_Manager", [
        [ "Searching for Content Manager objects", "programming_guide.html#Searching_for_Records_Manager_objects", [
          [ "Code Example", "programming_guide.html#autotoc_md99", null ]
        ] ],
        [ "Specifying the search criteria", "programming_guide.html#Specifying_the_search_criteria", [
          [ "Code Example", "programming_guide.html#autotoc_md100", null ],
          [ "Code Example", "programming_guide.html#autotoc_md101", null ]
        ] ],
        [ "Retrieving the results of the search", "programming_guide.html#Retrieving_the_results", [
          [ "Code Example", "programming_guide.html#autotoc_md102", null ]
        ] ]
      ] ],
      [ "Other search features", "programming_guide.html#Other_search_features", [
        [ "Return paged results", "programming_guide.html#search_paged_results", null ],
        [ "Filtering/searching by enum value", "programming_guide.html#enum_filtering", null ],
        [ "Purpose filtering", "programming_guide.html#Purpose_filtering", null ],
        [ "Persisting a search", "programming_guide.html#Persisting_a_search", null ],
        [ "Item matching", "programming_guide.html#autotoc_md103", null ],
        [ "Result counts", "programming_guide.html#search_count", null ],
        [ "Sorting by User Defined Fields", "programming_guide.html#sort_by_field", null ]
      ] ],
      [ "Stream searching", "programming_guide.html#stream_search", [
        [ "Example", "programming_guide.html#example_stream_search", null ],
        [ "Sample JSON", "programming_guide.html#example_stream_search_json", null ]
      ] ],
      [ "Document integrity checker", "programming_guide.html#document_integrity_checker", [
        [ "Example: Running Document Store Integrity Check", "programming_guide.html#example_running_document_store_integrity_check", null ]
      ] ],
      [ "Global object change notifications", "programming_guide.html#change_notifications", [
        [ "Example", "programming_guide.html#example_change_notifications", null ]
      ] ],
      [ "Progress notifications while communicating with a workgroup server", "programming_guide.html#wgs_progress_notifications", null ]
    ] ],
    [ "80 - SearchClauses", "md_doc_80____search_clauses.html", [
      [ "Using Search Clauses", "md_doc_80____search_clauses.html#search_clause_using", [
        [ "Interrogating metadata", "md_doc_80____search_clauses.html#autotoc_md104", [
          [ "Code Sample", "md_doc_80____search_clauses.html#autotoc_md105", null ]
        ] ]
      ] ],
      [ "List of search clauses by object type", "md_doc_80____search_clauses.html#searcg_clauses_by_object_type", [
        [ "ActionDef", "md_doc_80____search_clauses.html#search_clauses_ActionDef", null ],
        [ "Activity", "md_doc_80____search_clauses.html#search_clauses_Activity", null ],
        [ "AgendaItem", "md_doc_80____search_clauses.html#search_clauses_AgendaItem", null ],
        [ "AgendaItemType", "md_doc_80____search_clauses.html#search_clauses_AgendaItemType", null ],
        [ "Alert", "md_doc_80____search_clauses.html#search_clauses_Alert", null ],
        [ "ArchiveEvent", "md_doc_80____search_clauses.html#search_clauses_ArchiveEvent", null ],
        [ "AutoPartRule", "md_doc_80____search_clauses.html#search_clauses_AutoPartRule", null ],
        [ "Census", "md_doc_80____search_clauses.html#search_clauses_Census", null ],
        [ "CheckinStyle", "md_doc_80____search_clauses.html#search_clauses_CheckinStyle", null ],
        [ "Classification", "md_doc_80____search_clauses.html#search_clauses_Classification", null ],
        [ "Communication", "md_doc_80____search_clauses.html#search_clauses_Communication", null ],
        [ "Consignment", "md_doc_80____search_clauses.html#search_clauses_Consignment", null ],
        [ "ConsignmentApprover", "md_doc_80____search_clauses.html#search_clauses_ConsignmentApprover", null ],
        [ "ConsignmentIssue", "md_doc_80____search_clauses.html#search_clauses_ConsignmentIssue", null ],
        [ "ConsignmentRejection", "md_doc_80____search_clauses.html#search_clauses_ConsignmentRejection", null ],
        [ "DocumentQueue", "md_doc_80____search_clauses.html#search_clauses_DocumentQueue", null ],
        [ "ElectronicStore", "md_doc_80____search_clauses.html#search_clauses_ElectronicStore", null ],
        [ "ExternalIcon", "md_doc_80____search_clauses.html#search_clauses_ExternalIcon", null ],
        [ "ExternalLink", "md_doc_80____search_clauses.html#search_clauses_ExternalLink", null ],
        [ "ExternalWorkflow", "md_doc_80____search_clauses.html#search_clauses_ExternalWorkflow", null ],
        [ "ExternalWorkflowTask", "md_doc_80____search_clauses.html#search_clauses_ExternalWorkflowTask", null ],
        [ "ExternalWorkflowType", "md_doc_80____search_clauses.html#search_clauses_ExternalWorkflowType", null ],
        [ "FieldDefinition", "md_doc_80____search_clauses.html#search_clauses_FieldDefinition", null ],
        [ "History", "md_doc_80____search_clauses.html#search_clauses_History", null ],
        [ "Hold", "md_doc_80____search_clauses.html#search_clauses_Hold", null ],
        [ "HtmlLayout", "md_doc_80____search_clauses.html#search_clauses_HtmlLayout", null ],
        [ "Jurisdiction", "md_doc_80____search_clauses.html#search_clauses_Jurisdiction", null ],
        [ "Keyword", "md_doc_80____search_clauses.html#search_clauses_Keyword", null ],
        [ "Location", "md_doc_80____search_clauses.html#search_clauses_Location", null ],
        [ "LookupSet", "md_doc_80____search_clauses.html#search_clauses_LookupSet", null ],
        [ "MailTemplate", "md_doc_80____search_clauses.html#search_clauses_MailTemplate", null ],
        [ "Meeting", "md_doc_80____search_clauses.html#search_clauses_Meeting", null ],
        [ "MeetingType", "md_doc_80____search_clauses.html#search_clauses_MeetingType", null ],
        [ "MetadataRule", "md_doc_80____search_clauses.html#search_clauses_MetadataRule", null ],
        [ "MinuteItem", "md_doc_80____search_clauses.html#search_clauses_MinuteItem", null ],
        [ "MinuteItemType", "md_doc_80____search_clauses.html#search_clauses_MinuteItemType", null ],
        [ "OfflineRecord", "md_doc_80____search_clauses.html#search_clauses_OfflineRecord", null ],
        [ "Origin", "md_doc_80____search_clauses.html#search_clauses_Origin", null ],
        [ "OriginHistory", "md_doc_80____search_clauses.html#search_clauses_OriginHistory", null ],
        [ "Record", "md_doc_80____search_clauses.html#search_clauses_Record", null ],
        [ "RecordAction", "md_doc_80____search_clauses.html#search_clauses_RecordAction", null ],
        [ "RecordType", "md_doc_80____search_clauses.html#search_clauses_RecordType", null ],
        [ "Report", "md_doc_80____search_clauses.html#search_clauses_Report", null ],
        [ "ReportBitmap", "md_doc_80____search_clauses.html#search_clauses_ReportBitmap", null ],
        [ "Request", "md_doc_80____search_clauses.html#search_clauses_Request", null ],
        [ "SavedSearch", "md_doc_80____search_clauses.html#search_clauses_SavedSearch", null ],
        [ "Schedule", "md_doc_80____search_clauses.html#search_clauses_Schedule", null ],
        [ "ScheduledTask", "md_doc_80____search_clauses.html#search_clauses_ScheduledTask", null ],
        [ "SearchForm", "md_doc_80____search_clauses.html#search_clauses_SearchForm", null ],
        [ "SecurityCaveat", "md_doc_80____search_clauses.html#search_clauses_SecurityCaveat", null ],
        [ "SecurityLevel", "md_doc_80____search_clauses.html#search_clauses_SecurityLevel", null ],
        [ "SharePointItem", "md_doc_80____search_clauses.html#search_clauses_SharePointItem", null ],
        [ "Space", "md_doc_80____search_clauses.html#search_clauses_Space", null ],
        [ "StopWord", "md_doc_80____search_clauses.html#search_clauses_StopWord", null ],
        [ "TodoItem", "md_doc_80____search_clauses.html#search_clauses_TodoItem", null ],
        [ "UserLabel", "md_doc_80____search_clauses.html#search_clauses_UserLabel", null ],
        [ "Word", "md_doc_80____search_clauses.html#search_clauses_Word", null ],
        [ "Workflow", "md_doc_80____search_clauses.html#search_clauses_Workflow", null ],
        [ "WorkflowTemplate", "md_doc_80____search_clauses.html#search_clauses_WorkflowTemplate", null ],
        [ "ZipCode", "md_doc_80____search_clauses.html#search_clauses_ZipCode", null ]
      ] ]
    ] ],
    [ "81 - Enum Values", "md_doc_81____enum__values.html", [
      [ "Using Enums", "md_doc_81____enum__values.html#enums_using", [
        [ "Interrogating metadata", "md_doc_81____enum__values.html#autotoc_md106", [
          [ "Code Sample", "md_doc_81____enum__values.html#autotoc_md107", null ]
        ] ]
      ] ],
      [ "List of enum items by Enum", "md_doc_81____enum__values.html#enum_item_by_enum_type_type", [
        [ "Database Type", "md_doc_81____enum__values.html#enum_help_databaseTypes", null ],
        [ "User Access Type", "md_doc_81____enum__values.html#enum_help_userTypes", null ],
        [ "Generic Usage Purpose", "md_doc_81____enum__values.html#enum_help_genericPurposes", null ],
        [ "Access Control Setting", "md_doc_81____enum__values.html#enum_help_accessControlSettings", null ],
        [ "Titling Method", "md_doc_81____enum__values.html#enum_help_titlingMethods", null ],
        [ "Numbering Method", "md_doc_81____enum__values.html#enum_help_numberingMethods", null ],
        [ "Behavior", "md_doc_81____enum__values.html#enum_help_recordBehaviour", null ],
        [ "Record Class", "md_doc_81____enum__values.html#enum_help_recordClass", null ],
        [ "Disposition", "md_doc_81____enum__values.html#enum_help_recordDisp", null ],
        [ "Schedule trigger", "md_doc_81____enum__values.html#enum_help_triggerTypes", null ],
        [ "Document Store Type", "md_doc_81____enum__values.html#enum_help_estoreTypes", null ],
        [ "Word Type", "md_doc_81____enum__values.html#enum_help_wordTypes", null ],
        [ "Numbering Type", "md_doc_81____enum__values.html#enum_help_nbrTypes", null ],
        [ "Methods to Attach thesaurus term", "md_doc_81____enum__values.html#enum_help_keywordAttachMethod", null ],
        [ "Record location Type", "md_doc_81____enum__values.html#enum_help_recordLocationType", null ],
        [ "Contact Type", "md_doc_81____enum__values.html#enum_help_contactType", null ],
        [ "Search contact Type", "md_doc_81____enum__values.html#enum_help_searchContactType", null ],
        [ "Thesaurus Term Relationship", "md_doc_81____enum__values.html#enum_help_keywordRelationship", null ],
        [ "Record Relationship", "md_doc_81____enum__values.html#enum_help_recordRelationshipType", null ],
        [ "Reverse record Relationship", "md_doc_81____enum__values.html#enum_help_revRecRelationship", null ],
        [ "Rendition Type", "md_doc_81____enum__values.html#enum_help_renditionType", null ],
        [ "Record Type Filter", "md_doc_81____enum__values.html#enum_help_recordTypeFilter", null ],
        [ "Event", "md_doc_81____enum__values.html#enum_help_events", null ],
        [ "Event Process Type", "md_doc_81____enum__values.html#enum_help_eventProcessType", null ],
        [ "Tray Type", "md_doc_81____enum__values.html#enum_help_trayType", null ],
        [ "Location Type", "md_doc_81____enum__values.html#enum_help_locationType", null ],
        [ "Search location Type", "md_doc_81____enum__values.html#enum_help_searchLocationType", null ],
        [ "Electronic Address Type", "md_doc_81____enum__values.html#enum_help_eAddressType", null ],
        [ "Location Usage Purpose", "md_doc_81____enum__values.html#enum_help_locationPurpose", null ],
        [ "Property Format", "md_doc_81____enum__values.html#enum_help_propertyFormats", null ],
        [ "Additional Field Format", "md_doc_81____enum__values.html#enum_help_userFieldFormats", null ],
        [ "Search Filter", "md_doc_81____enum__values.html#enum_help_searchFilterTypes", null ],
        [ "Sort Field", "md_doc_81____enum__values.html#enum_help_recordSortFields", null ],
        [ "Barcode userLabels Type", "md_doc_81____enum__values.html#enum_help_barcodeLabelType", null ],
        [ "Barcode Control Label", "md_doc_81____enum__values.html#enum_help_controlLabelType", null ],
        [ "Barcode Error", "md_doc_81____enum__values.html#enum_help_barcodeError", null ],
        [ "String Format", "md_doc_81____enum__values.html#enum_help_stringFormat", null ],
        [ "Text Object Type", "md_doc_81____enum__values.html#enum_help_textObjectType", null ],
        [ "Record location Sub Types", "md_doc_81____enum__values.html#enum_help_recLocSubTypes", null ],
        [ "Date Interval", "md_doc_81____enum__values.html#enum_help_dateInterval", null ],
        [ "Document Link Type", "md_doc_81____enum__values.html#enum_help_documentLinkType", null ],
        [ "General Error Handling", "md_doc_81____enum__values.html#enum_help_generalExceptionHandling", null ],
        [ "Container Security Type", "md_doc_81____enum__values.html#enum_help_containerSecurityHandling", null ],
        [ "Barcode Printing Option", "md_doc_81____enum__values.html#enum_help_barcodePrintOption", null ],
        [ "Location Default", "md_doc_81____enum__values.html#enum_help_locationDefault", null ],
        [ "Uses Store", "md_doc_81____enum__values.html#enum_help_useStoreType", null ],
        [ "Address Type", "md_doc_81____enum__values.html#enum_help_addressTypes", null ],
        [ "Location Relationship Type", "md_doc_81____enum__values.html#enum_help_locRelationshipType", null ],
        [ "Type of PropertiesAsStrings", "md_doc_81____enum__values.html#enum_help_propertiesStringType", null ],
        [ "Classification Usage Purpose", "md_doc_81____enum__values.html#enum_help_classificationPurpose", null ],
        [ "Hashing Algorithm", "md_doc_81____enum__values.html#enum_help_hashingAlgorithms", null ],
        [ "General Access Control", "md_doc_81____enum__values.html#enum_help_generalAccess", null ],
        [ "Workflow Access Control", "md_doc_81____enum__values.html#enum_help_workflowAccess", null ],
        [ "Record Access Control", "md_doc_81____enum__values.html#enum_help_recordAccess", null ],
        [ "Access Transfer Style", "md_doc_81____enum__values.html#enum_help_accessReferenceStyle", null ],
        [ "Assignee Default", "md_doc_81____enum__values.html#enum_help_currLocDef", null ],
        [ "Flow Control Type", "md_doc_81____enum__values.html#enum_help_flowControl", null ],
        [ "Space Level", "md_doc_81____enum__values.html#enum_help_spaceLevel", null ],
        [ "Space Purpose", "md_doc_81____enum__values.html#enum_help_spacePurposes", null ],
        [ "Space record Selection", "md_doc_81____enum__values.html#enum_help_spaceRecordsSelection", null ],
        [ "Space Allocation Method", "md_doc_81____enum__values.html#enum_help_spaceAllocation", null ],
        [ "Date Interval Singular", "md_doc_81____enum__values.html#enum_help_dateIntervalSing", null ],
        [ "Record Finalized Filter", "md_doc_81____enum__values.html#enum_help_finalizedFilter", null ],
        [ "Census record", "md_doc_81____enum__values.html#enum_help_censusRecords", null ],
        [ "Workflow Lock Operation", "md_doc_81____enum__values.html#enum_help_workflowLockOperation", null ],
        [ "Record Purpose", "md_doc_81____enum__values.html#enum_help_recordPurposes", null ],
        [ "Disposition Pending", "md_doc_81____enum__values.html#enum_help_recordDispPending", null ],
        [ "Mail Recipient Type", "md_doc_81____enum__values.html#enum_help_mailRecipientType", null ],
        [ "XML Document Export Type", "md_doc_81____enum__values.html#enum_help_xmlDocumentExportType", null ],
        [ "Dataset availability", "md_doc_81____enum__values.html#enum_help_databaseAvailability", null ],
        [ "Layout Purpose", "md_doc_81____enum__values.html#enum_help_layoutPurpose", null ],
        [ "Property String Display Type", "md_doc_81____enum__values.html#enum_help_stringDisplayType", null ],
        [ "Language", "md_doc_81____enum__values.html#enum_help_language", null ],
        [ "Document Store Usage Type", "md_doc_81____enum__values.html#enum_help_storeUsageType", null ],
        [ "Review Filter", "md_doc_81____enum__values.html#enum_help_pendingEventReviewFilter", null ],
        [ "Less Secure Document Security Type", "md_doc_81____enum__values.html#enum_help_documentSecurityHandling", null ],
        [ "Document Queue Type", "md_doc_81____enum__values.html#enum_help_queueTypes", null ],
        [ "Statistical Select By", "md_doc_81____enum__values.html#enum_help_statTypes", null ],
        [ "Queue Usage Type", "md_doc_81____enum__values.html#enum_help_queueUsageType", null ],
        [ "Statistical Grouping", "md_doc_81____enum__values.html#enum_help_statGroupByType", null ],
        [ "Queue Item Attribute", "md_doc_81____enum__values.html#enum_help_queueItemAttributes", null ],
        [ "Queue Property", "md_doc_81____enum__values.html#enum_help_queueCapability", null ],
        [ "Server Message Type", "md_doc_81____enum__values.html#enum_help_serverMessageTypes", null ],
        [ "Native Mail Capture Style", "md_doc_81____enum__values.html#enum_help_nativeMailStyles", null ],
        [ "Declassify Option", "md_doc_81____enum__values.html#enum_help_declassifyType", null ],
        [ "Scheduled Task Status", "md_doc_81____enum__values.html#enum_help_taskStatus", null ],
        [ "Security Update Type", "md_doc_81____enum__values.html#enum_help_securityUpdateTypes", null ],
        [ "URL Format", "md_doc_81____enum__values.html#enum_help_objectURLformats", null ],
        [ "Plugin Page Type", "md_doc_81____enum__values.html#enum_help_pluginPageType", null ],
        [ "Notes Update Type", "md_doc_81____enum__values.html#enum_help_notesUpdateType", null ],
        [ "Lock Down Type", "md_doc_81____enum__values.html#enum_help_lockdownStyles", null ],
        [ "Runtime Environment", "md_doc_81____enum__values.html#enum_help_environments", null ],
        [ "Notes Insert Style", "md_doc_81____enum__values.html#enum_help_notesInsertStyles", null ],
        [ "Meeting Document Type", "md_doc_81____enum__values.html#enum_help_meetingDocumentType", null ],
        [ "Type of Participant", "md_doc_81____enum__values.html#enum_help_invitationType", null ],
        [ "Meeting Attendance Type", "md_doc_81____enum__values.html#enum_help_attendanceType", null ],
        [ "Lookup Set Type", "md_doc_81____enum__values.html#enum_help_lookupSetType", null ],
        [ "Automated Part Type", "md_doc_81____enum__values.html#enum_help_aprType", null ],
        [ "Automated Part Rule Trigger", "md_doc_81____enum__values.html#enum_help_aprDateTypes", null ],
        [ "Document Selection Type", "md_doc_81____enum__values.html#enum_help_documentSelectionType", null ],
        [ "XML Schema Type", "md_doc_81____enum__values.html#enum_help_xmlSchemaTypes", null ],
        [ "Alert Type", "md_doc_81____enum__values.html#enum_help_alertType", null ],
        [ "Gender", "md_doc_81____enum__values.html#enum_help_gender", null ],
        [ "Cache type", "md_doc_81____enum__values.html#enum_help_wgsCacheType", null ],
        [ "Property or Field Format", "md_doc_81____enum__values.html#enum_help_propertyOrFieldFormat", null ],
        [ "Priority", "md_doc_81____enum__values.html#enum_help_priority", null ],
        [ "User Label Type", "md_doc_81____enum__values.html#enum_help_userLabelType", null ],
        [ "Physical Storage Action Type", "md_doc_81____enum__values.html#enum_help_psoActionType", null ],
        [ "Email Event Type", "md_doc_81____enum__values.html#enum_help_mailEventType", null ],
        [ "Communication Medium", "md_doc_81____enum__values.html#enum_help_communicationMedium", null ],
        [ "Communication Direction", "md_doc_81____enum__values.html#enum_help_communicationDirection", null ],
        [ "Communicator Type", "md_doc_81____enum__values.html#enum_help_communicatorType", null ],
        [ "Offline Status", "md_doc_81____enum__values.html#enum_help_offlineStatus", null ],
        [ "Address Type Used", "md_doc_81____enum__values.html#enum_help_snapAddressType", null ],
        [ "Electronic Storage Action Type", "md_doc_81____enum__values.html#enum_help_esoActionType", null ],
        [ "Trigger Rounding Type", "md_doc_81____enum__values.html#enum_help_triggerRounding", null ],
        [ "Month", "md_doc_81____enum__values.html#enum_help_months", null ],
        [ "Desktop Startup State", "md_doc_81____enum__values.html#enum_help_desktopStartStates", null ],
        [ "Day of the Week", "md_doc_81____enum__values.html#enum_help_dayOfTheWeek", null ],
        [ "Time Interval", "md_doc_81____enum__values.html#enum_help_timeInterval", null ],
        [ "Meeting Access Control", "md_doc_81____enum__values.html#enum_help_meetingAccess", null ],
        [ "Email Security Mode", "md_doc_81____enum__values.html#enum_help_emailSecurityMode", null ],
        [ "Motion Outcome", "md_doc_81____enum__values.html#enum_help_motionOutcome", null ],
        [ "Reference Type", "md_doc_81____enum__values.html#enum_help_todoReferenceType", null ],
        [ "Outline Number Type", "md_doc_81____enum__values.html#enum_help_outlineNumberType", null ],
        [ "Notification Type", "md_doc_81____enum__values.html#enum_help_notificationType", null ],
        [ "Document Usage Type", "md_doc_81____enum__values.html#enum_help_activityDocumentUsage", null ],
        [ "Document Placeholder Type", "md_doc_81____enum__values.html#enum_help_workflowDocumentPlaceholderType", null ],
        [ "Activity State", "md_doc_81____enum__values.html#enum_help_activityStates", null ],
        [ "Initiating Record Behavior", "md_doc_81____enum__values.html#enum_help_initiatingRecordBehavior", null ],
        [ "Automatic Rendition Status", "md_doc_81____enum__values.html#enum_help_autoRenditionStatus", null ],
        [ "Auto Rendering Error", "md_doc_81____enum__values.html#enum_help_autoRenderError", null ],
        [ "Cached Table Notification Type", "md_doc_81____enum__values.html#enum_help_cachedTableNotificationType", null ],
        [ "Agenda Item Access Control", "md_doc_81____enum__values.html#enum_help_agendaItemAccess", null ],
        [ "Gender Salutation", "md_doc_81____enum__values.html#enum_help_genderSalutation", null ],
        [ "Agenda Print Style", "md_doc_81____enum__values.html#enum_help_agendaPrintStyles", null ],
        [ "Command Refresh Type", "md_doc_81____enum__values.html#enum_help_commandRefreshTypes", null ],
        [ "Document Action", "md_doc_81____enum__values.html#enum_help_activityDocumentAction", null ],
        [ "Document Origin", "md_doc_81____enum__values.html#enum_help_activityDocumentOrigin", null ],
        [ "Document Status", "md_doc_81____enum__values.html#enum_help_activityDocumentStatus", null ],
        [ "Word Processor Merge Format", "md_doc_81____enum__values.html#enum_help_wordProcessorMergeFormats", null ],
        [ "Content Manager Path Type", "md_doc_81____enum__values.html#enum_help_trimPathType", null ],
        [ "Alert Condition Type", "md_doc_81____enum__values.html#enum_help_alertConditionTypes", null ],
        [ "Favorite Type", "md_doc_81____enum__values.html#enum_help_favoriteType", null ],
        [ "Origin Type", "md_doc_81____enum__values.html#enum_help_originType", null ],
        [ "Document Update Style", "md_doc_81____enum__values.html#enum_help_documentUpdateStyles", null ],
        [ "Email Update Style", "md_doc_81____enum__values.html#enum_help_emailUpdateStyles", null ],
        [ "Icon Display Mode", "md_doc_81____enum__values.html#enum_help_iconDisplayMode", null ],
        [ "Icon Usage Type", "md_doc_81____enum__values.html#enum_help_iconUsage", null ],
        [ "String Display Alignment", "md_doc_81____enum__values.html#enum_help_stringDisplayAlignment", null ],
        [ "Property Sort Mode", "md_doc_81____enum__values.html#enum_help_propertySortMode", null ],
        [ "Prefetch Style", "md_doc_81____enum__values.html#enum_help_prefetchStyles", null ],
        [ "Data Entry Page Type", "md_doc_81____enum__values.html#enum_help_dataEntryPageType", null ],
        [ "Search Clause Group", "md_doc_81____enum__values.html#enum_help_searchClauseGroup", null ],
        [ "Product String", "md_doc_81____enum__values.html#enum_help_productString", null ],
        [ "Action Purpose", "md_doc_81____enum__values.html#enum_help_actionPurpose", null ],
        [ "Meeting Purpose", "md_doc_81____enum__values.html#enum_help_meetingPurpose", null ],
        [ "Offline Record Purpose", "md_doc_81____enum__values.html#enum_help_offlineRecordPurpose", null ],
        [ "Saved Search Purpose", "md_doc_81____enum__values.html#enum_help_searchPurposes", null ],
        [ "Document Store Purpose", "md_doc_81____enum__values.html#enum_help_storePurposes", null ],
        [ "Special Date String", "md_doc_81____enum__values.html#enum_help_specialDates", null ],
        [ "User Label Purpose", "md_doc_81____enum__values.html#enum_help_labelPurposes", null ],
        [ "Thesaurus Term Purpose", "md_doc_81____enum__values.html#enum_help_keywordPurposes", null ],
        [ "Event Processor Status", "md_doc_81____enum__values.html#enum_help_eventProcessorStatus", null ],
        [ "Activity Purpose", "md_doc_81____enum__values.html#enum_help_activityPurposes", null ],
        [ "Authentication Method", "md_doc_81____enum__values.html#enum_help_authenticationMethod", null ],
        [ "List Item Orginator", "md_doc_81____enum__values.html#enum_help_spListItemOriginator", null ],
        [ "Managed List Item Status", "md_doc_81____enum__values.html#enum_help_spManagedItemStatus", null ],
        [ "SharePoint Element Type", "md_doc_81____enum__values.html#enum_help_spElementType", null ],
        [ "Search Time Period (Singular)", "md_doc_81____enum__values.html#enum_help_searchTimePeriodSingular", null ],
        [ "Search Time Period (Plural)", "md_doc_81____enum__values.html#enum_help_searchTimePeriodPlural", null ],
        [ "Search Time Tense", "md_doc_81____enum__values.html#enum_help_searchTimeTense", null ],
        [ "Search Grammar Item", "md_doc_81____enum__values.html#enum_help_searchGrammarItem", null ],
        [ "Search Editor", "md_doc_81____enum__values.html#enum_help_searchEditor", null ],
        [ "Reference File Application", "md_doc_81____enum__values.html#enum_help_referenceFileApplication", null ],
        [ "Font Style", "md_doc_81____enum__values.html#enum_help_fontStyle", null ],
        [ "Location Field Type", "md_doc_81____enum__values.html#enum_help_locationFieldType", null ],
        [ "Record Security Declassification Type", "md_doc_81____enum__values.html#enum_help_recordDeclassifyTypes", null ],
        [ "Search Starting Point", "md_doc_81____enum__values.html#enum_help_searchStartPoint", null ],
        [ "Reporter Font", "md_doc_81____enum__values.html#enum_help_reporterFonts", null ],
        [ "Tab Bar Style", "md_doc_81____enum__values.html#enum_help_tabBarStyle", null ],
        [ "Skin Style", "md_doc_81____enum__values.html#enum_help_skinStyle", null ],
        [ "Frame Type", "md_doc_81____enum__values.html#enum_help_windowsFrameType", null ],
        [ "Column Index Type", "md_doc_81____enum__values.html#enum_help_columnIndexType", null ],
        [ "Migration Type", "md_doc_81____enum__values.html#enum_help_migrationType", null ],
        [ "Microsoft Word File Type", "md_doc_81____enum__values.html#enum_help_wordFileTypes", null ],
        [ "Microsoft Excel File Type", "md_doc_81____enum__values.html#enum_help_excelFileTypes", null ],
        [ "Microsoft PowerPoint File Type", "md_doc_81____enum__values.html#enum_help_powerpointFileTypes", null ],
        [ "Microsoft Project File Type", "md_doc_81____enum__values.html#enum_help_projectFileTypes", null ],
        [ "Microsoft Office 2003 Word File Type", "md_doc_81____enum__values.html#enum_help_word11FileTypes", null ],
        [ "Microsoft Office 2003 Excel File Type", "md_doc_81____enum__values.html#enum_help_excel11FileTypes", null ],
        [ "Microsoft Office 2003 PowerPoint File Type", "md_doc_81____enum__values.html#enum_help_powerpoint11FileTypes", null ],
        [ "Microsoft Office 2003 Project File Type", "md_doc_81____enum__values.html#enum_help_project11FileTypes", null ],
        [ "Microsoft Open Word File Type", "md_doc_81____enum__values.html#enum_help_wordOpenFileTypes", null ],
        [ "Microsoft Open Excel File Type", "md_doc_81____enum__values.html#enum_help_excelOpenFileTypes", null ],
        [ "Microsoft Open PowerPoint File Type", "md_doc_81____enum__values.html#enum_help_powerpointOpenFileTypes", null ],
        [ "Microsoft Open Project File Type", "md_doc_81____enum__values.html#enum_help_projectOpenFileTypes", null ],
        [ "Location Import Type", "md_doc_81____enum__values.html#enum_help_locationMatchType", null ],
        [ "Path Type", "md_doc_81____enum__values.html#enum_help_pathTypes", null ],
        [ "IDOL Index Type", "md_doc_81____enum__values.html#enum_help_idolIndexType", null ],
        [ "Content Index Status", "md_doc_81____enum__values.html#enum_help_idolIndexStatus", null ],
        [ "Edit Notes Style", "md_doc_81____enum__values.html#enum_help_editNotesStyle", null ],
        [ "Document Store Status", "md_doc_81____enum__values.html#enum_help_storeStatus", null ],
        [ "File Size Unit", "md_doc_81____enum__values.html#enum_help_fileSizeUnits", null ],
        [ "Media Type", "md_doc_81____enum__values.html#enum_help_mediaTypes", null ],
        [ "Statistics Output Type", "md_doc_81____enum__values.html#enum_help_statisticsOutputType", null ],
        [ "Database Lock Type", "md_doc_81____enum__values.html#enum_help_databaseLockType", null ],
        [ "Search parameter format", "md_doc_81____enum__values.html#enum_help_searchParameterFormats", null ],
        [ "Jurisdiction Type", "md_doc_81____enum__values.html#enum_help_jurisdictionTypes", null ],
        [ "Record Creation Statistics Primary Grouping", "md_doc_81____enum__values.html#enum_help_primaryRecordStatisticsGrouping", null ],
        [ "Record Creation Statistics Location Grouping", "md_doc_81____enum__values.html#enum_help_locationGrouping", null ],
        [ "Event Statistics Group", "md_doc_81____enum__values.html#enum_help_eventStatisticsGroup", null ],
        [ "Content Manager Event Counter", "md_doc_81____enum__values.html#enum_help_trimEventCounters", null ],
        [ "Document Event Counter", "md_doc_81____enum__values.html#enum_help_documentEventCounters", null ],
        [ "Workflow Event Counter", "md_doc_81____enum__values.html#enum_help_workflowEventCounters", null ],
        [ "Audit Event Counter", "md_doc_81____enum__values.html#enum_help_auditEventCounters", null ],
        [ "Record Creation Statistics Date Range Type", "md_doc_81____enum__values.html#enum_help_statisticalDateRangeTypes", null ],
        [ "Product Feature", "md_doc_81____enum__values.html#enum_help_productFeatures", null ],
        [ "Open Document Status", "md_doc_81____enum__values.html#enum_help_openDocumentStatus", null ],
        [ "BulkLoader Document Transfer Mode", "md_doc_81____enum__values.html#enum_help_bulkLoaderCopyMode", null ],
        [ "Additional Field Access Control", "md_doc_81____enum__values.html#enum_help_fieldAccess", null ],
        [ "Duplicate Email Option", "md_doc_81____enum__values.html#enum_help_duplicateEmailOptions", null ],
        [ "License Type", "md_doc_81____enum__values.html#enum_help_licenseTypes", null ],
        [ "Feature State", "md_doc_81____enum__values.html#enum_help_featureState", null ],
        [ "User License Type", "md_doc_81____enum__values.html#enum_help_userLicenseTypes", null ],
        [ "Old Version Purge Style", "md_doc_81____enum__values.html#enum_help_oldVersionPurgeOptions", null ],
        [ "Object Capability", "md_doc_81____enum__values.html#enum_help_objectCapabilities", null ],
        [ "Content Index Search Style", "md_doc_81____enum__values.html#enum_help_idolSearchStyles", null ],
        [ "RM Grammar Item", "md_doc_81____enum__values.html#enum_help_rmGrammarItem", null ],
        [ "RM Terminology Type", "md_doc_81____enum__values.html#enum_help_rmTerminologyType", null ],
        [ "Tiered Storage Type", "md_doc_81____enum__values.html#enum_help_tieredStorageType", null ],
        [ "Request Purpose", "md_doc_81____enum__values.html#enum_help_requestPurposes", null ],
        [ "Request Type", "md_doc_81____enum__values.html#enum_help_requestTypes", null ],
        [ "Request Priority", "md_doc_81____enum__values.html#enum_help_requestPriority", null ],
        [ "Request Status", "md_doc_81____enum__values.html#enum_help_requestStatus", null ],
        [ "SQL Error Type", "md_doc_81____enum__values.html#enum_help_sqlErrorTypes", null ],
        [ "Retain Option", "md_doc_81____enum__values.html#enum_help_retainOptions", null ],
        [ "Disposal Type", "md_doc_81____enum__values.html#enum_help_disposalType", null ],
        [ "Disposition Calculation Status", "md_doc_81____enum__values.html#enum_help_disposalScheduleStatus", null ],
        [ "Interest Type", "md_doc_81____enum__values.html#enum_help_clientMatterInterestTypes", null ],
        [ "Consignment Item Status", "md_doc_81____enum__values.html#enum_help_consignmentItemApprovalStatus", null ],
        [ "Consignment Issue Type", "md_doc_81____enum__values.html#enum_help_consignmentItemIssueType", null ],
        [ "Consignent Picklist Format", "md_doc_81____enum__values.html#enum_help_consignmentPickListFormat", null ],
        [ "Consignment Disposal Type", "md_doc_81____enum__values.html#enum_help_consignmentDisposalType", null ],
        [ "Additional Field Purpose Type", "md_doc_81____enum__values.html#enum_help_fieldPurposeType", null ],
        [ "Unregistered User Option", "md_doc_81____enum__values.html#enum_help_unregisteredUsers", null ],
        [ "Mail Format", "md_doc_81____enum__values.html#enum_help_mailFormat", null ],
        [ "Lookup Item Purpose Type", "md_doc_81____enum__values.html#enum_help_lookupItemPurposeType", null ],
        [ "Client Server Protocol", "md_doc_81____enum__values.html#enum_help_clientServerProtocol", null ],
        [ "Connection Type", "md_doc_81____enum__values.html#enum_help_ipConnectionType", null ],
        [ "Startup Pane Type", "md_doc_81____enum__values.html#enum_help_startupPaneType", null ],
        [ "Jurisdiction Purpose", "md_doc_81____enum__values.html#enum_help_jurisdictionPurposes", null ],
        [ "OAuth Implementation Type", "md_doc_81____enum__values.html#enum_help_oauthImplementationType", null ],
        [ "Client Authentication Mechanism", "md_doc_81____enum__values.html#enum_help_clientAuthenticationMechanism", null ],
        [ "Frame Appearance", "md_doc_81____enum__values.html#enum_help_frameAppearance", null ],
        [ "Physical Inactive Record Selection Date Type", "md_doc_81____enum__values.html#enum_help_psoDateType", null ],
        [ "Electronic Inactive Record Selection Date Type", "md_doc_81____enum__values.html#enum_help_esoDateType", null ],
        [ "Date Search Type", "md_doc_81____enum__values.html#enum_help_dateSearchType", null ],
        [ "Geography Distance Unit", "md_doc_81____enum__values.html#enum_help_geographyDistanceUnit", null ],
        [ "Geography Search Type", "md_doc_81____enum__values.html#enum_help_geographySearchType", null ],
        [ "Check In Place Type", "md_doc_81____enum__values.html#enum_help_checkinPlaceTypes", null ],
        [ "Authorization Method", "md_doc_81____enum__values.html#enum_help_authorizationMethods", null ],
        [ "Location Access Control", "md_doc_81____enum__values.html#enum_help_locationAccess", null ],
        [ "Document Review State", "md_doc_81____enum__values.html#enum_help_documentReviewStates", null ],
        [ "Encryption Algorithm", "md_doc_81____enum__values.html#enum_help_encryptionAlgorithm", null ],
        [ "Label Position Change Type", "md_doc_81____enum__values.html#enum_help_labelPositionChange", null ],
        [ "ContainmentRule", "md_doc_81____enum__values.html#enum_help_containmentRule", null ],
        [ "Double Click Style", "md_doc_81____enum__values.html#enum_help_dblClickStyle", null ],
        [ "Double Click Container Style", "md_doc_81____enum__values.html#enum_help_dblClickContainerStyle", null ],
        [ "Mail Folder Type", "md_doc_81____enum__values.html#enum_help_mailFolderTypes", null ],
        [ "LDAP Attribute Matching Type", "md_doc_81____enum__values.html#enum_help_ldapMatchingType", null ],
        [ "LDAP Search Scope", "md_doc_81____enum__values.html#enum_help_ldapSearchScope", null ],
        [ "LDAP Authentication Method", "md_doc_81____enum__values.html#enum_help_ldapAuthMethod", null ],
        [ "Schedule Usage Purpose", "md_doc_81____enum__values.html#enum_help_schedulePurposes", null ],
        [ "Trigger Delay Type", "md_doc_81____enum__values.html#enum_help_triggerDelayTypes", null ],
        [ "Cusp Date Display Type", "md_doc_81____enum__values.html#enum_help_cuspDateDisplayType", null ],
        [ "Log Level", "md_doc_81____enum__values.html#enum_help_logLevels", null ],
        [ "Output Path Type", "md_doc_81____enum__values.html#enum_help_outputPathTypes", null ],
        [ "Lookup Item Display Style", "md_doc_81____enum__values.html#enum_help_lookupItemFieldStyle", null ],
        [ "Check In Style/Place Purpose", "md_doc_81____enum__values.html#enum_help_checkinToolPurposes", null ],
        [ "Generic Permission", "md_doc_81____enum__values.html#enum_help_genericPermissions", null ],
        [ "Checkout Style", "md_doc_81____enum__values.html#enum_help_checkOutStyles", null ],
        [ "SSL Mode", "md_doc_81____enum__values.html#enum_help_sslMode", null ],
        [ "Mail Persistence Style", "md_doc_81____enum__values.html#enum_help_mailPersistence", null ],
        [ "Consignment State", "md_doc_81____enum__values.html#enum_help_consignmentState", null ],
        [ "View Pane Style", "md_doc_81____enum__values.html#enum_help_viewPaneStyle", null ],
        [ "Auto Render Select Option", "md_doc_81____enum__values.html#enum_help_autoRenderSelectOption", null ],
        [ "Document Store Integrity Check Counter Type", "md_doc_81____enum__values.html#enum_help_documentStoreIntegrityCheckCounter", null ],
        [ "Content Engine Type", "md_doc_81____enum__values.html#enum_help_contentEngineType", null ],
        [ "Asynchronous Task Status", "md_doc_81____enum__values.html#enum_help_asynchTaskStatus", null ],
        [ "Active Audit Event", "md_doc_81____enum__values.html#enum_help_historyPurposes", null ],
        [ "Access Control Custom Add Menu Item", "md_doc_81____enum__values.html#enum_help_aclMenuItems", null ],
        [ "Activity Access Control", "md_doc_81____enum__values.html#enum_help_activityAccess", null ],
        [ "String Verification Type", "md_doc_81____enum__values.html#enum_help_stringVerificationTypes", null ],
        [ "Address History Option", "md_doc_81____enum__values.html#enum_help_addressHistoryOption", null ],
        [ "Web Service Cache Setting", "md_doc_81____enum__values.html#enum_help_webServiceCacheSettings", null ],
        [ "Event Occurrence Type", "md_doc_81____enum__values.html#enum_help_occurrenceTypes", null ],
        [ "Result Post Processing Methods", "md_doc_81____enum__values.html#enum_help_resultPostProcessingMethod", null ],
        [ "External Workflow Type Purpose", "md_doc_81____enum__values.html#enum_help_externalWorkflowTypePurposes", null ],
        [ "To Do Item Access Control", "md_doc_81____enum__values.html#enum_help_todoItemAccess", null ],
        [ "Diagnostic Logging Category", "md_doc_81____enum__values.html#enum_help_loggingCategories", null ],
        [ "User Dashboard Item", "md_doc_81____enum__values.html#enum_help_userDashboardItem", null ],
        [ "Document Auto Profiling Title Option", "md_doc_81____enum__values.html#enum_help_autoProfilingTitleOptions", null ],
        [ "User Label Access Control", "md_doc_81____enum__values.html#enum_help_labelAccess", null ],
        [ "Office Integration Menu Caption", "md_doc_81____enum__values.html#enum_help_officeIntegrationMenuCaptions", null ],
        [ "Set Author Option", "md_doc_81____enum__values.html#enum_help_setAuthorOptions", null ],
        [ "Recycle Reason", "md_doc_81____enum__values.html#enum_help_recycleReasons", null ],
        [ "External Link Type", "md_doc_81____enum__values.html#enum_help_externalLinkType", null ],
        [ "Date Aggregation Type", "md_doc_81____enum__values.html#enum_help_dateAggregationType", null ],
        [ "Aggrehation Sort Order", "md_doc_81____enum__values.html#enum_help_aggregationSortOrder", null ],
        [ "External Link Special Parameter", "md_doc_81____enum__values.html#enum_help_externalLinkSpecialParameters", null ],
        [ "Copy Relationship", "md_doc_81____enum__values.html#enum_help_copyRelationship", null ],
        [ "Explorer Top Level Category", "md_doc_81____enum__values.html#enum_help_explorerCategory", null ],
        [ "Icon Size", "md_doc_81____enum__values.html#enum_help_iconSizes", null ],
        [ "Stored Procedure", "md_doc_81____enum__values.html#enum_help_storedProcedures", null ],
        [ "Stored Function", "md_doc_81____enum__values.html#enum_help_storedFunctions", null ],
        [ "Dots per Inch", "md_doc_81____enum__values.html#enum_help_dotsPerInch", null ],
        [ "Content Index Document Status", "md_doc_81____enum__values.html#enum_help_contentIndexDocumentStatus", null ],
        [ "Document Edit Status", "md_doc_81____enum__values.html#enum_help_documentEditStatus", null ],
        [ "Hold Access Control", "md_doc_81____enum__values.html#enum_help_holdAccess", null ],
        [ "TRIM Object", "md_doc_81____enum__values.html#enum_help_baseObjectTypes", null ],
        [ "Selector", "md_doc_81____enum__values.html#enum_help_selectors", null ],
        [ "Enumeration", "md_doc_81____enum__values.html#enum_help_enumerations", null ],
        [ "Command", "md_doc_81____enum__values.html#enum_help_commandIds", null ],
        [ "User Permission", "md_doc_81____enum__values.html#enum_help_userPermissions", null ],
        [ "Permission Group", "md_doc_81____enum__values.html#enum_help_permissionGroups", null ],
        [ "Property", "md_doc_81____enum__values.html#enum_help_propertyIds", null ],
        [ "Icon", "md_doc_81____enum__values.html#enum_help_icons", null ],
        [ "Search Clause", "md_doc_81____enum__values.html#enum_help_searchClauseIds", null ],
        [ "User Option Set", "md_doc_81____enum__values.html#enum_help_userOptionSetIds", null ],
        [ "Menu", "md_doc_81____enum__values.html#enum_help_menuIds", null ],
        [ "Menu Item", "md_doc_81____enum__values.html#enum_help_menuItemIds", null ],
        [ "Menu Popup", "md_doc_81____enum__values.html#enum_help_menuPopupIds", null ]
      ] ]
    ] ],
    [ "82 - Object Purposes", "md_doc_82____object__purposes.html", [
      [ "Using object purposes", "md_doc_82____object__purposes.html#object_purposes", [
        [ "About", "md_doc_82____object__purposes.html#object_purposes_about", null ],
        [ "Warning", "md_doc_82____object__purposes.html#object_purposes_warning", null ],
        [ "Extra information", "md_doc_82____object__purposes.html#object_purposes_extra", null ],
        [ "Purpose metadata", "md_doc_82____object__purposes.html#object_purposes_metadata", [
          [ "Code sample - searching", "md_doc_82____object__purposes.html#autotoc_md108", null ],
          [ "Code sample - post search", "md_doc_82____object__purposes.html#autotoc_md109", null ],
          [ "Code sample - object definition", "md_doc_82____object__purposes.html#autotoc_md110", null ]
        ] ]
      ] ],
      [ "List of objects with related purpose enum", "md_doc_82____object__purposes.html#object_with_purpose_enum", [
        [ "TRIM.SDK.ActionDef", "md_doc_82____object__purposes.html#purpose_enum_ActionDef", null ],
        [ "TRIM.SDK.Activity", "md_doc_82____object__purposes.html#purpose_enum_Activity", null ],
        [ "TRIM.SDK.AgendaItem", "md_doc_82____object__purposes.html#purpose_enum_AgendaItem", null ],
        [ "TRIM.SDK.AgendaItemType", "md_doc_82____object__purposes.html#purpose_enum_AgendaItemType", null ],
        [ "TRIM.SDK.AutoPartRule", "md_doc_82____object__purposes.html#purpose_enum_AutoPartRule", null ],
        [ "TRIM.SDK.CheckinPlace", "md_doc_82____object__purposes.html#purpose_enum_CheckinPlace", null ],
        [ "TRIM.SDK.CheckinStyle", "md_doc_82____object__purposes.html#purpose_enum_CheckinStyle", null ],
        [ "TRIM.SDK.Classification", "md_doc_82____object__purposes.html#purpose_enum_Classification", null ],
        [ "TRIM.SDK.DocumentQueue", "md_doc_82____object__purposes.html#purpose_enum_DocumentQueue", null ],
        [ "TRIM.SDK.ElectronicStore", "md_doc_82____object__purposes.html#purpose_enum_ElectronicStore", null ],
        [ "TRIM.SDK.ExternalLink", "md_doc_82____object__purposes.html#purpose_enum_ExternalLink", null ],
        [ "TRIM.SDK.ExternalWorkflowType", "md_doc_82____object__purposes.html#purpose_enum_ExternalWorkflowType", null ],
        [ "TRIM.SDK.FieldDefinition", "md_doc_82____object__purposes.html#purpose_enum_FieldDefinition", null ],
        [ "TRIM.SDK.History", "md_doc_82____object__purposes.html#purpose_enum_History", null ],
        [ "TRIM.SDK.Hold", "md_doc_82____object__purposes.html#purpose_enum_Hold", null ],
        [ "TRIM.SDK.HtmlLayout", "md_doc_82____object__purposes.html#purpose_enum_HtmlLayout", null ],
        [ "TRIM.SDK.Jurisdiction", "md_doc_82____object__purposes.html#purpose_enum_Jurisdiction", null ],
        [ "TRIM.SDK.Keyword", "md_doc_82____object__purposes.html#purpose_enum_Keyword", null ],
        [ "TRIM.SDK.Location", "md_doc_82____object__purposes.html#purpose_enum_Location", null ],
        [ "TRIM.SDK.LookupItem", "md_doc_82____object__purposes.html#purpose_enum_LookupItem", null ],
        [ "TRIM.SDK.LookupSet", "md_doc_82____object__purposes.html#purpose_enum_LookupSet", null ],
        [ "TRIM.SDK.Meeting", "md_doc_82____object__purposes.html#purpose_enum_Meeting", null ],
        [ "TRIM.SDK.MeetingType", "md_doc_82____object__purposes.html#purpose_enum_MeetingType", null ],
        [ "TRIM.SDK.MinuteItemType", "md_doc_82____object__purposes.html#purpose_enum_MinuteItemType", null ],
        [ "TRIM.SDK.OfflineRecord", "md_doc_82____object__purposes.html#purpose_enum_OfflineRecord", null ],
        [ "TRIM.SDK.Origin", "md_doc_82____object__purposes.html#purpose_enum_Origin", null ],
        [ "TRIM.SDK.Record", "md_doc_82____object__purposes.html#purpose_enum_Record", null ],
        [ "TRIM.SDK.RecordType", "md_doc_82____object__purposes.html#purpose_enum_RecordType", null ],
        [ "TRIM.SDK.Report", "md_doc_82____object__purposes.html#purpose_enum_Report", null ],
        [ "TRIM.SDK.Request", "md_doc_82____object__purposes.html#purpose_enum_Request", null ],
        [ "TRIM.SDK.SavedSearch", "md_doc_82____object__purposes.html#purpose_enum_SavedSearch", null ],
        [ "TRIM.SDK.Schedule", "md_doc_82____object__purposes.html#purpose_enum_Schedule", null ],
        [ "TRIM.SDK.ScheduledTask", "md_doc_82____object__purposes.html#purpose_enum_ScheduledTask", null ],
        [ "TRIM.SDK.SearchForm", "md_doc_82____object__purposes.html#purpose_enum_SearchForm", null ],
        [ "TRIM.SDK.SecurityCaveat", "md_doc_82____object__purposes.html#purpose_enum_SecurityCaveat", null ],
        [ "TRIM.SDK.SecurityGuide", "md_doc_82____object__purposes.html#purpose_enum_SecurityGuide", null ],
        [ "TRIM.SDK.SecurityLevel", "md_doc_82____object__purposes.html#purpose_enum_SecurityLevel", null ],
        [ "TRIM.SDK.Space", "md_doc_82____object__purposes.html#purpose_enum_Space", null ],
        [ "TRIM.SDK.TodoItem", "md_doc_82____object__purposes.html#purpose_enum_TodoItem", null ],
        [ "TRIM.SDK.UserLabel", "md_doc_82____object__purposes.html#purpose_enum_UserLabel", null ],
        [ "TRIM.SDK.Workflow", "md_doc_82____object__purposes.html#purpose_enum_Workflow", null ],
        [ "TRIM.SDK.WorkflowTemplate", "md_doc_82____object__purposes.html#purpose_enum_WorkflowTemplate", null ],
        [ "TRIM.SDK.WorkingCopy", "md_doc_82____object__purposes.html#purpose_enum_WorkingCopy", null ]
      ] ]
    ] ],
    [ "83 - PropertyDefinitions", "md_doc_83____property_definitions.html", [
      [ "Using Property Definitions", "md_doc_83____property_definitions.html#property_definitions_using", null ],
      [ "List of property definitions by object type", "md_doc_83____property_definitions.html#property_definitions_by_object_type", [
        [ "ActionDef", "md_doc_83____property_definitions.html#property_definitions_ActionDef", null ],
        [ "Activity", "md_doc_83____property_definitions.html#property_definitions_Activity", null ],
        [ "AgendaItem", "md_doc_83____property_definitions.html#property_definitions_AgendaItem", null ],
        [ "AgendaItemType", "md_doc_83____property_definitions.html#property_definitions_AgendaItemType", null ],
        [ "Alert", "md_doc_83____property_definitions.html#property_definitions_Alert", null ],
        [ "ArchiveEvent", "md_doc_83____property_definitions.html#property_definitions_ArchiveEvent", null ],
        [ "AutoPartRule", "md_doc_83____property_definitions.html#property_definitions_AutoPartRule", null ],
        [ "Census", "md_doc_83____property_definitions.html#property_definitions_Census", null ],
        [ "CheckinStyle", "md_doc_83____property_definitions.html#property_definitions_CheckinStyle", null ],
        [ "Classification", "md_doc_83____property_definitions.html#property_definitions_Classification", null ],
        [ "Communication", "md_doc_83____property_definitions.html#property_definitions_Communication", null ],
        [ "Consignment", "md_doc_83____property_definitions.html#property_definitions_Consignment", null ],
        [ "ConsignmentApprover", "md_doc_83____property_definitions.html#property_definitions_ConsignmentApprover", null ],
        [ "ConsignmentIssue", "md_doc_83____property_definitions.html#property_definitions_ConsignmentIssue", null ],
        [ "ConsignmentRejection", "md_doc_83____property_definitions.html#property_definitions_ConsignmentRejection", null ],
        [ "DocumentQueue", "md_doc_83____property_definitions.html#property_definitions_DocumentQueue", null ],
        [ "ElectronicStore", "md_doc_83____property_definitions.html#property_definitions_ElectronicStore", null ],
        [ "ExternalIcon", "md_doc_83____property_definitions.html#property_definitions_ExternalIcon", null ],
        [ "ExternalLink", "md_doc_83____property_definitions.html#property_definitions_ExternalLink", null ],
        [ "ExternalWorkflow", "md_doc_83____property_definitions.html#property_definitions_ExternalWorkflow", null ],
        [ "ExternalWorkflowTask", "md_doc_83____property_definitions.html#property_definitions_ExternalWorkflowTask", null ],
        [ "ExternalWorkflowType", "md_doc_83____property_definitions.html#property_definitions_ExternalWorkflowType", null ],
        [ "FieldDefinition", "md_doc_83____property_definitions.html#property_definitions_FieldDefinition", null ],
        [ "History", "md_doc_83____property_definitions.html#property_definitions_History", null ],
        [ "Hold", "md_doc_83____property_definitions.html#property_definitions_Hold", null ],
        [ "HtmlLayout", "md_doc_83____property_definitions.html#property_definitions_HtmlLayout", null ],
        [ "Jurisdiction", "md_doc_83____property_definitions.html#property_definitions_Jurisdiction", null ],
        [ "Keyword", "md_doc_83____property_definitions.html#property_definitions_Keyword", null ],
        [ "Location", "md_doc_83____property_definitions.html#property_definitions_Location", null ],
        [ "LookupSet", "md_doc_83____property_definitions.html#property_definitions_LookupSet", null ],
        [ "MailTemplate", "md_doc_83____property_definitions.html#property_definitions_MailTemplate", null ],
        [ "Meeting", "md_doc_83____property_definitions.html#property_definitions_Meeting", null ],
        [ "MeetingType", "md_doc_83____property_definitions.html#property_definitions_MeetingType", null ],
        [ "MetadataRule", "md_doc_83____property_definitions.html#property_definitions_MetadataRule", null ],
        [ "MinuteItem", "md_doc_83____property_definitions.html#property_definitions_MinuteItem", null ],
        [ "MinuteItemType", "md_doc_83____property_definitions.html#property_definitions_MinuteItemType", null ],
        [ "OfflineRecord", "md_doc_83____property_definitions.html#property_definitions_OfflineRecord", null ],
        [ "Origin", "md_doc_83____property_definitions.html#property_definitions_Origin", null ],
        [ "OriginHistory", "md_doc_83____property_definitions.html#property_definitions_OriginHistory", null ],
        [ "Record", "md_doc_83____property_definitions.html#property_definitions_Record", null ],
        [ "RecordAction", "md_doc_83____property_definitions.html#property_definitions_RecordAction", null ],
        [ "RecordType", "md_doc_83____property_definitions.html#property_definitions_RecordType", null ],
        [ "Report", "md_doc_83____property_definitions.html#property_definitions_Report", null ],
        [ "ReportBitmap", "md_doc_83____property_definitions.html#property_definitions_ReportBitmap", null ],
        [ "Request", "md_doc_83____property_definitions.html#property_definitions_Request", null ],
        [ "SavedSearch", "md_doc_83____property_definitions.html#property_definitions_SavedSearch", null ],
        [ "Schedule", "md_doc_83____property_definitions.html#property_definitions_Schedule", null ],
        [ "ScheduledTask", "md_doc_83____property_definitions.html#property_definitions_ScheduledTask", null ],
        [ "SearchForm", "md_doc_83____property_definitions.html#property_definitions_SearchForm", null ],
        [ "SecurityCaveat", "md_doc_83____property_definitions.html#property_definitions_SecurityCaveat", null ],
        [ "SecurityLevel", "md_doc_83____property_definitions.html#property_definitions_SecurityLevel", null ],
        [ "SharePointItem", "md_doc_83____property_definitions.html#property_definitions_SharePointItem", null ],
        [ "Space", "md_doc_83____property_definitions.html#property_definitions_Space", null ],
        [ "StopWord", "md_doc_83____property_definitions.html#property_definitions_StopWord", null ],
        [ "TodoItem", "md_doc_83____property_definitions.html#property_definitions_TodoItem", null ],
        [ "UserLabel", "md_doc_83____property_definitions.html#property_definitions_UserLabel", null ],
        [ "Word", "md_doc_83____property_definitions.html#property_definitions_Word", null ],
        [ "Workflow", "md_doc_83____property_definitions.html#property_definitions_Workflow", null ],
        [ "WorkflowTemplate", "md_doc_83____property_definitions.html#property_definitions_WorkflowTemplate", null ],
        [ "ZipCode", "md_doc_83____property_definitions.html#property_definitions_ZipCode", null ]
      ] ]
    ] ],
    [ "Advanced Topics", "advanced_topics.html", [
      [ "Different ways to fetch a TrimMainObject", "advanced_topics.html#ways_To_Fetch_a_TrimMainObject", [
        [ "Object constructor by Name", "advanced_topics.html#fetch_by_constructorand_name", [
          [ "Code example", "advanced_topics.html#autotoc_md111", null ]
        ] ],
        [ "Object name properties", "advanced_topics.html#object_name_properties", null ],
        [ "Database find methods", "advanced_topics.html#fetch_by_database", [
          [ "Code samples", "advanced_topics.html#autotoc_md112", null ]
        ] ],
        [ "TrimMainObjectSearch", "advanced_topics.html#fetch_by_search", [
          [ "Code sample", "advanced_topics.html#autotoc_md113", null ]
        ] ]
      ] ],
      [ "Document access alternatives", "advanced_topics.html#fetchDoc", [
        [ "Overview", "advanced_topics.html#doc_access_overview", null ],
        [ "Record.GetDocument()", "advanced_topics.html#getDoc", [
          [ "Checkout without getting the document", "advanced_topics.html#autotoc_md115", null ]
        ] ],
        [ "DocumentPathInClientCache", "advanced_topics.html#clientCache", [
          [ "Example", "advanced_topics.html#autotoc_md116", null ]
        ] ],
        [ "DocumentPathInWGSCache", "advanced_topics.html#wgsCache", [
          [ "Example", "advanced_topics.html#autotoc_md117", null ]
        ] ],
        [ "DownloadNotifier", "advanced_topics.html#downloadNotifier", [
          [ "Example", "advanced_topics.html#autotoc_md118", null ]
        ] ],
        [ "Other object types", "advanced_topics.html#dowload_other_object_types", null ]
      ] ],
      [ "Localised strings", "advanced_topics.html#localisedStrings", [
        [ "TrimMessages", "advanced_topics.html#trimMEssages", [
          [ "Code Sample", "advanced_topics.html#autotoc_md119", null ]
        ] ],
        [ "Captions", "advanced_topics.html#objectCaptions", [
          [ "Enum captions", "advanced_topics.html#enumCaptions", null ],
          [ "Property Captions", "advanced_topics.html#propertyCaptions", null ],
          [ "Search Clause Captions", "advanced_topics.html#searchClauseCaptions", null ],
          [ "Menu items", "advanced_topics.html#menuItemCaptions", null ]
        ] ],
        [ "FormDefinition", "advanced_topics.html#formDefinitionCaptions", null ]
      ] ],
      [ "Fetching LookupSet Items", "advanced_topics.html#lookupset_Items", [
        [ "Example: Adding a new LookupItem", "advanced_topics.html#new_lookupitem", null ],
        [ "Example: Fetching lookup items", "advanced_topics.html#fetching_lookup_items", null ]
      ] ],
      [ "Create a Record using manual numbering", "advanced_topics.html#create_record_manual_number", [
        [ "Example: Manual Record Number", "advanced_topics.html#example_manual_record_number", null ]
      ] ]
    ] ],
    [ "Packages", "namespaces.html", [
      [ "Packages", "namespaces.html", "namespaces_dup" ],
      [ "Package Functions", "namespacemembers.html", [
        [ "All", "namespacemembers.html", "namespacemembers_dup" ],
        [ "Enumerations", "namespacemembers_enum.html", "namespacemembers_enum" ]
      ] ]
    ] ],
    [ "Classes", "annotated.html", [
      [ "Class List", "annotated.html", "annotated_dup" ],
      [ "Class Index", "classes.html", null ],
      [ "Class Hierarchy", "hierarchy.html", "hierarchy" ],
      [ "Class Members", "functions.html", [
        [ "All", "functions.html", "functions_dup" ],
        [ "Functions", "functions_func.html", "functions_func" ],
        [ "Variables", "functions_vars.html", null ],
        [ "Enumerations", "functions_enum.html", null ],
        [ "Properties", "functions_prop.html", "functions_prop" ],
        [ "Events", "functions_evnt.html", null ]
      ] ]
    ] ]
  ] ]
];

var NAVTREEINDEX =
[
"advanced_topics.html",
"class_t_r_i_m_1_1_s_d_k_1_1_agenda_item.html#a25748f807fd9a9d51bd2509573433b57",
"class_t_r_i_m_1_1_s_d_k_1_1_census.html",
"class_t_r_i_m_1_1_s_d_k_1_1_communication.html#a22c206c21468434c582bc1a5f693f91f",
"class_t_r_i_m_1_1_s_d_k_1_1_database.html#a22379c99976db31384a637220f35aec8",
"class_t_r_i_m_1_1_s_d_k_1_1_database.html#aff121ba0fa0ce077713f2db31a25a10e",
"class_t_r_i_m_1_1_s_d_k_1_1_email_attachment_list_1_1_email_attachment_list_enumerator.html#ae7eaf85a98fa2e3655a345e0f9687977",
"class_t_r_i_m_1_1_s_d_k_1_1_explorer_category_list.html#a443050a04d857dcf2df837950342b35d",
"class_t_r_i_m_1_1_s_d_k_1_1_field_definition.html#a86d93bc21cbf03834a3979b30cede794",
"class_t_r_i_m_1_1_s_d_k_1_1_int_list.html#a43657bb0f7faaddc33a2792e74589dae",
"class_t_r_i_m_1_1_s_d_k_1_1_location_e_address.html#a28a34f4a7a887c9bc04b133b0efabf86",
"class_t_r_i_m_1_1_s_d_k_1_1_meeting_type_usual_participant.html",
"class_t_r_i_m_1_1_s_d_k_1_1_offline_record.html#aad48888bb2ffa18ab6bca8c3ec0fb8bd",
"class_t_r_i_m_1_1_s_d_k_1_1_property_def.html#a9f9f32baddf0fd042f9e0a3e3b7f1217",
"class_t_r_i_m_1_1_s_d_k_1_1_record.html#a1237d8ad0668097d174316b15ec18d3a",
"class_t_r_i_m_1_1_s_d_k_1_1_record.html#abe999e3469011291f6d89f0b1fa89f77",
"class_t_r_i_m_1_1_s_d_k_1_1_record_location.html#a992b45a7cbc3faad78f5320736b10618",
"class_t_r_i_m_1_1_s_d_k_1_1_record_type.html#abd08f0eafdd21d9a072c8b389ccd1602",
"class_t_r_i_m_1_1_s_d_k_1_1_schedule.html#af731112012d455955fb41c18eda30f84",
"class_t_r_i_m_1_1_s_d_k_1_1_security_caveat.html#aacfda41dcfd21f54ee1ce6de8b7dbd95",
"class_t_r_i_m_1_1_s_d_k_1_1_string_array.html#ad9dfa2dc80db77e7a53e1301b637a33b",
"class_t_r_i_m_1_1_s_d_k_1_1_trim_decimal.html#a7ffe82a8c56562e73a37849268b85425",
"class_t_r_i_m_1_1_s_d_k_1_1_trim_object.html",
"class_t_r_i_m_1_1_s_d_k_1_1_trim_search_sort_item_list.html#a2f017482b88d06395062d4efecaba56c",
"class_t_r_i_m_1_1_s_d_k_1_1_wgs_progress_info.html#aea608badc916fed444bd70601cd7b589",
"functions_prop_t.html",
"md_doc_81____enum__values.html#enum_help_flowControl",
"md_doc_82____object__purposes.html#purpose_enum_LookupSet",
"namespace_t_r_i_m_1_1_s_d_k.html#a0193b3b41a16f67d107228cdc4c92739a414aefea2b4fa2088d3cabf37085d9cb",
"namespace_t_r_i_m_1_1_s_d_k.html#a0193b3b41a16f67d107228cdc4c92739aa5d083fbfc0611e061663c6b1a8ba698",
"namespace_t_r_i_m_1_1_s_d_k.html#a031782eb82c1e9cd50c82f5b084d220ca9b35d8e469cdf1e2758bee4bb5b6c688",
"namespace_t_r_i_m_1_1_s_d_k.html#a0b80f9fdea05af3e131e46d75356a3e9a01cd47f19cbca3337e2f0864d20544c8",
"namespace_t_r_i_m_1_1_s_d_k.html#a250004fa9447b2e9be3ec5ed162797d9aaae7ae5a32b8d93730f9d40e7521dddf",
"namespace_t_r_i_m_1_1_s_d_k.html#a28c22b416faea10d468bcbecf632f5bfaf1cb45f64cdd7b55480ba6aeecd7b797",
"namespace_t_r_i_m_1_1_s_d_k.html#a31ded3d6d6a5f0da1c339bbbc315ebe5",
"namespace_t_r_i_m_1_1_s_d_k.html#a4ce4ddb7bc7d42f3f7e6d6036227f088a0c1128ab69a0ff0bef2ddc67511cc335",
"namespace_t_r_i_m_1_1_s_d_k.html#a5757f13ac388303e8800e7ab966b6dbca7ebb16f8b6edc45fffd1a269f6b195b6",
"namespace_t_r_i_m_1_1_s_d_k.html#a5d3ef5f1ed54efc1530ce7ba740c6cefad0cabebca734e548e1157781d345f175",
"namespace_t_r_i_m_1_1_s_d_k.html#a6eba73adf8ba51648df67e5a36555640aca16b7f51ce289a1bdbe45ced8269fbc",
"namespace_t_r_i_m_1_1_s_d_k.html#a753711ce2302f9a98b7fbca2c79cb33ba3c3cff250ad83d6b58452e9ff2d0ecb2",
"namespace_t_r_i_m_1_1_s_d_k.html#a753711ce2302f9a98b7fbca2c79cb33ba847f28d2e5ae1f69e7f54a680ba5093e",
"namespace_t_r_i_m_1_1_s_d_k.html#a753711ce2302f9a98b7fbca2c79cb33bad18b2b6223a69115e7b151531a752195",
"namespace_t_r_i_m_1_1_s_d_k.html#a80075e201f548155a19687920e5fab90a97f02f6993b93732b0d39dfe00466949",
"namespace_t_r_i_m_1_1_s_d_k.html#a8365d4848a1d591c9d414bdcdf180d3fa90aeadd86278dc855eeefa6ca6b3f8ab",
"namespace_t_r_i_m_1_1_s_d_k.html#a90bc95d3bbf3ce32d3d9cfa8de57a996af2a6c498fb90ee345d997f888fce3b18",
"namespace_t_r_i_m_1_1_s_d_k.html#ab501d942ef889bd8572cb84e2a21b31dab3eb4c5e3b5f619dcf8c953e5736c5d2",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a067be604fdfcd1c1e75b09a80fd73a01",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a2095d18539220ceb4183ca786d7b7f9f",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a3c5edfd22f799a844ecdfc77f3061fd3",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a577e76644e223872e556331b3f6052c1",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a725e0ddfa28f23c9d81e8b061623e7a6",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a8f39eefc8fda4fbd3ca3e8643e417218",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394aaa00eb1e73705d19d6d6969b69d4704d",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394ac718337c3d3c813c1d74871890d53124",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394ae47105dee2310d945c8287e919b0a601",
"namespace_t_r_i_m_1_1_s_d_k.html#ac9e3688e6b71318aa3d4e99d05a33a55a5c9335b28e6277ddbe0137f04e5e58a7",
"namespace_t_r_i_m_1_1_s_d_k.html#ae315246c5a824c057bef0916da90d47aaf0bfb289e820988a0d3e577bed6156a8",
"namespace_t_r_i_m_1_1_s_d_k.html#af581c0cccd0e9e3ac08e9945df4d7db5a4c799722f9711a5f34431e6d4995d242",
"programming_guide.html#updating_properties"
];

var SYNCONMSG = 'click to disable panel synchronisation';
var SYNCOFFMSG = 'click to enable panel synchronisation';