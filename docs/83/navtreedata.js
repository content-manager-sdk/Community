var NAVTREE =
[
  [ "HPE Content Manager SDK 8.3", "index.html", [
    [ "Welcome to the HPE Content Manager SDK (version 8.3) Documentation", "index.html", null ],
    [ "Supporting Information", "md_doc_00_-_Legal.html", [
      [ "Legal Notices", "md_doc_00_-_Legal.html#legal", [
        [ "Warranty", "md_doc_00_-_Legal.html#warranty", null ],
        [ "Restricted Rights Legend", "md_doc_00_-_Legal.html#restricted_rights", null ],
        [ "Copyright Notice", "md_doc_00_-_Legal.html#copyright", null ]
      ] ],
      [ "Documentation Updates", "md_doc_00_-_Legal.html#doc_updates", null ],
      [ "Support", "md_doc_00_-_Legal.html#support", null ]
    ] ],
    [ "Start here", "start_here.html", [
      [ "Important - Memory Management!", "start_here.html#memory_management", null ],
      [ "Using the HPE Content Manager .NET SDK", "start_here.html#using_the_sdk", [
        [ "Technical Prerequisites and Assumptions", "start_here.html#tech_prereq", null ],
        [ "Binary compatibility", "start_here.html#bin_compat", null ]
      ] ],
      [ "HPE Content Manager .NET SDK", "start_here.html#sdkIntro", null ],
      [ "Using the HPE Content Manager .NET SDK", "start_here.html#usingTheSDK", [
        [ "Technical Prerequisites and Assumptions", "start_here.html#techPrereq", null ],
        [ "Binary compatibility", "start_here.html#binCompat", null ]
      ] ],
      [ "Getting started", "start_here.html#sdkGettingStarted", [
        [ "Creating a reference to the .NET SDK", "start_here.html#createRef", null ],
        [ "Finding assemblies at runtime", "start_here.html#findingAssemblies", null ]
      ] ]
    ] ],
    [ "Programming in HPE Content Manager", "programming_guide.html", [
      [ "Introduction", "programming_guide.html#programming_in", [
        [ "The main objects", "programming_guide.html#main_objects", null ],
        [ "Using the Trim Application object", "programming_guide.html#application_object", null ],
        [ "Using the Database object", "programming_guide.html#database_object", null ]
      ] ],
      [ "Creating and modifying Records", "programming_guide.html#creating_records", [
        [ "Creating new Records", "programming_guide.html#new_record", null ],
        [ "Accessing existing records", "programming_guide.html#access_existing_record", null ],
        [ "Getting a record by record number", "programming_guide.html#get_existing_record", null ],
        [ "Getting a Record by URI", "programming_guide.html#record_by_uri", null ]
      ] ],
      [ "Reading record data", "programming_guide.html#reading_record_data", [
        [ "Basic properties", "programming_guide.html#reading_basic_properties", null ],
        [ "Accessing related objects", "programming_guide.html#related_objects", null ],
        [ "Accessing record Location information", "programming_guide.html#record_Location_info", null ]
      ] ],
      [ "Updating records", "programming_guide.html#updating_records", [
        [ "Modifying properties", "programming_guide.html#modifying_properties", null ],
        [ "Calling update methods", "programming_guide.html#update_methods", null ],
        [ "Updating properties using SetProperty", "programming_guide.html#updating_properties", null ],
        [ "User Defined Fields", "programming_guide.html#update_user_defined_fields", null ]
      ] ],
      [ "Verifying and error trapping", "programming_guide.html#Verifying_and_error_trapping", [
        [ "The Verify method", "programming_guide.html#The_Verify_method", null ],
        [ "The Verified property", "programming_guide.html#The_Verified_property", null ],
        [ "Trapping run-time errors", "programming_guide.html#Trapping_run-time_errors", null ],
        [ "Saving the record to the database", "programming_guide.html#Saving_the_record_to_the_database", null ]
      ] ],
      [ "New records and electronic documents", "programming_guide.html#New_records_and_electronic_documents", [
        [ "Creating a record of a given type", "programming_guide.html#Creating_a_record_of_a_given_type", null ],
        [ "Controlled and free text titling", "programming_guide.html#Controlled_and_free_text_titling", null ],
        [ "Security Levels and Caveats", "programming_guide.html#Security_Levels_and_Caveats", null ],
        [ "Record Locations", "programming_guide.html#Record_Locations", null ],
        [ "Record Contacts", "programming_guide.html#Record_Contacts", null ],
        [ "Creating a Document", "programming_guide.html#Creating_a_Document", null ],
        [ "Titling and numbering", "programming_guide.html#Titling_and_numbering", null ],
        [ "Assigning to a container", "programming_guide.html#Assigning_to_a_container", null ],
        [ "Attaching an electronic document", "programming_guide.html#Attaching_an_electronic_document", null ],
        [ "Document Author", "programming_guide.html#Document_Author", null ]
      ] ],
      [ "Locations", "programming_guide.html#Locations", [
        [ "Finding a Person by Name", "programming_guide.html#Finding_a_Person_by_Name", null ],
        [ "Creating a new Staff Member", "programming_guide.html#Creating_a_new_Staff_Member", null ]
      ] ],
      [ "Searching HPE Content Manager using the .NET SDK", "programming_guide.html#Searching_HPE_Content_Manager", [
        [ "Searching for HPE Content Manager objects", "programming_guide.html#Searching_for_HPE_Records_Manager_objects", null ],
        [ "Specifying the search criteria", "programming_guide.html#Specifying_the_search_criteria", null ],
        [ "Retrieving the results of the search", "programming_guide.html#Retrieving_the_results", null ]
      ] ],
      [ "Other search features", "programming_guide.html#Other_search_features", [
        [ "Persisting a search", "programming_guide.html#Persisting_a_search", null ]
      ] ]
    ] ],
    [ "Access Control", "access_control.html", [
      [ "Access Control Overview", "access_control.html#acl_overview", null ],
      [ "Setting Access Control Locations", "access_control.html#acl_setting_locations", [
        [ "Incorrect way to set the ACL", "access_control.html#acl_incorrect_code_sample", null ],
        [ "Setting the ACL Correctly", "access_control.html#acl_code_sample", null ]
      ] ],
      [ "ACL Enums", "access_control.html#object_acl_enums", [
        [ "List of TrimMainObjects with primary ACL", "access_control.html#object_types_with_acl", null ]
      ] ],
      [ "Code Sample", "access_control.html#object_types_with_acl_ps1", null ]
    ] ],
    [ "Search Clauses", "search_clause_metadata.html", [
      [ "Using Search Clauses", "search_clause_metadata.html#search_clause_using", null ],
      [ "List of search clauses by object type", "search_clause_metadata.html#searcg_clauses_by_object_type", [
        [ "ActionDef", "search_clause_metadata.html#search_clauses_ActionDef", null ],
        [ "Activity", "search_clause_metadata.html#search_clauses_Activity", null ],
        [ "AgendaItem", "search_clause_metadata.html#search_clauses_AgendaItem", null ],
        [ "Alert", "search_clause_metadata.html#search_clauses_Alert", null ],
        [ "Classification", "search_clause_metadata.html#search_clauses_Classification", null ],
        [ "Communication", "search_clause_metadata.html#search_clauses_Communication", null ],
        [ "Consignment", "search_clause_metadata.html#search_clauses_Consignment", null ],
        [ "ConsignmentApprover", "search_clause_metadata.html#search_clauses_ConsignmentApprover", null ],
        [ "ConsignmentIssue", "search_clause_metadata.html#search_clauses_ConsignmentIssue", null ],
        [ "DocumentQueue", "search_clause_metadata.html#search_clauses_DocumentQueue", null ],
        [ "EmailLink", "search_clause_metadata.html#search_clauses_EmailLink", null ],
        [ "FieldDefinition", "search_clause_metadata.html#search_clauses_FieldDefinition", null ],
        [ "History", "search_clause_metadata.html#search_clauses_History", null ],
        [ "Hold", "search_clause_metadata.html#search_clauses_Hold", null ],
        [ "Jurisdiction", "search_clause_metadata.html#search_clauses_Jurisdiction", null ],
        [ "Keyword", "search_clause_metadata.html#search_clauses_Keyword", null ],
        [ "Location", "search_clause_metadata.html#search_clauses_Location", null ],
        [ "LookupItem", "search_clause_metadata.html#search_clauses_LookupItem", null ],
        [ "LookupSet", "search_clause_metadata.html#search_clauses_LookupSet", null ],
        [ "Meeting", "search_clause_metadata.html#search_clauses_Meeting", null ],
        [ "MeetingType", "search_clause_metadata.html#search_clauses_MeetingType", null ],
        [ "MinuteItem", "search_clause_metadata.html#search_clauses_MinuteItem", null ],
        [ "MinuteItemType", "search_clause_metadata.html#search_clauses_MinuteItemType", null ],
        [ "Notification", "search_clause_metadata.html#search_clauses_Notification", null ],
        [ "OfflineRecord", "search_clause_metadata.html#search_clauses_OfflineRecord", null ],
        [ "Origin", "search_clause_metadata.html#search_clauses_Origin", null ],
        [ "OriginHistory", "search_clause_metadata.html#search_clauses_OriginHistory", null ],
        [ "Record", "search_clause_metadata.html#search_clauses_Record", null ],
        [ "RecordAction", "search_clause_metadata.html#search_clauses_RecordAction", null ],
        [ "RecordType", "search_clause_metadata.html#search_clauses_RecordType", null ],
        [ "Report", "search_clause_metadata.html#search_clauses_Report", null ],
        [ "Request", "search_clause_metadata.html#search_clauses_Request", null ],
        [ "SavedSearch", "search_clause_metadata.html#search_clauses_SavedSearch", null ],
        [ "Schedule", "search_clause_metadata.html#search_clauses_Schedule", null ],
        [ "ScheduledTask", "search_clause_metadata.html#search_clauses_ScheduledTask", null ],
        [ "SearchForm", "search_clause_metadata.html#search_clauses_SearchForm", null ],
        [ "SecurityCaveat", "search_clause_metadata.html#search_clauses_SecurityCaveat", null ],
        [ "SecurityLevel", "search_clause_metadata.html#search_clauses_SecurityLevel", null ],
        [ "SharePointItem", "search_clause_metadata.html#search_clauses_SharePointItem", null ],
        [ "Space", "search_clause_metadata.html#search_clauses_Space", null ],
        [ "TodoItem", "search_clause_metadata.html#search_clauses_TodoItem", null ],
        [ "UserLabel", "search_clause_metadata.html#search_clauses_UserLabel", null ],
        [ "Workflow", "search_clause_metadata.html#search_clauses_Workflow", null ],
        [ "WorkflowTemplate", "search_clause_metadata.html#search_clauses_WorkflowTemplate", null ],
        [ "ZipCode", "search_clause_metadata.html#search_clauses_ZipCode", null ]
      ] ]
    ] ],
    [ "Advanced Topics", "advanced_topics.html", [
      [ "Different ways to fetch a TrimMainObject", "advanced_topics.html#ways_To_Fetch_a_TrimMainObject", [
        [ "Object Constructor by Name", "advanced_topics.html#fetch_by_constructorand_name", null ],
        [ "Object name properties", "advanced_topics.html#object_name_properties", null ],
        [ "Database Find Methods", "advanced_topics.html#fetch_by_database", null ],
        [ "TrimMainObjectSearch", "advanced_topics.html#fetch_by_search", null ]
      ] ],
      [ "Document access alternatives", "advanced_topics.html#fetchDoc", [
        [ "Overview", "advanced_topics.html#doc_access_overview", null ],
        [ "Record.GetDocument", "advanced_topics.html#getDoc", null ],
        [ "DocumentPathInClientCache", "advanced_topics.html#clientCache", null ],
        [ "DocumentPathInWGSCache", "advanced_topics.html#wgsCache", null ],
        [ "DocumentStream", "advanced_topics.html#docStream", null ]
      ] ]
    ] ],
    [ "Packages", null, [
      [ "Packages", "namespaces.html", "namespaces" ],
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
        [ "Properties", "functions_prop.html", "functions_prop" ]
      ] ]
    ] ]
  ] ]
];

var NAVTREEINDEX =
[
"access_control.html",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_agenda_item.html#aa0436ce2ba97f943b98a8204c6286de1",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_classified_security.html#ae834c15c3f90bad65e3f9b20b92099a9",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_database.html#a56c9f7a44bda0547d7160fe87759aef8",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_document_queue.html#a81f1c9b78e2d83c48fefdba3399bfe1a",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_enum_item_list_1_1_enum_item_list_enumerator.html",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_i_trim_add_in_base.html#aeb2a70e57e1bab40b20c1bfc531286aa",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_location.html#ad3d5805652fab7caa46bfa4119fe7696",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_meeting_type.html#aa9d3cbc404c1145a7635f5ece0e2a345",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_offline_record.html#a848e67109e286c9967cb2884d3c1f5e1",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_property_or_field_def_list.html#a65e7dd12ab337888180f078ed722845c",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_record.html#a6950ef00c6825f4418c2972256dc850d",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_record_client_matter_parties.html#aa1d2fbccf298f3b95a299fd3f57b5b81",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_record_type.html#a8a51ca0cbbbb777dd986449a3f12bb9c",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_scheduled_task.html#a55cc2ef1c7acc2c92955276b80cb329c",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_sort_and_filter_user_options.html#a41c78d99a0250187c6ac474c76bb2cf2",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_trim_currency.html#a956207338ed4dc89a869a9f1c654c0d0",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_trim_menu_link_list.html#a9cd5c3d21c1f48ba71cfddcbc0ec6823",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_trim_search_stack_item_list.html#a5d33b12b76fcc420b2d49aab6f172a2f",
"class_h_p_1_1_h_p_t_r_i_m_1_1_s_d_k_1_1_workflow_template.html#a3977e3221f251d4945ae551427149c71",
"programming_guide.html#Searching_for_HPE_Records_Manager_objects"
];

var SYNCONMSG = 'click to disable panel synchronisation';
var SYNCOFFMSG = 'click to enable panel synchronisation';