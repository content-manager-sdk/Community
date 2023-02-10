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
  [ "Micro Focus Content Manager SDK 10.1", "index.html", [
    [ "Welcome to the Content Manager SDK Documentation", "md_doc_00___index.html", [
      [ "Overview", "md_doc_00___index.html#autotoc_md1", null ],
      [ "Important", "md_doc_00___index.html#autotoc_md2", null ],
      [ "Older Versions", "md_doc_00___index.html#autotoc_md3", null ],
      [ "More Help", "md_doc_00___index.html#autotoc_md4", null ]
    ] ],
    [ "Supporting Information", "md_doc_02____legal.html", [
      [ "Legal Notices", "md_doc_02____legal.html#legal", [
        [ "Trademark notices", "md_doc_02____legal.html#trademark", null ],
        [ "Copyright Notice", "md_doc_02____legal.html#copyright", null ]
      ] ],
      [ "Support", "md_doc_02____legal.html#support", null ]
    ] ],
    [ "Release Notes", "release_notes.html", [
      [ "Content Manager 10.1", "release_notes.html#rn_101", [
        [ "IMPORTANT - Revision count performance", "release_notes.html#autotoc_md6", null ],
        [ "Improve timing of date registered/ date last updated to more closely match real time record creation", "release_notes.html#rn_10_CR_567033", null ],
        [ "CM Enterprise Studio - Update or change CM Workgroup server HTTPS certificate via command", "release_notes.html#rn_10_CR_563022", null ],
        [ "Cannot make a container inactive even though all the contents are inactive", "release_notes.html#rn_10_CR_567015", null ],
        [ "Content Manager SDK assembly and namespace renamed", "release_notes.html#rn_101_FileTypeOptions", null ]
      ] ],
      [ "Content Manager 10.0", "release_notes.html#rn_100", [
        [ "Content Manager SDK assembly and namespace renamed", "release_notes.html#rn_10_SdkRename", null ],
        [ "Deleted methods and properties:", "release_notes.html#autotoc_md7", null ],
        [ "Get the field definition for this word", "release_notes.html#autotoc_md8", null ],
        [ "Create External Link from SDK", "release_notes.html#autotoc_md9", null ],
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
          [ "Example", "release_notes.html#autotoc_md10", null ]
        ] ],
        [ "Indicator on a record when Notes have been added", "release_notes.html#rn_10_CR_384012", null ],
        [ "Provide a version of TransferStorage just for older revisions", "release_notes.html#rn_10_CR_335066", null ],
        [ "New DocumentStoreIncrementalCheckTask", "release_notes.html#rn_10_CR_373041", null ],
        [ "Changes to Consignment processing", "release_notes.html#rn_10_CR_387008", null ],
        [ "Unknown Location type validation", "release_notes.html#autotoc_md11", null ],
        [ "Display Child lists in the .Net SDK", "release_notes.html#autotoc_md12", [
          [ "Sample Code", "release_notes.html#autotoc_md13", null ]
        ] ],
        [ "Provide a way of limiting users from extracting and printing sensitive documents", "release_notes.html#rn_10_CR_339007", null ],
        [ "Make Notes user stamp mandatory", "release_notes.html#rn_10_CR_394004", null ],
        [ "Detect whether a search is using the user's default sort and filters", "release_notes.html#rn_10_CR_401078", null ],
        [ "Improve performance and stability of document integrity check", "release_notes.html#rn_10_CR_421003", null ],
        [ "InputDocument.SetAsAlreadyStoredItem SDK function sets record Date Modified to current date rather than Date Modified from document profile", "release_notes.html#rn_10_CR_398052", null ],
        [ "Allow content index updates of missing Records using the SDK so that users can automate the process", "release_notes.html#rn_10_CR_360002", null ],
        [ "More user-friendly style of displaying record types for selection", "release_notes.html#rn_10_CR_343056", [
          [ "Sample Code", "release_notes.html#autotoc_md14", null ]
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
        [ "Removed properties", "release_notes.html#autotoc_md15", null ],
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
        [ "Exposing the Initiating Workflow template concept in the SDK", "release_notes.html#autotoc_md16", null ],
        [ "Provide a way of \"crawling\" the repository without tripping the LastUpdatedOn date", "release_notes.html#autotoc_md17", null ]
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
        [ "Downloading the .NET SDK from NuGet", "start_here.html#autotoc_md18", null ],
        [ "Finding Content Manager libraries at runtime", "start_here.html#findingAssemblies", [
          [ "Code Example (with explicit initialization)", "start_here.html#autotoc_md19", null ],
          [ "Code Example (without explicit initialization)", "start_here.html#autotoc_md20", null ]
        ] ],
        [ "Loading TRIM.SDK.dll assembly dynamically", "start_here.html#dynamicSdkLoading", null ],
        [ "Memory Management", "start_here.html#memory_management", [
          [ "Examples", "start_here.html#autotoc_md21", null ],
          [ "Using statement", "start_here.html#autotoc_md22", null ],
          [ "Try/Finally", "start_here.html#autotoc_md23", null ]
        ] ],
        [ "Leak tracking", "start_here.html#autotoc_md24", null ]
      ] ]
    ] ],
    [ "Open ID Connect Authentication", "oidc.html", [
      [ "Authentication overview", "oidc.html#auth_overview", null ],
      [ "ADFS for Native client", "oidc.html#oidc_adfs_native", [
        [ "Configure ADFS", "oidc.html#autotoc_md25", [
          [ "Log on to your ADFS Server and create an application group.", "oidc.html#autotoc_md26", null ],
          [ "Name the group", "oidc.html#autotoc_md27", null ],
          [ "Configure the group", "oidc.html#autotoc_md28", null ],
          [ "Review the settings and select Next", "oidc.html#autotoc_md29", null ],
          [ "Modify application group properties", "oidc.html#autotoc_md30", null ],
          [ "Add application", "oidc.html#autotoc_md31", null ],
          [ "Select Web API", "oidc.html#autotoc_md32", null ],
          [ "Configure the Web API", "oidc.html#autotoc_md33", null ],
          [ "Select an appropriate Access control Policy", "oidc.html#autotoc_md34", null ],
          [ "Set scopes", "oidc.html#autotoc_md35", null ],
          [ "Review the configuration and select next, then close.", "oidc.html#autotoc_md36", null ],
          [ "Set issuance rules", "oidc.html#autotoc_md37", null ],
          [ "Add rule", "oidc.html#autotoc_md38", null ],
          [ "Map attributes", "oidc.html#autotoc_md39", null ],
          [ "Configure Content Manager", "oidc.html#autotoc_md40", null ],
          [ "Configure OpenId settings", "oidc.html#autotoc_md41", null ]
        ] ]
      ] ],
      [ "ADFS for WebClient and ServiceAPI", "oidc.html#oidc_adfs", [
        [ "Create the AD FS  Application", "oidc.html#autotoc_md42", [
          [ "Examples", "oidc.html#autotoc_md43", [
            [ "New AD FS application", "oidc.html#autotoc_md44", null ],
            [ "Add Redirect URI", "oidc.html#autotoc_md45", null ],
            [ "Generate Secret", "oidc.html#autotoc_md46", null ],
            [ "Specify Web API identifier", "oidc.html#autotoc_md47", null ]
          ] ]
        ] ],
        [ "Add the settings to the Web Client", "oidc.html#autotoc_md48", [
          [ "Example", "oidc.html#autotoc_md49", null ]
        ] ],
        [ "Configure AD FS for Office Integration access", "oidc.html#autotoc_md50", [
          [ "Examples", "oidc.html#autotoc_md51", [
            [ "Add native application", "oidc.html#autotoc_md52", null ],
            [ "Add permissions for native application", "oidc.html#autotoc_md53", null ],
            [ "Specifiy claims to be included in token", "oidc.html#autotoc_md54", null ]
          ] ]
        ] ],
        [ "Add office integration the settings to the Web Client", "oidc.html#autotoc_md55", null ]
      ] ],
      [ "AzureAD for WebClient/Mobile App and ServiceAPI", "oidc.html#oidc_azuread", [
        [ "Create the Azure AD Application", "oidc.html#autotoc_md56", [
          [ "Example", "oidc.html#autotoc_md57", null ]
        ] ],
        [ "Add a secret", "oidc.html#autotoc_md58", [
          [ "Example", "oidc.html#autotoc_md59", null ]
        ] ],
        [ "Configure Tokens", "oidc.html#autotoc_md60", null ],
        [ "Configure permissions", "oidc.html#autotoc_md61", [
          [ "Example", "oidc.html#autotoc_md62", null ]
        ] ],
        [ "Configure for mobile", "oidc.html#oidc_mobile", [
          [ "Add the mobile redirect URI", "oidc.html#autotoc_md63", null ],
          [ "Add the mobile redirect URI to the ServiceAPI", "oidc.html#autotoc_md64", null ]
        ] ],
        [ "Configure authentication in hptrim.config", "oidc.html#autotoc_md65", [
          [ "Example config", "oidc.html#autotoc_md66", null ]
        ] ],
        [ "Enable redirect", "oidc.html#autotoc_md67", null ],
        [ "Allow users (Web Client only)", "oidc.html#autotoc_md68", [
          [ "Example", "oidc.html#autotoc_md69", null ]
        ] ],
        [ "Logout", "oidc.html#autotoc_md70", [
          [ "Example", "oidc.html#autotoc_md71", null ]
        ] ],
        [ "Allow anonymous access in IIS", "oidc.html#autotoc_md72", null ]
      ] ],
      [ "Google authentication for WebClient and ServiceAPI", "oidc.html#oidc_google", [
        [ "Create the Google Credentials", "oidc.html#autotoc_md73", [
          [ "Example", "oidc.html#autotoc_md74", null ]
        ] ],
        [ "Configure authentication in hptrim.config", "oidc.html#autotoc_md75", [
          [ "Example config", "oidc.html#autotoc_md76", null ]
        ] ],
        [ "Enable redirect", "oidc.html#autotoc_md77", null ],
        [ "Logout", "oidc.html#autotoc_md78", [
          [ "Example", "oidc.html#autotoc_md79", null ]
        ] ],
        [ "Allow anonymous access in the IIS", "oidc.html#autotoc_md80", null ]
      ] ],
      [ "AzureAD for Content Manager Desktop", "oidc.html#oidc_azuread_desktop", [
        [ "Create the Azure AD Application", "oidc.html#autotoc_md81", [
          [ "Example", "oidc.html#autotoc_md82", null ]
        ] ],
        [ "Configure permissions", "oidc.html#autotoc_md83", [
          [ "Example", "oidc.html#autotoc_md84", null ]
        ] ],
        [ "Configure authentication in Content Manager Enterprise Studio", "oidc.html#autotoc_md85", [
          [ "Example", "oidc.html#autotoc_md86", null ]
        ] ],
        [ "Configure Azure AD for Office Integration access", "oidc.html#autotoc_md87", [
          [ "Example Config.xml", "oidc.html#autotoc_md88", null ]
        ] ],
        [ "Troubleshooting Azure AD for Office Integration access", "oidc.html#autotoc_md89", [
          [ "Error AADSTS500011: The resource principal named https://MYSERVER/contentmanager/ was not found in the tenant named XXXX-XXXX-XXXXX-XXXXXX.", "oidc.html#autotoc_md90", null ]
        ] ]
      ] ]
    ] ],
    [ "Zero Footprint Office Integration", "zero_office.html", [
      [ "Components", "zero_office.html#autotoc_md91", null ],
      [ "Requirements", "zero_office.html#autotoc_md92", null ],
      [ "ServiceAPI", "zero_office.html#autotoc_md93", [
        [ "ServiceAPI Configuration", "zero_office.html#autotoc_md94", null ],
        [ "ServiceAPI Authentication Permissions", "zero_office.html#autotoc_md96", null ],
        [ "ServiceAPI Authentication Application ID", "zero_office.html#autotoc_md97", null ],
        [ "ServiceAPI Authorized Client Applications", "zero_office.html#autotoc_md98", null ]
      ] ],
      [ "Manifests", "zero_office.html#zero_manifests", null ],
      [ "Browser Cookies", "zero_office.html#autotoc_md99", null ],
      [ "Email Link", "zero_office.html#autotoc_md100", null ]
    ] ],
    [ "Microsoft Teams Integration", "zero_teams.html", [
      [ "Two modes of operation", "zero_teams.html#autotoc_md101", [
        [ "Edit manifest to remove client side mode", "zero_teams.html#autotoc_md102", null ]
      ] ],
      [ "Components", "zero_teams.html#autotoc_md103", null ],
      [ "Requirements", "zero_teams.html#autotoc_md104", null ],
      [ "Server side architecture", "zero_teams.html#autotoc_md105", [
        [ "Check in styles and places", "zero_teams.html#autotoc_md106", null ],
        [ "Creating the check in style and place for Teams", "zero_teams.html#autotoc_md107", null ]
      ] ],
      [ "ServiceAPI", "zero_teams.html#autotoc_md108", null ],
      [ "Setup Script", "zero_teams.html#zero_teams_script", null ],
      [ "Microsoft protected APIs", "zero_teams.html#autotoc_md109", null ],
      [ "Conversation silent interval", "zero_teams.html#autotoc_md110", null ],
      [ "Setup instructions", "zero_teams.html#autotoc_md111", [
        [ "ServiceAPI Authentication Permissions", "zero_teams.html#autotoc_md112", null ],
        [ "ServiceAPI Authentication Application ID", "zero_teams.html#autotoc_md113", null ],
        [ "ServiceAPI Authorized Client Applications", "zero_teams.html#autotoc_md114", null ]
      ] ],
      [ "Teams App Manifest", "zero_teams.html#teams_manifests", null ],
      [ "Browser Cookies", "zero_teams.html#autotoc_md115", null ],
      [ "Email Link", "zero_teams.html#autotoc_md116", null ]
    ] ],
    [ "Programming in Content Manager", "programming_guide.html", [
      [ "Introduction", "programming_guide.html#programming_in", [
        [ "The main objects", "programming_guide.html#main_objects", null ],
        [ "Using the TrimApplication object", "programming_guide.html#application_object", null ],
        [ "Using the Database object", "programming_guide.html#database_object", [
          [ "Code Example", "programming_guide.html#autotoc_md117", null ]
        ] ],
        [ "Database pooling", "programming_guide.html#database_pooling", [
          [ "Code Example", "programming_guide.html#autotoc_md118", null ]
        ] ]
      ] ],
      [ "Creating and modifying Records", "programming_guide.html#creating_records", [
        [ "Creating new Records", "programming_guide.html#new_record", [
          [ "Code example", "programming_guide.html#autotoc_md119", null ]
        ] ],
        [ "Setting the Container and Classification", "programming_guide.html#creating_records_container", null ],
        [ "Accessing existing records", "programming_guide.html#access_existing_record", null ],
        [ "Getting a record by record number", "programming_guide.html#get_existing_record", [
          [ "Code Example", "programming_guide.html#autotoc_md120", null ]
        ] ],
        [ "Getting a Record by URI", "programming_guide.html#record_by_uri", [
          [ "Code Example", "programming_guide.html#autotoc_md121", null ]
        ] ]
      ] ],
      [ "Reading record data", "programming_guide.html#reading_record_data", [
        [ "Basic properties", "programming_guide.html#reading_basic_properties", [
          [ "Examples of basic readable properties of a record are:", "programming_guide.html#autotoc_md122", null ],
          [ "Code Example", "programming_guide.html#autotoc_md123", null ]
        ] ],
        [ "Accessing related objects", "programming_guide.html#related_objects", [
          [ "Code Example", "programming_guide.html#autotoc_md124", null ]
        ] ],
        [ "Accessing record Location information", "programming_guide.html#record_Location_info", [
          [ "Code Example", "programming_guide.html#autotoc_md125", null ]
        ] ]
      ] ],
      [ "Updating records", "programming_guide.html#updating_records", [
        [ "Modifying properties", "programming_guide.html#modifying_properties", [
          [ "Code Example", "programming_guide.html#autotoc_md126", null ]
        ] ],
        [ "Calling update methods", "programming_guide.html#update_methods", [
          [ "Code Example", "programming_guide.html#autotoc_md127", null ],
          [ "Code Example", "programming_guide.html#autotoc_md128", null ]
        ] ],
        [ "Updating properties using SetProperty", "programming_guide.html#updating_properties", [
          [ "Code Example", "programming_guide.html#autotoc_md129", null ]
        ] ],
        [ "User Defined Fields", "programming_guide.html#update_user_defined_fields", [
          [ "Code Example (GetFieldValue())", "programming_guide.html#autotoc_md130", null ],
          [ "Code Example (SetFieldValue())", "programming_guide.html#autotoc_md131", null ]
        ] ]
      ] ],
      [ "Verifying and error trapping", "programming_guide.html#Verifying_and_error_trapping", [
        [ "The Verify() method", "programming_guide.html#The_Verify_method", [
          [ "Code Example", "programming_guide.html#autotoc_md132", null ]
        ] ],
        [ "The Verified property", "programming_guide.html#The_Verified_property", null ],
        [ "Trapping run-time errors", "programming_guide.html#Trapping_run-time_errors", null ],
        [ "Saving the record to the database", "programming_guide.html#Saving_the_record_to_the_database", null ]
      ] ],
      [ "New records and electronic documents", "programming_guide.html#New_records_and_electronic_documents", [
        [ "Creating a container file", "programming_guide.html#autotoc_md133", null ],
        [ "Creating a record of a given type", "programming_guide.html#Creating_a_record_of_a_given_type", null ],
        [ "Controlled and free text titling", "programming_guide.html#Controlled_and_free_text_titling", [
          [ "Code Example", "programming_guide.html#autotoc_md134", null ]
        ] ],
        [ "Security Levels and Caveats", "programming_guide.html#Security_Levels_and_Caveats", [
          [ "Code Example", "programming_guide.html#autotoc_md135", null ],
          [ "Code Example", "programming_guide.html#autotoc_md136", null ]
        ] ],
        [ "Record Locations", "programming_guide.html#Record_Locations", [
          [ "Code Example", "programming_guide.html#autotoc_md137", null ]
        ] ],
        [ "Record Contacts", "programming_guide.html#Record_Contacts", [
          [ "Code Example", "programming_guide.html#autotoc_md138", null ]
        ] ],
        [ "Creating a Document", "programming_guide.html#Creating_a_Document", null ],
        [ "Titling and numbering", "programming_guide.html#Titling_and_numbering", [
          [ "Code Example", "programming_guide.html#autotoc_md139", null ]
        ] ],
        [ "Assigning to a container", "programming_guide.html#Assigning_to_a_container", [
          [ "Code Example", "programming_guide.html#autotoc_md140", null ]
        ] ],
        [ "Attaching an electronic document", "programming_guide.html#Attaching_an_electronic_document", [
          [ "Code Example", "programming_guide.html#autotoc_md141", null ]
        ] ],
        [ "Document Author", "programming_guide.html#Document_Author", null ]
      ] ],
      [ "Locations", "programming_guide.html#Locations", [
        [ "Working with Locations", "programming_guide.html#Working_with_Locations", null ],
        [ "Finding a Person by Name", "programming_guide.html#Finding_a_Person_by_Name", [
          [ "Code Example", "programming_guide.html#autotoc_md142", null ]
        ] ],
        [ "Creating a new Staff Member", "programming_guide.html#Creating_a_new_Staff_Member", [
          [ "Code Example", "programming_guide.html#autotoc_md143", null ],
          [ "Code Example", "programming_guide.html#autotoc_md144", null ],
          [ "Code Example", "programming_guide.html#autotoc_md145", null ]
        ] ]
      ] ],
      [ "Searching Content Manager using the .NET SDK", "programming_guide.html#Searching_Content_Manager", [
        [ "Searching for Content Manager objects", "programming_guide.html#Searching_for_Records_Manager_objects", [
          [ "Code Example", "programming_guide.html#autotoc_md146", null ]
        ] ],
        [ "Specifying the search criteria", "programming_guide.html#Specifying_the_search_criteria", [
          [ "Code Example", "programming_guide.html#autotoc_md147", null ],
          [ "Code Example", "programming_guide.html#autotoc_md148", null ]
        ] ],
        [ "Retrieving the results of the search", "programming_guide.html#Retrieving_the_results", [
          [ "Code Example", "programming_guide.html#autotoc_md149", null ]
        ] ]
      ] ],
      [ "Other search features", "programming_guide.html#Other_search_features", [
        [ "Return paged results", "programming_guide.html#search_paged_results", null ],
        [ "Filtering/searching by enum value", "programming_guide.html#enum_filtering", null ],
        [ "Purpose filtering", "programming_guide.html#Purpose_filtering", null ],
        [ "Persisting a search", "programming_guide.html#Persisting_a_search", null ],
        [ "Item matching", "programming_guide.html#autotoc_md150", null ],
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
    [ "﻿Search Clauses", "sc_using.html", [
      [ "Overview", "sc_using.html#sc_overview", null ],
      [ "Interrogating metadata", "sc_using.html#autotoc_md151", [
        [ "Code Sample", "sc_using.html#autotoc_md152", null ]
      ] ],
      [ "List of search clauses by object type", "sc_using.html#searcg_clauses_by_object_type", [
        [ "ActionDef", "sc_using.html#search_clauses_ActionDef", null ],
        [ "Activity", "sc_using.html#search_clauses_Activity", null ],
        [ "AgendaItem", "sc_using.html#search_clauses_AgendaItem", null ],
        [ "AgendaItemType", "sc_using.html#search_clauses_AgendaItemType", null ],
        [ "Alert", "sc_using.html#search_clauses_Alert", null ],
        [ "ArchiveEvent", "sc_using.html#search_clauses_ArchiveEvent", null ],
        [ "AutoPartRule", "sc_using.html#search_clauses_AutoPartRule", null ],
        [ "Census", "sc_using.html#search_clauses_Census", null ],
        [ "CheckinStyle", "sc_using.html#search_clauses_CheckinStyle", null ],
        [ "Classification", "sc_using.html#search_clauses_Classification", null ],
        [ "Communication", "sc_using.html#search_clauses_Communication", null ],
        [ "Consignment", "sc_using.html#search_clauses_Consignment", null ],
        [ "ConsignmentApprover", "sc_using.html#search_clauses_ConsignmentApprover", null ],
        [ "ConsignmentIssue", "sc_using.html#search_clauses_ConsignmentIssue", null ],
        [ "ConsignmentRejection", "sc_using.html#search_clauses_ConsignmentRejection", null ],
        [ "ConsignmentTemplate", "sc_using.html#search_clauses_ConsignmentTemplate", null ],
        [ "DocumentQueue", "sc_using.html#search_clauses_DocumentQueue", null ],
        [ "ElectronicStore", "sc_using.html#search_clauses_ElectronicStore", null ],
        [ "ExternalIcon", "sc_using.html#search_clauses_ExternalIcon", null ],
        [ "ExternalLink", "sc_using.html#search_clauses_ExternalLink", null ],
        [ "ExternalWorkflow", "sc_using.html#search_clauses_ExternalWorkflow", null ],
        [ "ExternalWorkflowTask", "sc_using.html#search_clauses_ExternalWorkflowTask", null ],
        [ "ExternalWorkflowType", "sc_using.html#search_clauses_ExternalWorkflowType", null ],
        [ "FieldDefinition", "sc_using.html#search_clauses_FieldDefinition", null ],
        [ "History", "sc_using.html#search_clauses_History", null ],
        [ "Hold", "sc_using.html#search_clauses_Hold", null ],
        [ "HtmlLayout", "sc_using.html#search_clauses_HtmlLayout", null ],
        [ "Jurisdiction", "sc_using.html#search_clauses_Jurisdiction", null ],
        [ "Keyword", "sc_using.html#search_clauses_Keyword", null ],
        [ "Location", "sc_using.html#search_clauses_Location", null ],
        [ "LookupSet", "sc_using.html#search_clauses_LookupSet", null ],
        [ "MailTemplate", "sc_using.html#search_clauses_MailTemplate", null ],
        [ "Meeting", "sc_using.html#search_clauses_Meeting", null ],
        [ "MeetingType", "sc_using.html#search_clauses_MeetingType", null ],
        [ "MetadataRule", "sc_using.html#search_clauses_MetadataRule", null ],
        [ "MinuteItem", "sc_using.html#search_clauses_MinuteItem", null ],
        [ "MinuteItemType", "sc_using.html#search_clauses_MinuteItemType", null ],
        [ "OfflineRecord", "sc_using.html#search_clauses_OfflineRecord", null ],
        [ "Origin", "sc_using.html#search_clauses_Origin", null ],
        [ "OriginHistory", "sc_using.html#search_clauses_OriginHistory", null ],
        [ "Record", "sc_using.html#search_clauses_Record", null ],
        [ "RecordAction", "sc_using.html#search_clauses_RecordAction", null ],
        [ "RecordType", "sc_using.html#search_clauses_RecordType", null ],
        [ "Report", "sc_using.html#search_clauses_Report", null ],
        [ "ReportBitmap", "sc_using.html#search_clauses_ReportBitmap", null ],
        [ "Request", "sc_using.html#search_clauses_Request", null ],
        [ "Revision", "sc_using.html#search_clauses_Revision", null ],
        [ "SavedSearch", "sc_using.html#search_clauses_SavedSearch", null ],
        [ "Schedule", "sc_using.html#search_clauses_Schedule", null ],
        [ "ScheduledTask", "sc_using.html#search_clauses_ScheduledTask", null ],
        [ "SearchForm", "sc_using.html#search_clauses_SearchForm", null ],
        [ "SecurityCaveat", "sc_using.html#search_clauses_SecurityCaveat", null ],
        [ "SecurityLevel", "sc_using.html#search_clauses_SecurityLevel", null ],
        [ "SharePointItem", "sc_using.html#search_clauses_SharePointItem", null ],
        [ "Space", "sc_using.html#search_clauses_Space", null ],
        [ "StopWord", "sc_using.html#search_clauses_StopWord", null ],
        [ "StorePool", "sc_using.html#search_clauses_StorePool", null ],
        [ "TodoItem", "sc_using.html#search_clauses_TodoItem", null ],
        [ "UserLabel", "sc_using.html#search_clauses_UserLabel", null ],
        [ "Workflow", "sc_using.html#search_clauses_Workflow", null ],
        [ "WorkflowTemplate", "sc_using.html#search_clauses_WorkflowTemplate", null ],
        [ "ZipCode", "sc_using.html#search_clauses_ZipCode", null ]
      ] ]
    ] ],
    [ "﻿Enum Items", "enum_items.html", [
      [ "Using Enums", "enum_items.html#enums_using", null ],
      [ "Interrogating metadata", "enum_items.html#autotoc_md153", [
        [ "Code Sample", "enum_items.html#autotoc_md154", null ]
      ] ],
      [ "List of enum items by Enum", "enum_items.html#enum_item_by_enum_type_type", [
        [ "Access Control Custom Add Menu Item", "enum_items.html#enum_help_aclMenuItems", null ],
        [ "Access Control Setting", "enum_items.html#enum_help_accessControlSettings", null ],
        [ "Access Transfer Style", "enum_items.html#enum_help_accessReferenceStyle", null ],
        [ "Action Purpose", "enum_items.html#enum_help_actionPurpose", null ],
        [ "Active Audit Event", "enum_items.html#enum_help_historyPurposes", null ],
        [ "Activity Access Control", "enum_items.html#enum_help_activityAccess", null ],
        [ "Activity Purpose", "enum_items.html#enum_help_activityPurposes", null ],
        [ "Activity State", "enum_items.html#enum_help_activityStates", null ],
        [ "Additional Field Access Control", "enum_items.html#enum_help_fieldAccess", null ],
        [ "Additional Field Format", "enum_items.html#enum_help_userFieldFormats", null ],
        [ "Additional Field Purpose Type", "enum_items.html#enum_help_fieldPurposeType", null ],
        [ "Address History Option", "enum_items.html#enum_help_addressHistoryOption", null ],
        [ "Address Type", "enum_items.html#enum_help_addressTypes", null ],
        [ "Address Type Used", "enum_items.html#enum_help_snapAddressType", null ],
        [ "Agenda Item Access Control", "enum_items.html#enum_help_agendaItemAccess", null ],
        [ "Agenda Print Style", "enum_items.html#enum_help_agendaPrintStyles", null ],
        [ "Aggrehation Sort Order", "enum_items.html#enum_help_aggregationSortOrder", null ],
        [ "Alert Condition Type", "enum_items.html#enum_help_alertConditionTypes", null ],
        [ "Alert Type", "enum_items.html#enum_help_alertType", null ],
        [ "Alert User Property", "enum_items.html#enum_help_alertUserProperties", null ],
        [ "Assignee Default", "enum_items.html#enum_help_currLocDef", null ],
        [ "Asynchronous Task Status", "enum_items.html#enum_help_asynchTaskStatus", null ],
        [ "Audit Event Counter", "enum_items.html#enum_help_auditEventCounters", null ],
        [ "Authentication Method", "enum_items.html#enum_help_authenticationMethod", null ],
        [ "Authorization Method", "enum_items.html#enum_help_authorizationMethods", null ],
        [ "Auto Render Select Option", "enum_items.html#enum_help_autoRenderSelectOption", null ],
        [ "Auto Rendering Error", "enum_items.html#enum_help_autoRenderError", null ],
        [ "Automated Part Rule Trigger", "enum_items.html#enum_help_aprDateTypes", null ],
        [ "Automated Part Type", "enum_items.html#enum_help_aprType", null ],
        [ "Automatic Rendition Status", "enum_items.html#enum_help_autoRenditionStatus", null ],
        [ "Barcode Control Label", "enum_items.html#enum_help_controlLabelType", null ],
        [ "Barcode Error", "enum_items.html#enum_help_barcodeError", null ],
        [ "Barcode Printing Option", "enum_items.html#enum_help_barcodePrintOption", null ],
        [ "Barcode userLabels Type", "enum_items.html#enum_help_barcodeLabelType", null ],
        [ "Behaviour", "enum_items.html#enum_help_recordBehaviour", null ],
        [ "BulkLoader Document Transfer Mode", "enum_items.html#enum_help_bulkLoaderCopyMode", null ],
        [ "Cache type", "enum_items.html#enum_help_wgsCacheType", null ],
        [ "Cached Table Notification Type", "enum_items.html#enum_help_cachedTableNotificationType", null ],
        [ "Census record", "enum_items.html#enum_help_censusRecords", null ],
        [ "Check In Place Type", "enum_items.html#enum_help_checkinPlaceTypes", null ],
        [ "Check In Style/Place Purpose", "enum_items.html#enum_help_checkinToolPurposes", null ],
        [ "Checkout Style", "enum_items.html#enum_help_checkOutStyles", null ],
        [ "Classification Usage Purpose", "enum_items.html#enum_help_classificationPurpose", null ],
        [ "Client Authentication Mechanism", "enum_items.html#enum_help_clientAuthenticationMechanism", null ],
        [ "Client Server Protocol", "enum_items.html#enum_help_clientServerProtocol", null ],
        [ "Column Index Type", "enum_items.html#enum_help_columnIndexType", null ],
        [ "Command", "enum_items.html#enum_help_commandIds", null ],
        [ "Command Refresh Type", "enum_items.html#enum_help_commandRefreshTypes", null ],
        [ "Communication Direction", "enum_items.html#enum_help_communicationDirection", null ],
        [ "Communication Medium", "enum_items.html#enum_help_communicationMedium", null ],
        [ "Communicator Type", "enum_items.html#enum_help_communicatorType", null ],
        [ "Connection Type", "enum_items.html#enum_help_ipConnectionType", null ],
        [ "Consignent Picklist Format", "enum_items.html#enum_help_consignmentPickListFormat", null ],
        [ "Consignment Disposal Type", "enum_items.html#enum_help_consignmentDisposalType", null ],
        [ "Consignment Issue Category", "enum_items.html#enum_help_consignmentItemIssueType", null ],
        [ "Consignment Item Status", "enum_items.html#enum_help_consignmentItemApprovalStatus", null ],
        [ "Consignment Purpose", "enum_items.html#enum_help_consignmentPurposes", null ],
        [ "Consignment Report Layout Type", "enum_items.html#enum_help_consignmentReportLayoutType", null ],
        [ "Consignment State", "enum_items.html#enum_help_consignmentState", null ],
        [ "Contact Type", "enum_items.html#enum_help_contactType", null ],
        [ "Container Security Type", "enum_items.html#enum_help_containerSecurityHandling", null ],
        [ "ContainmentRule", "enum_items.html#enum_help_containmentRule", null ],
        [ "Content Engine Type", "enum_items.html#enum_help_contentEngineType", null ],
        [ "Content Index Document Status", "enum_items.html#enum_help_contentIndexDocumentStatus", null ],
        [ "Content Index Status", "enum_items.html#enum_help_idolIndexStatus", null ],
        [ "Content Manager Event Counter", "enum_items.html#enum_help_trimEventCounters", null ],
        [ "Content Manager Path Type", "enum_items.html#enum_help_trimPathType", null ],
        [ "Copy Link URL Style", "enum_items.html#enum_help_copyLinkStyle", null ],
        [ "Copy Relationship", "enum_items.html#enum_help_copyRelationship", null ],
        [ "Cusp Date Display Type", "enum_items.html#enum_help_cuspDateDisplayType", null ],
        [ "Data Entry Page Type", "enum_items.html#enum_help_dataEntryPageType", null ],
        [ "Database Lock Type", "enum_items.html#enum_help_databaseLockType", null ],
        [ "Database Type", "enum_items.html#enum_help_databaseTypes", null ],
        [ "Dataset availability", "enum_items.html#enum_help_databaseAvailability", null ],
        [ "Date Aggregation Type", "enum_items.html#enum_help_dateAggregationType", null ],
        [ "Date Interval", "enum_items.html#enum_help_dateInterval", null ],
        [ "Date Interval Singular", "enum_items.html#enum_help_dateIntervalSing", null ],
        [ "Date Search Type", "enum_items.html#enum_help_dateSearchType", null ],
        [ "Day of the Week", "enum_items.html#enum_help_dayOfTheWeek", null ],
        [ "Declassify Option", "enum_items.html#enum_help_declassifyType", null ],
        [ "Desktop Startup State", "enum_items.html#enum_help_desktopStartStates", null ],
        [ "Diagnostic Logging Category", "enum_items.html#enum_help_loggingCategories", null ],
        [ "Disposal Type", "enum_items.html#enum_help_disposalType", null ],
        [ "Disposition", "enum_items.html#enum_help_recordDisp", null ],
        [ "Disposition Calculation Status", "enum_items.html#enum_help_disposalScheduleStatus", null ],
        [ "Disposition Pending", "enum_items.html#enum_help_recordDispPending", null ],
        [ "Document Action", "enum_items.html#enum_help_activityDocumentAction", null ],
        [ "Document Auto Profiling Title Option", "enum_items.html#enum_help_autoProfilingTitleOptions", null ],
        [ "Document Edit Status", "enum_items.html#enum_help_documentEditStatus", null ],
        [ "Document Event Counter", "enum_items.html#enum_help_documentEventCounters", null ],
        [ "Document Link Type", "enum_items.html#enum_help_documentLinkType", null ],
        [ "Document Origin", "enum_items.html#enum_help_activityDocumentOrigin", null ],
        [ "Document Placeholder Type", "enum_items.html#enum_help_workflowDocumentPlaceholderType", null ],
        [ "Document Queue Type", "enum_items.html#enum_help_queueTypes", null ],
        [ "Document Review State", "enum_items.html#enum_help_documentReviewStates", null ],
        [ "Document Selection Type", "enum_items.html#enum_help_documentSelectionType", null ],
        [ "Document Status", "enum_items.html#enum_help_activityDocumentStatus", null ],
        [ "Document Store Integrity Check Counter Type", "enum_items.html#enum_help_documentStoreIntegrityCheckCounter", null ],
        [ "Document Store Purpose", "enum_items.html#enum_help_storePurposes", null ],
        [ "Document Store Status", "enum_items.html#enum_help_storeStatus", null ],
        [ "Document Store Type", "enum_items.html#enum_help_estoreTypes", null ],
        [ "Document Store Usage Type", "enum_items.html#enum_help_storeUsageType", null ],
        [ "Document Update Style", "enum_items.html#enum_help_documentUpdateStyles", null ],
        [ "Document Usage Type", "enum_items.html#enum_help_activityDocumentUsage", null ],
        [ "Dots per Inch", "enum_items.html#enum_help_dotsPerInch", null ],
        [ "Double Click Container Style", "enum_items.html#enum_help_dblClickContainerStyle", null ],
        [ "Double Click Style", "enum_items.html#enum_help_dblClickStyle", null ],
        [ "Duplicate Email Option", "enum_items.html#enum_help_duplicateEmailOptions", null ],
        [ "Edit Notes Style", "enum_items.html#enum_help_editNotesStyle", null ],
        [ "Electronic Address Type", "enum_items.html#enum_help_eAddressType", null ],
        [ "Electronic Inactive Record Selection Date Type", "enum_items.html#enum_help_esoDateType", null ],
        [ "Electronic Storage Action Type", "enum_items.html#enum_help_esoActionType", null ],
        [ "Email Event Type", "enum_items.html#enum_help_mailEventType", null ],
        [ "Email Security Mode", "enum_items.html#enum_help_emailSecurityMode", null ],
        [ "Email Template Purpose", "enum_items.html#enum_help_mailTemplatePurposes", null ],
        [ "Email Update Style", "enum_items.html#enum_help_emailUpdateStyles", null ],
        [ "Encryption Algorithm", "enum_items.html#enum_help_encryptionAlgorithm", null ],
        [ "Enumeration", "enum_items.html#enum_help_enumerations", null ],
        [ "Event", "enum_items.html#enum_help_events", null ],
        [ "Event Occurrence Type", "enum_items.html#enum_help_occurrenceTypes", null ],
        [ "Event Process Type", "enum_items.html#enum_help_eventProcessType", null ],
        [ "Event Processor Status", "enum_items.html#enum_help_eventProcessorStatus", null ],
        [ "Event Statistics Group", "enum_items.html#enum_help_eventStatisticsGroup", null ],
        [ "Explorer Row Type", "enum_items.html#enum_help_explorerRowType", null ],
        [ "Explorer Top Level Category", "enum_items.html#enum_help_explorerCategory", null ],
        [ "Export Metadata Format", "enum_items.html#enum_help_exportMetadataFormat", null ],
        [ "External DMS System", "enum_items.html#enum_help_xdmsSystem", null ],
        [ "External Link Special Parameter", "enum_items.html#enum_help_externalLinkSpecialParameters", null ],
        [ "External Link Type", "enum_items.html#enum_help_externalLinkType", null ],
        [ "External Workflow Type Purpose", "enum_items.html#enum_help_externalWorkflowTypePurposes", null ],
        [ "Favorite Type", "enum_items.html#enum_help_favoriteType", null ],
        [ "Feature State", "enum_items.html#enum_help_featureState", null ],
        [ "File Size Unit", "enum_items.html#enum_help_fileSizeUnits", null ],
        [ "Flow Control Type", "enum_items.html#enum_help_flowControl", null ],
        [ "Font Style", "enum_items.html#enum_help_fontStyle", null ],
        [ "Frame Appearance", "enum_items.html#enum_help_frameAppearance", null ],
        [ "Frame Type", "enum_items.html#enum_help_windowsFrameType", null ],
        [ "Gender", "enum_items.html#enum_help_gender", null ],
        [ "Gender Salutation", "enum_items.html#enum_help_genderSalutation", null ],
        [ "General Access Control", "enum_items.html#enum_help_generalAccess", null ],
        [ "General Error Handling", "enum_items.html#enum_help_generalExceptionHandling", null ],
        [ "Generic Permission", "enum_items.html#enum_help_genericPermissions", null ],
        [ "Generic Usage Purpose", "enum_items.html#enum_help_genericPurposes", null ],
        [ "Geography Distance Unit", "enum_items.html#enum_help_geographyDistanceUnit", null ],
        [ "Geography Search Type", "enum_items.html#enum_help_geographySearchType", null ],
        [ "Hashing Algorithm", "enum_items.html#enum_help_hashingAlgorithms", null ],
        [ "Hold Access Control", "enum_items.html#enum_help_holdAccess", null ],
        [ "Icon", "enum_items.html#enum_help_icons", null ],
        [ "Icon Display Mode", "enum_items.html#enum_help_iconDisplayMode", null ],
        [ "Icon Size", "enum_items.html#enum_help_iconSizes", null ],
        [ "Icon Usage Type", "enum_items.html#enum_help_iconUsage", null ],
        [ "IDOL Index Type", "enum_items.html#enum_help_idolIndexType", null ],
        [ "Initiating Record Behaviour", "enum_items.html#enum_help_initiatingRecordBehavior", null ],
        [ "Interest Type", "enum_items.html#enum_help_clientMatterInterestTypes", null ],
        [ "Item Storage System", "enum_items.html#enum_help_itemStorageSystem", null ],
        [ "Jurisdiction Purpose", "enum_items.html#enum_help_jurisdictionPurposes", null ],
        [ "Jurisdiction Type", "enum_items.html#enum_help_jurisdictionTypes", null ],
        [ "Label Position Change Type", "enum_items.html#enum_help_labelPositionChange", null ],
        [ "Language", "enum_items.html#enum_help_language", null ],
        [ "Layout Purpose", "enum_items.html#enum_help_layoutPurpose", null ],
        [ "LDAP Attribute Matching Type", "enum_items.html#enum_help_ldapMatchingType", null ],
        [ "LDAP Authentication Method", "enum_items.html#enum_help_ldapAuthMethod", null ],
        [ "LDAP Search Scope", "enum_items.html#enum_help_ldapSearchScope", null ],
        [ "Less Secure Document Security Type", "enum_items.html#enum_help_documentSecurityHandling", null ],
        [ "License Type", "enum_items.html#enum_help_licenseTypes", null ],
        [ "List Item Orginator", "enum_items.html#enum_help_spListItemOriginator", null ],
        [ "Location Access Control", "enum_items.html#enum_help_locationAccess", null ],
        [ "Location Default", "enum_items.html#enum_help_locationDefault", null ],
        [ "Location Field Type", "enum_items.html#enum_help_locationFieldType", null ],
        [ "Location Import Type", "enum_items.html#enum_help_locationMatchType", null ],
        [ "Location Relationship Type", "enum_items.html#enum_help_locRelationshipType", null ],
        [ "Location Type", "enum_items.html#enum_help_locationType", null ],
        [ "Location Usage Purpose", "enum_items.html#enum_help_locationPurpose", null ],
        [ "Lock Down Type", "enum_items.html#enum_help_lockdownStyles", null ],
        [ "Log Level", "enum_items.html#enum_help_logLevels", null ],
        [ "Lookup Item Display Style", "enum_items.html#enum_help_lookupItemFieldStyle", null ],
        [ "Lookup Item Purpose Type", "enum_items.html#enum_help_lookupItemPurposeType", null ],
        [ "Lookup Set Type", "enum_items.html#enum_help_lookupSetType", null ],
        [ "Mail Format", "enum_items.html#enum_help_mailFormat", null ],
        [ "Mail Persistence Style", "enum_items.html#enum_help_mailPersistence", null ],
        [ "Mail Recipient Type", "enum_items.html#enum_help_mailRecipientType", null ],
        [ "Managed List Item Status", "enum_items.html#enum_help_spManagedItemStatus", null ],
        [ "Media Type", "enum_items.html#enum_help_mediaTypes", null ],
        [ "Meeting Access Control", "enum_items.html#enum_help_meetingAccess", null ],
        [ "Meeting Attendance Type", "enum_items.html#enum_help_attendanceType", null ],
        [ "Meeting Document Type", "enum_items.html#enum_help_meetingDocumentType", null ],
        [ "Meeting Purpose", "enum_items.html#enum_help_meetingPurpose", null ],
        [ "Menu", "enum_items.html#enum_help_menuIds", null ],
        [ "Menu Item", "enum_items.html#enum_help_menuItemIds", null ],
        [ "Menu Popup", "enum_items.html#enum_help_menuPopupIds", null ],
        [ "Methods to Attach thesaurus term", "enum_items.html#enum_help_keywordAttachMethod", null ],
        [ "Microsoft Excel File Type", "enum_items.html#enum_help_excelFileTypes", null ],
        [ "Microsoft Office 2003 Excel File Type", "enum_items.html#enum_help_excel11FileTypes", null ],
        [ "Microsoft Office 2003 PowerPoint File Type", "enum_items.html#enum_help_powerpoint11FileTypes", null ],
        [ "Microsoft Office 2003 Project File Type", "enum_items.html#enum_help_project11FileTypes", null ],
        [ "Microsoft Office 2003 Word File Type", "enum_items.html#enum_help_word11FileTypes", null ],
        [ "Microsoft Open Excel File Type", "enum_items.html#enum_help_excelOpenFileTypes", null ],
        [ "Microsoft Open PowerPoint File Type", "enum_items.html#enum_help_powerpointOpenFileTypes", null ],
        [ "Microsoft Open Project File Type", "enum_items.html#enum_help_projectOpenFileTypes", null ],
        [ "Microsoft Open Word File Type", "enum_items.html#enum_help_wordOpenFileTypes", null ],
        [ "Microsoft PowerPoint File Type", "enum_items.html#enum_help_powerpointFileTypes", null ],
        [ "Microsoft Project File Type", "enum_items.html#enum_help_projectFileTypes", null ],
        [ "Microsoft Word File Type", "enum_items.html#enum_help_wordFileTypes", null ],
        [ "Migration Type", "enum_items.html#enum_help_migrationType", null ],
        [ "Mobile Client Menu Item", "enum_items.html#enum_help_mobileClientMenuItem", null ],
        [ "Month", "enum_items.html#enum_help_months", null ],
        [ "Motion Outcome", "enum_items.html#enum_help_motionOutcome", null ],
        [ "Native Mail Capture Style", "enum_items.html#enum_help_nativeMailStyles", null ],
        [ "Notes Insert Style", "enum_items.html#enum_help_notesInsertStyles", null ],
        [ "Notes Update Type", "enum_items.html#enum_help_notesUpdateType", null ],
        [ "Notification Type", "enum_items.html#enum_help_notificationType", null ],
        [ "Numbering Method", "enum_items.html#enum_help_numberingMethods", null ],
        [ "Numbering Type", "enum_items.html#enum_help_nbrTypes", null ],
        [ "OAuth Implementation Type", "enum_items.html#enum_help_oauthImplementationType", null ],
        [ "Object Capability", "enum_items.html#enum_help_objectCapabilities", null ],
        [ "Object Type", "enum_items.html#enum_help_baseObjectTypes", null ],
        [ "Office Integration Menu Caption", "enum_items.html#enum_help_officeIntegrationMenuCaptions", null ],
        [ "Offline Record Purpose", "enum_items.html#enum_help_offlineRecordPurpose", null ],
        [ "Offline Status", "enum_items.html#enum_help_offlineStatus", null ],
        [ "Old Version Purge Style", "enum_items.html#enum_help_oldVersionPurgeOptions", null ],
        [ "Open Document Status", "enum_items.html#enum_help_openDocumentStatus", null ],
        [ "Origin Type", "enum_items.html#enum_help_originType", null ],
        [ "Outline Number Type", "enum_items.html#enum_help_outlineNumberType", null ],
        [ "Output Path Type", "enum_items.html#enum_help_outputPathTypes", null ],
        [ "Path Type", "enum_items.html#enum_help_pathTypes", null ],
        [ "Permission Group", "enum_items.html#enum_help_permissionGroups", null ],
        [ "Physical Inactive Record Selection Date Type", "enum_items.html#enum_help_psoDateType", null ],
        [ "Physical Storage Action Type", "enum_items.html#enum_help_psoActionType", null ],
        [ "Plugin Page Type", "enum_items.html#enum_help_pluginPageType", null ],
        [ "Prefetch Style", "enum_items.html#enum_help_prefetchStyles", null ],
        [ "Priority", "enum_items.html#enum_help_priority", null ],
        [ "Product Feature", "enum_items.html#enum_help_productFeatures", null ],
        [ "Product String", "enum_items.html#enum_help_productString", null ],
        [ "Property", "enum_items.html#enum_help_propertyIds", null ],
        [ "Property Format", "enum_items.html#enum_help_propertyFormats", null ],
        [ "Property or Field Format", "enum_items.html#enum_help_propertyOrFieldFormat", null ],
        [ "Property Sort Mode", "enum_items.html#enum_help_propertySortMode", null ],
        [ "Property String Display Type", "enum_items.html#enum_help_stringDisplayType", null ],
        [ "Queue Item Attribute", "enum_items.html#enum_help_queueItemAttributes", null ],
        [ "Queue Property", "enum_items.html#enum_help_queueCapability", null ],
        [ "Queue Usage Type", "enum_items.html#enum_help_queueUsageType", null ],
        [ "Record Access Control", "enum_items.html#enum_help_recordAccess", null ],
        [ "Record Class", "enum_items.html#enum_help_recordClass", null ],
        [ "Record Copy Type", "enum_items.html#enum_help_copyType", null ],
        [ "Record Creation Statistics Date Range Type", "enum_items.html#enum_help_statisticalDateRangeTypes", null ],
        [ "Record Creation Statistics Location Grouping", "enum_items.html#enum_help_locationGrouping", null ],
        [ "Record Creation Statistics Primary Grouping", "enum_items.html#enum_help_primaryRecordStatisticsGrouping", null ],
        [ "Record Finalized Filter", "enum_items.html#enum_help_finalizedFilter", null ],
        [ "Record location Sub Types", "enum_items.html#enum_help_recLocSubTypes", null ],
        [ "Record location Type", "enum_items.html#enum_help_recordLocationType", null ],
        [ "Record Purpose", "enum_items.html#enum_help_recordPurposes", null ],
        [ "Record Relationship", "enum_items.html#enum_help_recordRelationshipType", null ],
        [ "Record Security Declassification Type", "enum_items.html#enum_help_recordDeclassifyTypes", null ],
        [ "Record Type Filter", "enum_items.html#enum_help_recordTypeFilter", null ],
        [ "Recycle Reason", "enum_items.html#enum_help_recycleReasons", null ],
        [ "Reference File Application", "enum_items.html#enum_help_referenceFileApplication", null ],
        [ "Reference Type", "enum_items.html#enum_help_todoReferenceType", null ],
        [ "Rendition Type", "enum_items.html#enum_help_renditionType", null ],
        [ "Reporter Font", "enum_items.html#enum_help_reporterFonts", null ],
        [ "Request Priority", "enum_items.html#enum_help_requestPriority", null ],
        [ "Request Purpose", "enum_items.html#enum_help_requestPurposes", null ],
        [ "Request Status", "enum_items.html#enum_help_requestStatus", null ],
        [ "Request Type", "enum_items.html#enum_help_requestTypes", null ],
        [ "Result Post Processing Methods", "enum_items.html#enum_help_resultPostProcessingMethod", null ],
        [ "Retain Option", "enum_items.html#enum_help_retainOptions", null ],
        [ "Reverse Record Relationship", "enum_items.html#enum_help_revRecRelationship", null ],
        [ "Review Filter", "enum_items.html#enum_help_pendingEventReviewFilter", null ],
        [ "Revision Purpose", "enum_items.html#enum_help_revisionPurposes", null ],
        [ "RM Grammar Item", "enum_items.html#enum_help_rmGrammarItem", null ],
        [ "RM Terminology Type", "enum_items.html#enum_help_rmTerminologyType", null ],
        [ "Runtime Environment", "enum_items.html#enum_help_environments", null ],
        [ "Saved Search Purpose", "enum_items.html#enum_help_searchPurposes", null ],
        [ "Schedule trigger", "enum_items.html#enum_help_triggerTypes", null ],
        [ "Schedule Usage Purpose", "enum_items.html#enum_help_schedulePurposes", null ],
        [ "Scheduled Task Status", "enum_items.html#enum_help_taskStatus", null ],
        [ "Search Clause", "enum_items.html#enum_help_searchClauseIds", null ],
        [ "Search Clause Group", "enum_items.html#enum_help_searchClauseGroup", null ],
        [ "Search contact Type", "enum_items.html#enum_help_searchContactType", null ],
        [ "Search Editor", "enum_items.html#enum_help_searchEditor", null ],
        [ "Search Filter", "enum_items.html#enum_help_searchFilterTypes", null ],
        [ "Search Grammar Item", "enum_items.html#enum_help_searchGrammarItem", null ],
        [ "Search location Type", "enum_items.html#enum_help_searchLocationType", null ],
        [ "Search parameter format", "enum_items.html#enum_help_searchParameterFormats", null ],
        [ "Search Starting Point", "enum_items.html#enum_help_searchStartPoint", null ],
        [ "Search Time Period (Plural)", "enum_items.html#enum_help_searchTimePeriodPlural", null ],
        [ "Search Time Period (Singular)", "enum_items.html#enum_help_searchTimePeriodSingular", null ],
        [ "Search Time Tense", "enum_items.html#enum_help_searchTimeTense", null ],
        [ "Security Update Type", "enum_items.html#enum_help_securityUpdateTypes", null ],
        [ "Selector", "enum_items.html#enum_help_selectors", null ],
        [ "Server Message Type", "enum_items.html#enum_help_serverMessageTypes", null ],
        [ "Set Author Option", "enum_items.html#enum_help_setAuthorOptions", null ],
        [ "SharePoint Element Type", "enum_items.html#enum_help_spElementType", null ],
        [ "Skin Style", "enum_items.html#enum_help_skinStyle", null ],
        [ "Sort Field", "enum_items.html#enum_help_recordSortFields", null ],
        [ "Space Allocation Method", "enum_items.html#enum_help_spaceAllocation", null ],
        [ "Space Level", "enum_items.html#enum_help_spaceLevel", null ],
        [ "Space Purpose", "enum_items.html#enum_help_spacePurposes", null ],
        [ "Space record Selection", "enum_items.html#enum_help_spaceRecordsSelection", null ],
        [ "Special Date String", "enum_items.html#enum_help_specialDates", null ],
        [ "SQL Error Type", "enum_items.html#enum_help_sqlErrorTypes", null ],
        [ "SQL Server Authentication Type", "enum_items.html#enum_help_sqlServerAuthenticationTypes", null ],
        [ "SSL Mode", "enum_items.html#enum_help_sslMode", null ],
        [ "Startup Pane Type", "enum_items.html#enum_help_startupPaneType", null ],
        [ "Statistical Grouping", "enum_items.html#enum_help_statGroupByType", null ],
        [ "Statistical Select By", "enum_items.html#enum_help_statTypes", null ],
        [ "Statistics Output Type", "enum_items.html#enum_help_statisticsOutputType", null ],
        [ "Stored Function", "enum_items.html#enum_help_storedFunctions", null ],
        [ "Stored Procedure", "enum_items.html#enum_help_storedProcedures", null ],
        [ "String Display Alignment", "enum_items.html#enum_help_stringDisplayAlignment", null ],
        [ "String Format", "enum_items.html#enum_help_stringFormat", null ],
        [ "String Verification Type", "enum_items.html#enum_help_stringVerificationTypes", null ],
        [ "Suppressable Disposal Issue", "enum_items.html#enum_help_disposalIssue", null ],
        [ "Tab Bar Style", "enum_items.html#enum_help_tabBarStyle", null ],
        [ "Text Index Synchronization Type", "enum_items.html#enum_help_textIndexSyncTypes", null ],
        [ "Text Object Type", "enum_items.html#enum_help_textObjectType", null ],
        [ "Thesaurus Term Purpose", "enum_items.html#enum_help_keywordPurposes", null ],
        [ "Thesaurus Term Relationship", "enum_items.html#enum_help_keywordRelationship", null ],
        [ "Tiered Storage Type", "enum_items.html#enum_help_tieredStorageType", null ],
        [ "Time Interval", "enum_items.html#enum_help_timeInterval", null ],
        [ "Title Placeholder", "enum_items.html#enum_help_titlePlaceholder", null ],
        [ "Titling Method", "enum_items.html#enum_help_titlingMethods", null ],
        [ "To Do Item Access Control", "enum_items.html#enum_help_todoItemAccess", null ],
        [ "Tray Type", "enum_items.html#enum_help_trayType", null ],
        [ "Trigger Delay Type", "enum_items.html#enum_help_triggerDelayTypes", null ],
        [ "Trigger Rounding Type", "enum_items.html#enum_help_triggerRounding", null ],
        [ "Type of Participant", "enum_items.html#enum_help_invitationType", null ],
        [ "Type of PropertiesAsStrings", "enum_items.html#enum_help_propertiesStringType", null ],
        [ "Unregistered User Option", "enum_items.html#enum_help_unregisteredUsers", null ],
        [ "URL Format", "enum_items.html#enum_help_objectURLformats", null ],
        [ "User Access Type", "enum_items.html#enum_help_userTypes", null ],
        [ "User Dashboard Item", "enum_items.html#enum_help_userDashboardItem", null ],
        [ "User Label Access Control", "enum_items.html#enum_help_labelAccess", null ],
        [ "User Label Purpose", "enum_items.html#enum_help_labelPurposes", null ],
        [ "User Label Type", "enum_items.html#enum_help_userLabelType", null ],
        [ "User License Type", "enum_items.html#enum_help_userLicenseTypes", null ],
        [ "User Option Set", "enum_items.html#enum_help_userOptionSetIds", null ],
        [ "User Permission", "enum_items.html#enum_help_userPermissions", null ],
        [ "Uses Store", "enum_items.html#enum_help_useStoreType", null ],
        [ "View Pane Style", "enum_items.html#enum_help_viewPaneStyle", null ],
        [ "Web Service Cache Setting", "enum_items.html#enum_help_webServiceCacheSettings", null ],
        [ "Word Processor Merge Format", "enum_items.html#enum_help_wordProcessorMergeFormats", null ],
        [ "Word Type", "enum_items.html#enum_help_wordTypes", null ],
        [ "Workflow Access Control", "enum_items.html#enum_help_workflowAccess", null ],
        [ "Workflow Event Counter", "enum_items.html#enum_help_workflowEventCounters", null ],
        [ "Workflow Lock Operation", "enum_items.html#enum_help_workflowLockOperation", null ],
        [ "XML Document Export Type", "enum_items.html#enum_help_xmlDocumentExportType", null ],
        [ "XML Schema Type", "enum_items.html#enum_help_xmlSchemaTypes", null ]
      ] ]
    ] ],
    [ "﻿Object Purposes", "object_purposes.html", [
      [ "About", "object_purposes.html#object_purposes_about", null ],
      [ "Warning", "object_purposes.html#object_purposes_warning", null ],
      [ "Extra information", "object_purposes.html#object_purposes_extra", null ],
      [ "Purpose metadata", "object_purposes.html#object_purposes_metadata", [
        [ "Code sample - searching", "object_purposes.html#autotoc_md155", null ],
        [ "Code sample - post search", "object_purposes.html#autotoc_md156", null ],
        [ "Code sample - object definition", "object_purposes.html#autotoc_md157", null ]
      ] ],
      [ "List of objects with related purpose enum", "object_purposes.html#object_with_purpose_enum", [
        [ "TRIM.SDK.ActionDef", "object_purposes.html#purpose_enum_ActionDef", null ],
        [ "TRIM.SDK.Activity", "object_purposes.html#purpose_enum_Activity", null ],
        [ "TRIM.SDK.AgendaItem", "object_purposes.html#purpose_enum_AgendaItem", null ],
        [ "TRIM.SDK.AgendaItemType", "object_purposes.html#purpose_enum_AgendaItemType", null ],
        [ "TRIM.SDK.AutoPartRule", "object_purposes.html#purpose_enum_AutoPartRule", null ],
        [ "TRIM.SDK.CheckinPlace", "object_purposes.html#purpose_enum_CheckinPlace", null ],
        [ "TRIM.SDK.CheckinStyle", "object_purposes.html#purpose_enum_CheckinStyle", null ],
        [ "TRIM.SDK.Classification", "object_purposes.html#purpose_enum_Classification", null ],
        [ "TRIM.SDK.Consignment", "object_purposes.html#purpose_enum_Consignment", null ],
        [ "TRIM.SDK.ConsignmentTemplate", "object_purposes.html#purpose_enum_ConsignmentTemplate", null ],
        [ "TRIM.SDK.DocumentQueue", "object_purposes.html#purpose_enum_DocumentQueue", null ],
        [ "TRIM.SDK.ElectronicStore", "object_purposes.html#purpose_enum_ElectronicStore", null ],
        [ "TRIM.SDK.ExternalLink", "object_purposes.html#purpose_enum_ExternalLink", null ],
        [ "TRIM.SDK.ExternalWorkflowType", "object_purposes.html#purpose_enum_ExternalWorkflowType", null ],
        [ "TRIM.SDK.FieldDefinition", "object_purposes.html#purpose_enum_FieldDefinition", null ],
        [ "TRIM.SDK.History", "object_purposes.html#purpose_enum_History", null ],
        [ "TRIM.SDK.Hold", "object_purposes.html#purpose_enum_Hold", null ],
        [ "TRIM.SDK.HtmlLayout", "object_purposes.html#purpose_enum_HtmlLayout", null ],
        [ "TRIM.SDK.Jurisdiction", "object_purposes.html#purpose_enum_Jurisdiction", null ],
        [ "TRIM.SDK.Keyword", "object_purposes.html#purpose_enum_Keyword", null ],
        [ "TRIM.SDK.Location", "object_purposes.html#purpose_enum_Location", null ],
        [ "TRIM.SDK.LookupItem", "object_purposes.html#purpose_enum_LookupItem", null ],
        [ "TRIM.SDK.LookupSet", "object_purposes.html#purpose_enum_LookupSet", null ],
        [ "TRIM.SDK.MailTemplate", "object_purposes.html#purpose_enum_MailTemplate", null ],
        [ "TRIM.SDK.Meeting", "object_purposes.html#purpose_enum_Meeting", null ],
        [ "TRIM.SDK.MeetingType", "object_purposes.html#purpose_enum_MeetingType", null ],
        [ "TRIM.SDK.MinuteItemType", "object_purposes.html#purpose_enum_MinuteItemType", null ],
        [ "TRIM.SDK.OfflineRecord", "object_purposes.html#purpose_enum_OfflineRecord", null ],
        [ "TRIM.SDK.Origin", "object_purposes.html#purpose_enum_Origin", null ],
        [ "TRIM.SDK.Record", "object_purposes.html#purpose_enum_Record", null ],
        [ "TRIM.SDK.RecordType", "object_purposes.html#purpose_enum_RecordType", null ],
        [ "TRIM.SDK.Report", "object_purposes.html#purpose_enum_Report", null ],
        [ "TRIM.SDK.Request", "object_purposes.html#purpose_enum_Request", null ],
        [ "TRIM.SDK.Revision", "object_purposes.html#purpose_enum_Revision", null ],
        [ "TRIM.SDK.SavedSearch", "object_purposes.html#purpose_enum_SavedSearch", null ],
        [ "TRIM.SDK.Schedule", "object_purposes.html#purpose_enum_Schedule", null ],
        [ "TRIM.SDK.ScheduledTask", "object_purposes.html#purpose_enum_ScheduledTask", null ],
        [ "TRIM.SDK.SearchForm", "object_purposes.html#purpose_enum_SearchForm", null ],
        [ "TRIM.SDK.SecurityCaveat", "object_purposes.html#purpose_enum_SecurityCaveat", null ],
        [ "TRIM.SDK.SecurityGuide", "object_purposes.html#purpose_enum_SecurityGuide", null ],
        [ "TRIM.SDK.SecurityLevel", "object_purposes.html#purpose_enum_SecurityLevel", null ],
        [ "TRIM.SDK.Space", "object_purposes.html#purpose_enum_Space", null ],
        [ "TRIM.SDK.TodoItem", "object_purposes.html#purpose_enum_TodoItem", null ],
        [ "TRIM.SDK.UserLabel", "object_purposes.html#purpose_enum_UserLabel", null ],
        [ "TRIM.SDK.Workflow", "object_purposes.html#purpose_enum_Workflow", null ],
        [ "TRIM.SDK.WorkflowTemplate", "object_purposes.html#purpose_enum_WorkflowTemplate", null ],
        [ "TRIM.SDK.WorkingCopy", "object_purposes.html#purpose_enum_WorkingCopy", null ]
      ] ]
    ] ],
    [ "﻿Property Definitions", "property_defs.html", [
      [ "Using Property Definitions", "property_defs.html#property_definitions_using", null ],
      [ "List of property definitions by object type", "property_defs.html#property_definitions_by_object_type", [
        [ "ActionDef", "property_defs.html#property_definitions_ActionDef", null ],
        [ "Activity", "property_defs.html#property_definitions_Activity", null ],
        [ "AgendaItem", "property_defs.html#property_definitions_AgendaItem", null ],
        [ "AgendaItemType", "property_defs.html#property_definitions_AgendaItemType", null ],
        [ "Alert", "property_defs.html#property_definitions_Alert", null ],
        [ "ArchiveEvent", "property_defs.html#property_definitions_ArchiveEvent", null ],
        [ "AutoPartRule", "property_defs.html#property_definitions_AutoPartRule", null ],
        [ "Census", "property_defs.html#property_definitions_Census", null ],
        [ "CheckinStyle", "property_defs.html#property_definitions_CheckinStyle", null ],
        [ "Classification", "property_defs.html#property_definitions_Classification", null ],
        [ "Communication", "property_defs.html#property_definitions_Communication", null ],
        [ "Consignment", "property_defs.html#property_definitions_Consignment", null ],
        [ "ConsignmentApprover", "property_defs.html#property_definitions_ConsignmentApprover", null ],
        [ "ConsignmentIssue", "property_defs.html#property_definitions_ConsignmentIssue", null ],
        [ "ConsignmentRejection", "property_defs.html#property_definitions_ConsignmentRejection", null ],
        [ "ConsignmentTemplate", "property_defs.html#property_definitions_ConsignmentTemplate", null ],
        [ "DocumentQueue", "property_defs.html#property_definitions_DocumentQueue", null ],
        [ "ElectronicStore", "property_defs.html#property_definitions_ElectronicStore", null ],
        [ "ExternalIcon", "property_defs.html#property_definitions_ExternalIcon", null ],
        [ "ExternalLink", "property_defs.html#property_definitions_ExternalLink", null ],
        [ "ExternalWorkflow", "property_defs.html#property_definitions_ExternalWorkflow", null ],
        [ "ExternalWorkflowTask", "property_defs.html#property_definitions_ExternalWorkflowTask", null ],
        [ "ExternalWorkflowType", "property_defs.html#property_definitions_ExternalWorkflowType", null ],
        [ "FieldDefinition", "property_defs.html#property_definitions_FieldDefinition", null ],
        [ "History", "property_defs.html#property_definitions_History", null ],
        [ "Hold", "property_defs.html#property_definitions_Hold", null ],
        [ "HtmlLayout", "property_defs.html#property_definitions_HtmlLayout", null ],
        [ "Jurisdiction", "property_defs.html#property_definitions_Jurisdiction", null ],
        [ "Keyword", "property_defs.html#property_definitions_Keyword", null ],
        [ "Location", "property_defs.html#property_definitions_Location", null ],
        [ "LookupSet", "property_defs.html#property_definitions_LookupSet", null ],
        [ "MailTemplate", "property_defs.html#property_definitions_MailTemplate", null ],
        [ "Meeting", "property_defs.html#property_definitions_Meeting", null ],
        [ "MeetingType", "property_defs.html#property_definitions_MeetingType", null ],
        [ "MetadataRule", "property_defs.html#property_definitions_MetadataRule", null ],
        [ "MinuteItem", "property_defs.html#property_definitions_MinuteItem", null ],
        [ "MinuteItemType", "property_defs.html#property_definitions_MinuteItemType", null ],
        [ "OfflineRecord", "property_defs.html#property_definitions_OfflineRecord", null ],
        [ "Origin", "property_defs.html#property_definitions_Origin", null ],
        [ "OriginHistory", "property_defs.html#property_definitions_OriginHistory", null ],
        [ "Record", "property_defs.html#property_definitions_Record", null ],
        [ "RecordAction", "property_defs.html#property_definitions_RecordAction", null ],
        [ "RecordType", "property_defs.html#property_definitions_RecordType", null ],
        [ "Report", "property_defs.html#property_definitions_Report", null ],
        [ "ReportBitmap", "property_defs.html#property_definitions_ReportBitmap", null ],
        [ "Request", "property_defs.html#property_definitions_Request", null ],
        [ "Revision", "property_defs.html#property_definitions_Revision", null ],
        [ "SavedSearch", "property_defs.html#property_definitions_SavedSearch", null ],
        [ "Schedule", "property_defs.html#property_definitions_Schedule", null ],
        [ "ScheduledTask", "property_defs.html#property_definitions_ScheduledTask", null ],
        [ "SearchForm", "property_defs.html#property_definitions_SearchForm", null ],
        [ "SecurityCaveat", "property_defs.html#property_definitions_SecurityCaveat", null ],
        [ "SecurityLevel", "property_defs.html#property_definitions_SecurityLevel", null ],
        [ "SharePointItem", "property_defs.html#property_definitions_SharePointItem", null ],
        [ "Space", "property_defs.html#property_definitions_Space", null ],
        [ "StopWord", "property_defs.html#property_definitions_StopWord", null ],
        [ "StorePool", "property_defs.html#property_definitions_StorePool", null ],
        [ "TodoItem", "property_defs.html#property_definitions_TodoItem", null ],
        [ "UserLabel", "property_defs.html#property_definitions_UserLabel", null ],
        [ "Workflow", "property_defs.html#property_definitions_Workflow", null ],
        [ "WorkflowTemplate", "property_defs.html#property_definitions_WorkflowTemplate", null ],
        [ "ZipCode", "property_defs.html#property_definitions_ZipCode", null ]
      ] ]
    ] ],
    [ "Advanced Topics", "advanced_topics.html", [
      [ "Different ways to fetch a TrimMainObject", "advanced_topics.html#ways_To_Fetch_a_TrimMainObject", [
        [ "Object constructor by Name", "advanced_topics.html#fetch_by_constructorand_name", [
          [ "Code example", "advanced_topics.html#autotoc_md158", null ]
        ] ],
        [ "Object name properties", "advanced_topics.html#object_name_properties", null ],
        [ "Database find methods", "advanced_topics.html#fetch_by_database", [
          [ "Code samples", "advanced_topics.html#autotoc_md159", null ]
        ] ],
        [ "TrimMainObjectSearch", "advanced_topics.html#fetch_by_search", [
          [ "Code sample", "advanced_topics.html#autotoc_md160", null ]
        ] ]
      ] ],
      [ "Document access alternatives", "advanced_topics.html#fetchDoc", [
        [ "Overview", "advanced_topics.html#doc_access_overview", null ],
        [ "Record.GetDocument()", "advanced_topics.html#getDoc", [
          [ "Checkout without getting the document", "advanced_topics.html#autotoc_md162", null ]
        ] ],
        [ "DocumentPathInClientCache", "advanced_topics.html#clientCache", [
          [ "Example", "advanced_topics.html#autotoc_md163", null ]
        ] ],
        [ "DocumentPathInWGSCache", "advanced_topics.html#wgsCache", [
          [ "Example", "advanced_topics.html#autotoc_md164", null ]
        ] ],
        [ "DownloadNotifier", "advanced_topics.html#downloadNotifier", [
          [ "Example", "advanced_topics.html#autotoc_md165", null ]
        ] ],
        [ "Other object types", "advanced_topics.html#dowload_other_object_types", null ]
      ] ],
      [ "Localised strings", "advanced_topics.html#localisedStrings", [
        [ "TrimMessages", "advanced_topics.html#trimMEssages", [
          [ "Code Sample", "advanced_topics.html#autotoc_md166", null ]
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
"class_t_r_i_m_1_1_s_d_k_1_1_agenda_item.html#a13c5f91079e3722634ea26057d5e3573",
"class_t_r_i_m_1_1_s_d_k_1_1_blocked_search_methods_user_options.html",
"class_t_r_i_m_1_1_s_d_k_1_1_classified_security.html#a00c4f5591151da77172be6cd5ea36cfe",
"class_t_r_i_m_1_1_s_d_k_1_1_consignment_creation_options.html#abdbe9515f30bfff38df3c0bf9f2df4d0",
"class_t_r_i_m_1_1_s_d_k_1_1_database.html#a666292e1a7128872a52731cef914a4d4",
"class_t_r_i_m_1_1_s_d_k_1_1_document_queue.html#a3bdc961802cfceb623bf7d56b1747bb5",
"class_t_r_i_m_1_1_s_d_k_1_1_enum.html#a9e03d702ae6bd88646162f4f3eae3ac7",
"class_t_r_i_m_1_1_s_d_k_1_1_external_icon.html#ab51e8c9f4aa34ba0bbb8600a21c1412f",
"class_t_r_i_m_1_1_s_d_k_1_1_field_definition_list.html#abacc898cc1816332319e572c63aba669",
"class_t_r_i_m_1_1_s_d_k_1_1_jurisdiction.html#a6c4a6ff594c05c2fc2123820d69e0f03",
"class_t_r_i_m_1_1_s_d_k_1_1_location_list.html#a62ad9ebe52ae7effacf110f35252f6fe",
"class_t_r_i_m_1_1_s_d_k_1_1_menu_item_list.html#a742f5db6242592a2e35fddf2a9dacf15",
"class_t_r_i_m_1_1_s_d_k_1_1_offline_record.html#a58b06fe7c7d08e8d278aa3c8ced8d161",
"class_t_r_i_m_1_1_s_d_k_1_1_property_def.html#a00d8ee7bdf0b3906977c12d0cfeefdf2",
"class_t_r_i_m_1_1_s_d_k_1_1_record.html#a0c1626ad49dcada27e224b3a8e4502fb",
"class_t_r_i_m_1_1_s_d_k_1_1_record.html#aacdd6932ac58400209ca7e46e22a2fee",
"class_t_r_i_m_1_1_s_d_k_1_1_record_child_actions_enumerator.html",
"class_t_r_i_m_1_1_s_d_k_1_1_record_type.html#a5eb62dc3c25cb55edfee3bd9e60b18cb",
"class_t_r_i_m_1_1_s_d_k_1_1_saved_search.html#a14bec15715378fdbf35943794dbd6ac3",
"class_t_r_i_m_1_1_s_d_k_1_1_search_clause_or_field_def_list.html#a7dd8df5a9ea010a4596b105e3c15e252",
"class_t_r_i_m_1_1_s_d_k_1_1_space.html#af4fb50aa040024af532d20461fe7f2ac",
"class_t_r_i_m_1_1_s_d_k_1_1_trim_aggregate_result_iterator.html#a9fed43dff06625594e42325b680359e8",
"class_t_r_i_m_1_1_s_d_k_1_1_trim_main_object_search.html#a43a37121fd2540295ed7119255f3efc3",
"class_t_r_i_m_1_1_s_d_k_1_1_trim_property_set.html#ab0367e282e500787fef67c44d3da5667",
"class_t_r_i_m_1_1_s_d_k_1_1_trim_u_r_i_list.html",
"class_t_r_i_m_1_1_s_d_k_1_1_workflow_template.html#ae69884528fecebfcdf22a23c605b5268",
"enum_items.html#enum_help_nbrTypes",
"interface_t_r_i_m_1_1_s_d_k_1_1_i_trim_custom_icon.html#a5958a515ebfe2712cfc31b7352125f60",
"namespace_t_r_i_m_1_1_s_d_k.html#a0193b3b41a16f67d107228cdc4c92739a5529d3fbf800d37a7af526f27f2a6519",
"namespace_t_r_i_m_1_1_s_d_k.html#a0193b3b41a16f67d107228cdc4c92739ab2ee912b91d69b435159c7c3f6df7f5f",
"namespace_t_r_i_m_1_1_s_d_k.html#a03fe8e34db7010985558027db56c8650a3d9305ffc3d432f87fda0abd220091b6",
"namespace_t_r_i_m_1_1_s_d_k.html#a0e4c5408f112c9ad4ff69482866645d1aad0519f16d9e373c6035e1a30c40e46f",
"namespace_t_r_i_m_1_1_s_d_k.html#a2647a593d25ac9dad690bd35ebb02f3ea972e73b7a882d0802a4e3a16946a2f94",
"namespace_t_r_i_m_1_1_s_d_k.html#a293d5a937e60b75738eb2577ffa4c237a2c43e239e99a2aa302fb828c9eb2c80d",
"namespace_t_r_i_m_1_1_s_d_k.html#a35514737fb8ab6fd1e825db406ff181bab2e368aa76df0763aeff77af6ceabda2",
"namespace_t_r_i_m_1_1_s_d_k.html#a4ce4ddb7bc7d42f3f7e6d6036227f088acb497f407b7fb5e8e55e074b56416bb4",
"namespace_t_r_i_m_1_1_s_d_k.html#a5757f13ac388303e8800e7ab966b6dbca822476109ed542a5519e3cd35de9d904",
"namespace_t_r_i_m_1_1_s_d_k.html#a5d3ef5f1ed54efc1530ce7ba740c6cefac9494687151097b4cb260c4d811fdf56",
"namespace_t_r_i_m_1_1_s_d_k.html#a6e8c23accbbfd81493674ded41e2e7b7a2faa76b51c287d54b4d22edd79e2655f",
"namespace_t_r_i_m_1_1_s_d_k.html#a753711ce2302f9a98b7fbca2c79cb33ba2f44b1d7cdd17ea0c36cb6df12d06ddb",
"namespace_t_r_i_m_1_1_s_d_k.html#a753711ce2302f9a98b7fbca2c79cb33ba7554996e4bb5f575db3d2b8d669a1130",
"namespace_t_r_i_m_1_1_s_d_k.html#a753711ce2302f9a98b7fbca2c79cb33bac492d633652339317ff4fc7504996600",
"namespace_t_r_i_m_1_1_s_d_k.html#a7a695a17c3750db2f7567606a7cb78fb",
"namespace_t_r_i_m_1_1_s_d_k.html#a8365d4848a1d591c9d414bdcdf180d3fa5f9547af8bc3b57ad356183cb8013fe2",
"namespace_t_r_i_m_1_1_s_d_k.html#a888940a1ccab0e589acaa70241c99fe0a9ec69e35872e698079af6b67f463dfaf",
"namespace_t_r_i_m_1_1_s_d_k.html#aaa854ff5c32b8c96605799da8da55336a2a393ebaa4f1e93d24e880b5dde6bb5d",
"namespace_t_r_i_m_1_1_s_d_k.html#abe38318eb78eed6dc6344ec3eedf4c0ba8f7f4c1ce7a4f933663d10543562b096",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a1262ffbc41533bd8840191cd739a57d9",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a2add33372224b5704a63680310aa09c6",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a46a4dbfc320ea9ddabb062b1c9313428",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a5fc472b3dd22144a8a679109a6c459c9",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a7a233e00e1b07300325b5fb8430a48d1",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394a950fa07d7c43019b1d122971db90d033",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394aaf76d793d3cab8311d9811fa88cdeb00",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394acb82a45937fbe8d69c35cc4d832b7680",
"namespace_t_r_i_m_1_1_s_d_k.html#ac89cda7c5437633dc79a88c21e468394ae933d47f6ff5515b9ed9d3559749edad",
"namespace_t_r_i_m_1_1_s_d_k.html#acbfd2ea579ca7ade1f11c93f89b08a81a826a30a2d22a45bae9fcea53b507428e",
"namespace_t_r_i_m_1_1_s_d_k.html#ae635ab84af4699fa15a34adf5579e979abcfaccebf745acfd5e75351095a5394a",
"namespace_t_r_i_m_1_1_s_d_k.html#af4b6c8ea56bca814a3cd0b3ec065ee06ae12167aa0a7698e6ebc92b4ce3909b53",
"namespace_t_r_i_m_1_1_s_d_k.html#af7e058b1d73a0123587a52d773c2ad6ba6ec50bbec7ba9cf854867916192b4488",
"namespace_t_r_i_m_1_1_s_d_k.html#af7e058b1d73a0123587a52d773c2ad6baed91259d205ca0fb38882e47975730c3",
"programming_guide.html#Creating_a_new_Staff_Member",
"release_notes.html#rn_94_236524"
];

var SYNCONMSG = 'click to disable panel synchronisation';
var SYNCOFFMSG = 'click to enable panel synchronisation';