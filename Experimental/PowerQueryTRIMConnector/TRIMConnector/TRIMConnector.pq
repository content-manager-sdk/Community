// This file contains your Data Connector logic

section TRIMConnector;


PAGE_SIZE = 100;

[DataSource.Kind="TRIMConnector", Publish="TRIMConnector.Publish"]
shared TRIMConnector.Search = Value.ReplaceType(TRIMConnector.Go, TRIMConnector.GoType);
//shared TRIMSearchConnector.Search = (serviceUrl as text, optional objectType as text, optional searchString as text) => TRIMConnector.Go(serviceUrl, objectType, searchString) as table;


//[DataSource.Kind="TRIMConnector", Publish="TRIMConnector.Publish"]
shared TRIMConnector.Browse = (url) => TrimNavTable(url) as table;

TRIMConnector.Feed = (url as text, schema as table, onePageOnly as logical, options as record, searchString as text) as table => GetAllPagesByNextLink(url, options, schema, onePageOnly, searchString);


RefTrimMainObjectType = type nullable [
    NameString = text,
    ToolTip = text,
    TrimType = text,
    Uri = number
];

RefLocationType = type  [
    LocationInternetMailAddress = text,
    LocationLogsInAs = text, 
    LocationAdditionalLogin = text, 
    LocationSortName = text,
    Uri = number,
    LocationFullFormattedName = text
];

GetSearchClauseDefs =  (baseUrl as text, entity as text) as table =>  
    let
        Source = Json.Document(Web.Contents(baseUrl & "SearchClauseDef?TrimType=" & entity & "&format=json")),
        SearchClauseDefs = Source[SearchClauseDefs],
        #"Converted to Table" = Table.FromList(SearchClauseDefs, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
        #"Expanded Column1" = Table.ExpandRecordColumn(#"Converted to Table", "Column1", {"BasedOnProperty", "OnlyForType", "InternalName", "Name", "Id", "CanSort", "ObjectTypeParameter", "IsBlocked"}, {"Column1.BasedOnProperty", "Column1.OnlyForType", "Column1.InternalName", "Column1.Name", "Column1.Id", "Column1.CanSort", "Column1.ObjectTypeParameter", "Column1.IsBlocked"}),
        #"Renamed Columns" = Table.TransformColumnNames(#"Expanded Column1", each Text.Replace(_, "Column1.", ""))
    in
        #"Renamed Columns";


GetPropertyDefinitions = (baseUrl as text, entity as text) as table =>  
    let
        Source = Json.Document(Web.Contents(baseUrl & "PropertyDefs?TrimType=" & entity & "&Get=All&ExcludeFields=false&format=json")),
        PropertiesAndFields =  Source[PropertiesAndFields],
        Record = Record.Field(PropertiesAndFields, entity),
        #"Converted to Table" = Table.FromList(Record, Splitter.SplitByNothing(), null, null, ExtraValues.Error)
       
    in
        #"Converted to Table";

GetPropertyDefinitionsTable = (baseUrl as text, entity as text) as table =>  
    let
        #"Converted to Table" = GetPropertyDefinitions(baseUrl, entity),
        #"Expanded Column1" = Table.ExpandRecordColumn(#"Converted to Table", "Column1", {"Id", "SortMode", "ObjectType", "PFFormat", "Property", "PropertyId", "IsAField", "IsAProperty", "IsMandatory", "Field"}, {"Column1.Id", "Column1.SortMode", "Column1.ObjectType", "Column1.PFFormat", "Column1.Property", "Column1.PropertyId", "Column1.IsAField", "Column1.IsAProperty", "Column1.IsMandatory", "Column1.Field"}),
        #"Renamed Columns" = Table.TransformColumnNames(#"Expanded Column1", each Text.Replace(_, "Column1.", "")),
        #"Sorted Rows" = Table.Sort(#"Renamed Columns",{{"IsAField", Order.Ascending}, {"Id", Order.Ascending}}),
        #"Expanded Property" = Table.ExpandRecordColumn(#"Sorted Rows", "Property", {"SearchClauseId"}, {"SearchClauseId"}),
        #"Removed Columns" = Table.RemoveColumns(#"Expanded Property",{"Field"})
    in
        #"Removed Columns";


GetTypeRecord = (baseUrl as text, entity as text) as table => 
    let
        #"Converted to Table" = GetPropertyDefinitions(baseUrl, entity),
        #"Expanded Column1" = Table.ExpandRecordColumn(#"Converted to Table", "Column1", {"Id", "PFFormat", "ObjectType"}, {"Column1.Id", "Column1.PFFormat", "Column1.ObjectType"}),
        #"Added Custom" = Table.AddColumn(#"Expanded Column1", "Type", each 
        if [Column1.PFFormat] = "Object" and [Column1.ObjectType] = "Location" then
            RefLocationType else 
        if [Column1.PFFormat] = "Object" then
            RefTrimMainObjectType else   
        if List.Contains({"Number", "BigNumber", "Decimal", "Currency"}, [Column1.PFFormat]) then
            type number else  
        if [Column1.PFFormat] = "Datetime" then
            type datetime else  
        if [Column1.PFFormat] = "Date" then
            type date else 
        if [Column1.PFFormat] = "Boolean" then
            type logical else                 
        type text
),
        #"Added Custom1" = Table.AddColumn(#"Added Custom", "Value", each type nullable [pType]),
        #"Renamed Columns" = Table.RenameColumns(#"Added Custom1",{{"Column1.Id", "Name"}}),
        #"Type Table" = #table({"Name", "Type"}, {}),
         #"Type Table with Name" = Table.SelectColumns(#"Renamed Columns", {"Name", "Type"}),
        #"Table to Record" = Record.FromTable(#"Renamed Columns"),
        _ex = Diagnostics.LogValue("Table to Record: ", #"Type Table with Name")
    in
        _ex;
        //#"Table to Record";

GetSearchClause = (baseUrl as text, entity as text, propertyId as text) as text =>
    let
        PropertyDefs = GetPropertyDefinitionsTable(baseUrl, entity),
        SearchClauseDefs = GetSearchClauseDefs(baseUrl, entity),
        SearchClause = SearchClauseDefs{[BasedOnProperty=propertyId]},
        SortClause = if SearchClause <> null and SearchClause[CanSort] = true then SearchClause[InternalName] else "",
        SearchClauseId = if PropertyDefs{[Id=propertyId]}[IsAField] = true then propertyId else SortClause
    in
        SearchClauseId;


SchemaTable = #table({"Entity"}, {
    {"Record"}, {"Location"}, {"Activity"}, {"Classification"}, {"History"}, {"RecordType"}, {"Schedule"}, {"Space"}
});

GetSchemaForEntity = (baseUrl as text, entity as text) as table => GetTypeRecord(baseUrl, entity);

TRIMConnector.GoType = type function (
    baseUrl as (Uri.Type meta [
        Documentation.FieldCaption = "ServiceAPI URL",
        Documentation.FieldDescription = "URL to your ServiceAPI URL",
        
        Documentation.SampleValues = {"http://MyServer/ServiceAPI/"}
    ]),
    optional entity as (type text meta [
        Documentation.FieldCaption = "Object Type",
        Documentation.FieldDescription = "Select if you wish to search by object type, otherwise leave blank to browse.",
        Documentation.AllowedValues = Table.Column(SchemaTable, "Entity")
    ]),
    optional searchString as (type text meta [
        Documentation.FieldCaption = "Search string",
        Documentation.FieldDescription = "A search string if you wish to search, otherwise leave blank to browse.",
        Documentation.SampleValues = {"favorite", "container:123"}
    ]))
    as table meta [    
        Documentation.Name = "Content Manager",
        Documentation.LongDescription = "Query data from Content Manager"       
    ];



TRIMConnector.Go = (baseUrl, optional entity as text, optional searchString as text) as table =>
    let
       ulrWithTrailingSlash = if Text.EndsWith(baseUrl, "/") then baseUrl else baseUrl & "/",
        go = 
            if entity = null or searchString = null then
                TrimNavTable(ulrWithTrailingSlash)
            else 
                TRIMConnector.View(ulrWithTrailingSlash, entity, searchString)
    in
        go;


genSavedSearchNav = (baseUrl as text, entity as text) as table => 
    let 
        Source = Json.Document(Web.Contents( Uri.Combine(baseUrl, "SavedSearch") & "?q=srhType=" & entity & " and (srhOwner:[default:me] or srhPublic) and not srhGroup&format=json&properties=SavedSearchFullName&pageSize=1000")),
        Results = Source[Results],
        #"Converted to Table" = Table.FromList(Results, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
        
        #"Expanded Column1" = Table.ExpandRecordColumn(#"Converted to Table", "Column1", {"SavedSearchFullName", "Uri"}, {"Name", "Key"}),
        #"Column Transformations" = List.Transform({"Name", "Key"}, each {_, FriendlyRowValues}),
		#"Transformed Values" = Table.FromRecords(Table.TransformRows(#"Expanded Column1", (row) => Record.TransformFields(row, #"Column Transformations"))),
        withData = Table.AddColumn(#"Transformed Values", "Data", each TRIMConnector.View(baseUrl, entity, Text.Format("unkSaved:#{0}",{[Key]})), type table),
        withItemKind = Table.AddColumn(withData, "ItemKind", each "Folder", type text),
        withIsLeaf = Table.AddColumn(withItemKind, "IsLeaf", each false, type logical),
        #"Check for Null" = if List.IsEmpty(Results) then #table({"Key", "Name", "Data", "ItemKind", "ItemName", "IsLeaf"}, {}) else withIsLeaf,
        navTable = Table.ToNavigationTable(#"Check for Null", {"Key"}, "Name", "Data", "ItemKind", "ItemName", "IsLeaf")
    in navTable;


genNavColumn = (url as text, entity as text) as table => 
    let 
        objects = #table(
            {"Key", "Name", "Data", "ItemKind", "ItemName", "IsLeaf"},
            {{entity & "SavedSearches", "Saved Searches", genSavedSearchNav(url, entity), "Folder",    "Folder",    false}}),
        supplemented = 
            if List.Contains({"Record", "Location", "Classification"}, entity) then
                Table.InsertRows(objects, 0, {
               [Key = entity & "Favorites", Name = "Favorites", Data = TRIMConnector.View(url, entity, "unkFavorite"), ItemKind = "Table", ItemName = "Table", IsLeaf = true ]
                })
            else
                objects,

        NavTable = Table.ToNavigationTable(supplemented, {"Key"}, "Name", "Data", "ItemKind", "ItemName", "IsLeaf")
    in
        NavTable;

TrimNavTable = (url as text) as table =>
    let
        entities = Table.SelectColumns(SchemaTable, {"Entity"}),
        rename = Table.RenameColumns(entities, {{"Entity", "Name"}}),
        // Add Data as a calculated column
        //withData = Table.AddColumn(rename, "Data", each TRIMConnector.View(url, [Name], "unkAll"), type table),
        withData = Table.AddColumn(rename, "Data", each genNavColumn(url, [Name]), type table),
        // Add ItemKind and ItemName as fixed text values
        withItemKind = Table.AddColumn(withData, "ItemKind", each "Folder", type text),
        withItemName = Table.AddColumn(withItemKind, "ItemName", each "Folder", type text),
        // Indicate that the node should not be expandable
        withIsLeaf = Table.AddColumn(withItemName, "IsLeaf", each false, type logical),
      //  withFunction = Table.InsertRows(withIsLeaf, 0, {[Name = "Myfunction", Data = TRIMSearchConnector.Search, ItemKind = "Function", ItemName = "Function", IsLeaf = true ]}),
        //withFunction = Table.InsertRows(withIsLeaf, 0, {[Name = "Myfunction", Data = TRIMConnector.Feed, ItemKind = "Function", ItemName = "Function", IsLeaf = true ]}),
        // Generate the nav table
        navTable = Table.ToNavigationTable(withIsLeaf, {"Name"}, "Name", "Data", "ItemKind", "ItemName", "IsLeaf")
    in
        navTable;


GetPage = (url as text, query as record, schema as table) =>
	let	 
        propsColumn = Table.SelectColumns(schema, "Name"),
        existingColumns = Table.ToList(propsColumn),

        #"Options with Page Size" = if Record.HasFields(query, "pageSize") then query else query & [pageSize = Text.From(PAGE_SIZE)],

		options = [
            Headers=[#"Accept"="application/json", #"Content-Type"="application/json"], 
            Content= Json.FromValue(#"Options with Page Size")
        ],
        
		source = Json.Document(Web.Contents( url, options)),		
        results = source[Results],
       
        #"Converted to Table" = Table.FromList(results, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
        CheckEmpty = if Table.IsEmpty(#"Converted to Table") then #table(type table[Column1 = [Uri = number]],{}) else #"Converted to Table",
		#"Expanded Column1" = Table.ExpandRecordColumn(CheckEmpty, "Column1", existingColumns),        
		dd = List.Transform(existingColumns, each {_, FriendlyRowValues}),
		pp = Table.FromRecords(Table.TransformRows(#"Expanded Column1", (row) => Record.TransformFields(row, dd))),
        hasMoreItems = GetHasMoreItems(source)

in
	 pp meta [HasMoreItems = hasMoreItems, LastStart = query[start]?];




// Data Source Kind description
TRIMConnector = [
    TestConnection = (dataSourcePath) => {"TRIMConnector.Search", dataSourcePath},
    Authentication = [
        // Key = [],
         UsernamePassword = [],
         Windows = [],
        Implicit = []
    ],
    Label = Extension.LoadString("DataSourceLabel")
];



Table.ToNavigationTable = (
    table as table,
    keyColumns as list,
    nameColumn as text,
    dataColumn as text,
    itemKindColumn as text,
    itemNameColumn as text,
    isLeafColumn as text
) as table =>
    let
        tableType = Value.Type(table),
        newTableType = Type.AddTableKey(tableType, keyColumns, true) meta 
        [
            NavigationTable.NameColumn = nameColumn, 
            NavigationTable.DataColumn = dataColumn,
            NavigationTable.ItemKindColumn = itemKindColumn, 
            Preview.DelayColumn = itemNameColumn, 
            NavigationTable.IsLeafColumn = isLeafColumn
        ],
        navigationTable = Value.ReplaceType(table, newTableType)
    in
        navigationTable;

// The getNextPage function takes a single argument and is expected to return a nullable table
shared Table.GenerateByPage = (getNextPage as function) as table =>
    let        
        listOfPages = List.Generate(
            () => getNextPage(null),            // get the first page of data
            (lastPage) => lastPage <> null,     // stop when the function returns null
            (lastPage) => getNextPage(lastPage) // pass the previous page to the next function call
        ),
        // concatenate the pages together
        tableOfPages = Table.FromList(listOfPages, Splitter.SplitByNothing(), {"Column1"}),
        firstRow = tableOfPages{0}?
    in
        // if we didn't get back any pages of data, return an empty table
        // otherwise set the table type based on the columns of the first page
        if (firstRow = null) then
            Table.FromRows({})
        else        
            Value.ReplaceType(
                Table.ExpandTableColumn(tableOfPages, "Column1", Table.ColumnNames(firstRow[Column1])),
                Value.Type(firstRow[Column1])
            );


GetAllPagesByNextLink = (url as text, options as record, schema as table, onePageOnly as logical, searchString as text) as table =>
    Table.GenerateByPage((previous) => 
        let
            // if previous is null, then this is our first page of data
            newOptions = options & [start = if (previous = null) then options[start] else if Value.Metadata(previous)[HasMoreItems] = false then 0 else Number.FromText(Value.Metadata(previous)[LastStart])+PAGE_SIZE],
            // if NextLink was set to null by the previous call, we know we have no more data
            page = 
                if previous <> null and onePageOnly = true then null
                else if (newOptions[start] > 0) then GetPage(url, options, schema) 
                else null
        in
            page
    );

GetHasMoreItems = (response) as logical => Record.FieldOrDefault(response, "HasMoreItems");


// Data Source UI publishing description
TRIMConnector.Publish = [
    Beta = true,
    Category = "Other",
    ButtonText = { Extension.LoadString("ButtonTitle"), Extension.LoadString("ButtonHelp") },
    LearnMoreUrl = "https://powerbi.microsoft.com/",
    SourceImage = TRIMConnector.Icons,
    SourceTypeImage = TRIMConnector.Icons
];

TRIMConnector.Icons = [
    Icon16 = { Extension.Contents("TRIMConnector16.png"), Extension.Contents("TRIMConnector20.png"), Extension.Contents("TRIMConnector24.png"), Extension.Contents("TRIMConnector32.png") },
    Icon32 = { Extension.Contents("TRIMConnector32.png"), Extension.Contents("TRIMConnector40.png"), Extension.Contents("TRIMConnector48.png"), Extension.Contents("TRIMConnector64.png") }
];

FriendlyRowValues = (row) =>
	let
        rowRecordTypeTmo = Type.RecordFields(RefTrimMainObjectType),
        tmoColumns = Record.FieldNames(rowRecordTypeTmo),
                    
        rowRecordType = Type.RecordFields(RefLocationType),
        locationColumns = Record.FieldNames(rowRecordType),

       	refMainObjectFieldTransformations = List.Transform(tmoColumns, each {_, FriendlyRowValues}),
        refLocationFieldTransformations = List.Transform(locationColumns, each {_, FriendlyRowValues}),
		v = 
            if Value.Type(row) = type text then row else
            if Value.Type(row) = type number then row else
            if row is null then
                null
            else if Record.HasFields(row, "TrimType") and row[TrimType] = "Location" then
                Record.TransformFields(row, refLocationFieldTransformations)
            else if Record.HasFields(row, "TrimType")  then
                Record.TransformFields(row, refMainObjectFieldTransformations)
			else if Record.HasFields(row, "Value") then
				row[Value]?
			else if Record.HasFields(row, "IsTimeClear") then
				row[DateTime]?
			else
				row
	in
		v;


TRIMConnector.View = (baseUrl as text, entity as text, optional searchString as text) as table =>
    let
        // Implementation of Table.View handlers.
        //
        // We wrap the record with Diagnostics.WrapHandlers() to get some automatic
        // tracing if a handler returns an error.
        //
        View = (state as record) => Table.View(null, Diagnostics.WrapHandlers([
            // Returns the table type returned by GetRows()
            GetType = () => 
                let
                    finalSchema = CalculateSchema(state),



                    #"Empty Table" = #table({},{}),
                    #"With Schema" =  SchemaTransformTable(#"Empty Table", finalSchema),
                    #"Type" = Value.Type(#"With Schema")
                in
                       #"Type",
            // Called last - retrieves the data from the calculated URL
            GetRows = () => 
                let
                    finalSchema = CalculateSchema(state),
                    finalUrl = CalculateUrl(state),
                    finalOptions = CalculateOptions(state), 

                    optionsWithTop = finalOptions & [start = if state[Skip]? <> null then state[Skip]+1 else 1],
                    result = TRIMConnector.Feed(finalUrl, finalSchema, state[Top]? <> null, optionsWithTop, searchString),


                     withSchema = if (finalSchema <> null) then SchemaTransformTable(result, finalSchema) else result
                in
                    withSchema,

           GetRowCount = () as number =>
                    let
                        finalUrl = CalculateCountUrl(state),
                        _finalUrl = Diagnostics.LogValue("GetRowCount finalUrl", finalUrl),
                        value = TRIMConnector.Atomic(_finalUrl)                        
                    in
                        value,

            // OnTake - handles the Table.FirstN transform, limiting
            // the maximum number of rows returned in the result set.
            // The count value should be >= 0.
            OnTake = (count as number) =>
                let
                    newState = state & [ Top = count ]
                in
                    @View(newState),
 
             // OnSkip - handles the Table.Skip transform.
            // The count value should be >= 0.
            OnSkip = (count as number) =>
                let
                    newState = state & [ Skip = count ]
                in
                    @View(newState),

            OnSelectColumns = (columns as list) =>
                let
                    // get the current schema
                    currentSchema = GetSchemaForEntity(UlrWithTrailingSlash(state), entity),
                    newSchema = Table.SelectRows(currentSchema, each List.Contains(columns, [Name]))
                in
                    @View(state & 
                        [ 
                            SelectColumns = columns,
                            Schema = newSchema
                        ]
                    ),
                // OnSort - receives a list of records containing two fields: 
                //    [Name]  - the name of the column to sort on
                //    [Order] - equal to Order.Ascending or Order.Descending
                // If there are multiple records, the sort order must be maintained.
                //
                // OData allows you to sort on columns that do not appear in the result
                // set, so we do not have to validate that the sorted columns are in our 
                // existing schema.
                OnSort = (order as list) =>
                    let
                        // This will convert the list of records to a list of text,
                        // where each entry is "<columnName> <asc|desc>"
                        sorting = List.Transform(order, (o) => 
                            let
                                column = GetSearchClause(UlrWithTrailingSlash(state), entity, o[Name]),
                                order = o[Order],
                                orderText = if (order = Order.Ascending) then "" else "-"
                            in
                                if column <> "" then column & orderText else null
                        ),
                        orderBy =  Text.Combine(List.RemoveNulls(sorting), ", ")
                    in
                        @View(state & [ OrderBy = orderBy ]),
            //
            // Helper functions
            //
            // Retrieves the cached schema. If this is the first call
            // to CalculateSchema, the table type is calculated based on
            // the entity name that was passed into the function.
            CalculateSchema = (state) as table =>
                if (state[Schema]? = null) then
                    GetSchemaForEntity(UlrWithTrailingSlash(state), entity)
                else
                    state[Schema],

            CalculateExistingColumns = () as list =>
                let                    
                     currentSchema = CalculateSchema(state),
                    // get the columns from the current schema (which is an M Type value)
                    rowRecordType = Table.Column(currentSchema, "Name")
                in
                    rowRecordType,

            CalculateCountUrl = (state) as text => 
                 let
                    ulrWithTrailingSlash = UlrWithTrailingSlash(state),
                    urlWithEntity = Uri.Combine(ulrWithTrailingSlash, state[Entity]),
                    defaultQueryString = [ resultsOnly = "true", q = searchString, CountResults="true"],
                    encodedQueryString = Uri.BuildQueryString(defaultQueryString),
                    finalUrl = urlWithEntity & "?" & encodedQueryString
                in
                    finalUrl,
            UlrWithTrailingSlash = (state) as text => 
                 let
                    ulrWithTrailingSlash = if Text.EndsWith(state[Url], "/") then state[Url] else state[Url] & "/"
                in
                    ulrWithTrailingSlash,
            // Calculates the final URL based on the current state.
            CalculateUrl = (state) as text => 
                let
                    ulrWithTrailingSlash = UlrWithTrailingSlash(state),
                    urlWithEntity = Uri.Combine(ulrWithTrailingSlash, "Search")

                in
                    urlWithEntity,
            CalculateOptions = (state) as record => 
                let
                   propsColumn = Table.SelectColumns(CalculateSchema(state), "Name"),
                   existingColumns = Table.ToList(propsColumn),
                    // Uri.BuildQueryString requires that all field values
                    // are text literals.

                     rowRecordTypeTmo = Type.RecordFields(RefTrimMainObjectType),
                     tmoColumns = Record.FieldNames(rowRecordTypeTmo),
                    
                     rowRecordType = Type.RecordFields(RefLocationType),
                     locationColumns = Record.FieldNames(rowRecordType),                     

                     allProps = List.Distinct(List.Combine({locationColumns, tmoColumns})),

                    defaultQueryString = [TrimType=state[Entity], resultsOnly = "true", q = searchString, descendantProperties = Text.Combine(allProps, ",")],
                    _defaultQueryString = Diagnostics.LogValue("defaultQueryString: ",defaultQueryString),


                    // Check for Top defined in our state
                    qsWithTop =
                        if (state[Top]? <> null) then
                            // add a $top field to the query string record
                            _defaultQueryString & [ #"pageSize" = Number.ToText(if state[Top] = 0 then -1 else state[Top]), #"start" = "1" ]
                        else
                            _defaultQueryString,

                    qsWithSkip = 
                        if (state[Skip]? <> null) then
                            qsWithTop & [ #"start" = Number.ToText(state[Skip] + 1) ]
                        else
                            qsWithTop,
                    qsWithSelect =
                        if (state[SelectColumns]? <> null) then
                            qsWithSkip & [ #"properties" = Text.Combine(state[SelectColumns], ",") ]
                        else
                            qsWithSkip& [ #"properties" = "Uri" ],
                    qsWithOrderBy = 
                        if (state[OrderBy]? <> null) then
                            qsWithSelect & [ #"sortBy" = state[OrderBy] ]
                        else
                            qsWithSelect
                in
                    qsWithOrderBy
        ]))
    in
        View([Url = baseUrl, Entity = entity]);


TRIMConnector.Atomic = (url as text) as number =>
    let
        _url = Diagnostics.LogValue("TripPin.Scalar url", url),

        headers = [
            #"Accept" = "application/json"
        ],

        response = Web.Contents(_url, [ Headers = headers ]),
        source = Json.Document(response),		
        fieldVal = source[Count]
    in
        fieldVal;


EnforceSchema.Strict = 1;               // Add any missing columns, remove extra columns, set table type
EnforceSchema.IgnoreExtraColumns = 2;   // Add missing columns, do not remove extra columns
EnforceSchema.IgnoreMissingColumns = 3; // Do not add or remove columns

SchemaTransformTable = (table as table, schema as table, optional enforceSchema as number) as table =>
    let
        // Default to EnforceSchema.Strict
        _enforceSchema = if (enforceSchema <> null) then enforceSchema else EnforceSchema.Strict,

        // Applies type transforms to a given table
        EnforceTypes = (table as table, schema as table) as table =>
            let
                map = (t) => if Type.Is(t, type list) or Type.Is(t, type record) or t = type any then null else t,
                mapped = Table.TransformColumns(schema, {"Type", map}),
                omitted = Table.SelectRows(mapped, each [Type] <> null),
                existingColumns = Table.ColumnNames(table),
                removeMissing = Table.SelectRows(omitted, each List.Contains(existingColumns, [Name])),
                primativeTransforms = Table.ToRows(removeMissing),
                changedPrimatives = Table.TransformColumnTypes(table, primativeTransforms)
            in
                changedPrimatives,

        // Returns the table type for a given schema
        SchemaToTableType = (schema as table) as type =>
            let
                toList = List.Transform(schema[Type], (t) => [Type=t, Optional=false]),
                toRecord = Record.FromList(toList, schema[Name]),
                toType = Type.ForRecord(toRecord, false)
            in
                type table (toType),

        // Determine if we have extra/missing columns.
        // The enforceSchema parameter determines what we do about them.
        schemaNames = schema[Name],
        foundNames = Table.ColumnNames(table),
        addNames = List.RemoveItems(schemaNames, foundNames),
        extraNames = List.RemoveItems(foundNames, schemaNames),
        tmp = Text.NewGuid(),
        added = Table.AddColumn(table, tmp, each []),
        expanded = Table.ExpandRecordColumn(added, tmp, addNames),
        result = if List.IsEmpty(addNames) then table else expanded,
        fullList =
            if (_enforceSchema = EnforceSchema.Strict) then
                schemaNames
            else if (_enforceSchema = EnforceSchema.IgnoreMissingColumns) then
                foundNames
            else
                schemaNames & extraNames,

        // Select the final list of columns.
        // These will be ordered according to the schema table.
        reordered = Table.SelectColumns(result, fullList, MissingField.Ignore),
        enforcedTypes = EnforceTypes(reordered, schema),
        withType = if (_enforceSchema = EnforceSchema.Strict) then Value.ReplaceType(enforcedTypes, SchemaToTableType(schema)) else enforcedTypes
    in
        withType;


// 
// Load common library functions
// 
// TEMPORARY WORKAROUND until we're able to reference other M modules
Extension.LoadFunction = (name as text) =>
    let
        binary = Extension.Contents(name),
        asText = Text.FromBinary(binary)
    in
        Expression.Evaluate(asText, #shared);

Table.ChangeType = Extension.LoadFunction("Table.ChangeType.pqm");
Diagnostics = Extension.LoadFunction("Diagnostics.pqm");
Diagnostics.LogValue = Diagnostics[LogValue];
Diagnostics.LogFailure = Diagnostics[LogFailure];
Diagnostics.WrapHandlers = Diagnostics[WrapHandlers];


