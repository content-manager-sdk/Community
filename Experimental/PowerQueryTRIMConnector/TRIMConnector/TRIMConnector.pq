section TRIMConnector;


PAGE_SIZE = 500;

[DataSource.Kind="TRIMConnector", Publish="TRIMConnector.Publish"]
shared TRIMConnector.Search = Value.ReplaceType(TRIMConnector.Go, TRIMConnector.GoType);

TRIMConnector.Feed = (url as text, schema as type, onePageOnly as logical, options as record, searchString as text) as table => GetAllPagesByNextLink(url, options, schema, onePageOnly, searchString);

RefTrimMainObjectType = type [
    NameString = nullable text,
    TrimType = nullable text,
    Uri = number
];

RefLocationType = type nullable [
    LocationLogsInAs = text, 
    LocationAdditionalLogin = text, 
    NameString = text,
    Uri = number
];

GetSearchClauseDefs =  (baseUrl as text, savedSearchDetails) as table =>  
    let
        Source = Json.Document(Web.Contents(baseUrl & "SearchClauseDef?TrimType=" & savedSearchDetails[trimType] & "&format=json")),

        SearchClauseDefs = Source[SearchClauseDefs],
        convertedToTable = Table.FromList(SearchClauseDefs, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
        expandedColumn1 = Table.ExpandRecordColumn(convertedToTable, "Column1", {"BasedOnProperty", "OnlyForType", "InternalName", "Name", "Id", "CanSort", "ObjectTypeParameter", "IsBlocked"}, {"Column1.BasedOnProperty", "Column1.OnlyForType", "Column1.InternalName", "Column1.Name", "Column1.Id", "Column1.CanSort", "Column1.ObjectTypeParameter", "Column1.IsBlocked"}),
        renamedColumns = Table.TransformColumnNames(expandedColumn1, each Text.Replace(_, "Column1.", ""))
    in
        renamedColumns;


GetPropertyDefinitions = (baseUrl as text, savedSearchDetails as record) as table =>  
    let        
        PropertiesAndFields =  GetPropertyList(baseUrl, savedSearchDetails),

        Record = Record.Field(PropertiesAndFields, savedSearchDetails[trimType]),
        convertedToTable = Table.FromList(Record, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
        expandedColumn1 = Table.ExpandRecordColumn(convertedToTable, "Column1", {"Id", "PFFormat", "ObjectType", "Property", "IsAField"}, {"Column1.Id", "Column1.PFFormat", "Column1.ObjectType", "Column1.Property", "Column1.IsAField"}),
        filteredRows = Table.SelectRows(expandedColumn1, each [Column1.IsAField] = true or Record.Field([Column1.Property], "IsExposedInSDK") = true)
    in
        filteredRows;

GetPropertyDefinitionsTable = (baseUrl as text, savedSearchDetails as record) as table =>  
    let
        convertedToTable = GetPropertyDefinitions(baseUrl, savedSearchDetails),
      
        renamedColumns = Table.TransformColumnNames(convertedToTable, each Text.Replace(_, "Column1.", "")),
        sortedRows = Table.Sort(renamedColumns,{{"IsAField", Order.Ascending}, {"Id", Order.Ascending}}),        
        expandedProperty = Table.ExpandRecordColumn(sortedRows, "Property", {"SearchClauseId"}, {"SearchClauseId"}),
        removedColumns = Table.RemoveColumns(expandedProperty,{"Field"})
    in
        removedColumns;


GetPropertyList = (baseUrl as text, savedSearchDetails as record) as record =>
    let
	    searchQuery = [
            q="unkSaved:" & savedSearchDetails[savedSearchId], 
            pageSize="1", 
            excludeCount="true", 
            propertySets="FromSearch", 
            IncludePropertyDefs="true"],

	    options = [
		    Headers=[#"Accept"="application/json"],
		    Query=searchQuery],

	    source = Json.Document(Web.Contents(baseUrl & savedSearchDetails[trimType] , options))
    in
        source[PropertiesAndFields];

GetSavedSearchDetails = (baseUrl as text, savedSearchId as text) as record =>
    let
	    searchQuery = [
            q=savedSearchId, 
            properties="SavedSearchQueryString,SavedSearchObjectType"],

	    options = [
		    Headers=[#"Accept"="application/json"],
		    Query=searchQuery],

	    source = Json.Document(Web.Contents(baseUrl & "SavedSearch/" , options)),
        results = if (source[Results] = null or List.Count(source[Results]) = 0) then
            error Error.Record("Unable to find Saved Search '" & savedSearchId & "'.", "Unable to find Saved Search '" & savedSearchId & "'.") 
            else [
                trimType = source[Results]{0}[SavedSearchObjectType][Value], 
                query = source[Results]{0}[SavedSearchQueryString][Value]]
    in
        results;   


GetVersion = (baseUrl as text) as number =>
    let
    	options = [
		    Headers=[#"Accept"="application/json"],
            Query=[
                q="all", 
                properties="DatabaseSchemaVersion"]],

       	source = Json.Document(Web.Contents(baseUrl & "Database", options))
    in
        source[Results]{0}[DatabaseSchemaVersion][Value];

GetTypeRecord = (baseUrl as text, savedSearchDetails as record) as table => 
    let
        propertyDefs = GetPropertyDefinitions(baseUrl, savedSearchDetails),

        locationFilteredRows = Table.SelectRows(propertyDefs, each ( Text.StartsWith([Column1.Id], "LocationOld") = false )),
        addedCustom = Table.AddColumn(locationFilteredRows, "Type", each 
            if List.Contains({"HistoryEventObject","HistoryRelatedObjectUri", "HistoryForObjectUri"}, [Column1.Id]) then
                type nullable number else  
            if [Column1.PFFormat] = "Object" and [Column1.ObjectType] = "Location" then
                RefLocationType else 
            if [Column1.PFFormat] = "Object" then
                RefTrimMainObjectType else   
            if List.Contains({"Number", "BigNumber", "Decimal", "Currency"}, [Column1.PFFormat]) then
                type nullable number else  
            if [Column1.PFFormat] = "Datetime" then
                type nullable datetime else  
            if [Column1.PFFormat] = "Date" then
                type nullable date else 
            if [Column1.PFFormat] = "Boolean" then
                type nullable logical else                 
            type nullable text
        ),
        addedCustom1 = Table.AddColumn(addedCustom, "Value", each type [pType]),
        renamedColumns = Table.RenameColumns(addedCustom1,{{"Column1.Id", "Name"}}),
        typeTablewithName = Table.SelectColumns(renamedColumns, {"Name", "Type"})
    in
        typeTablewithName;


GetSearchClause = (baseUrl as text, savedSearchDetails as record, propertyId as text) as text =>
    let
        propertyDefs = GetPropertyDefinitionsTable(baseUrl, savedSearchDetails),

        searchClauseDefs = GetSearchClauseDefs(baseUrl, savedSearchDetails),
        searchClause = searchClauseDefs{[BasedOnProperty=propertyId]},
        sortClause = if searchClause <> null and searchClause[CanSort] = true then searchClause[InternalName] else "",
        searchClauseId = if propertyDefs{[Id=propertyId]}[IsAField] = true then propertyId else sortClause
    in
        searchClauseId;




GetSchemaForEntity = (baseUrl as text, savedSearchDetails as record) as type => 
    let 
        schema = Schema.ToTableType(GetTypeRecord(baseUrl, savedSearchDetails))
    in
        schema;

TRIMConnector.GoType = type function (
    baseUrl as (type text meta [
        Documentation.FieldCaption = "ServiceAPI URL",
        Documentation.FieldDescription = "URL to your ServiceAPI URL",
        
        Documentation.SampleValues = {"http://MyServer/ServiceAPI/"}
    ]),
    savedSearchId as (type text meta [
        Documentation.FieldCaption = "Saved Search name or URI",
        Documentation.FieldDescription = "Saved Search name or URI"
    ]))
    as table meta [    
        Documentation.Name = "Content Manager",
        Documentation.LongDescription = "Query data from Content Manager"       
    ];



TRIMConnector.Go = (baseUrl, savedSearchId as text) as table =>
    let
       ulrWithTrailingSlash = if Text.EndsWith(baseUrl, "/") then baseUrl else baseUrl & "/",
       savedSearchDetails = GetSavedSearchDetails(ulrWithTrailingSlash, savedSearchId) & [savedSearchId = savedSearchId, version = GetVersion(ulrWithTrailingSlash)],

       go = TRIMConnector.View(ulrWithTrailingSlash, savedSearchDetails)
    in
       go;
               

GetPage = (url as text, query as record, schema as type) =>
	let	 

        existingColumns = Record.FieldNames(Type.RecordFields(Type.TableRow(schema))), 

        optionsWithPageSize = if Record.HasFields(query, "pageSize") then query else query & [pageSize = Text.From(PAGE_SIZE)],

		options = [
            Headers=[#"Content-Type"="application/json"], 
            Content= Json.FromValue(optionsWithPageSize)
        ],
        
		source = Json.Document(Web.Contents( url, options)),		
        results = source[Results],

        convertedToTable = Table.FromList(results, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
        checkEmpty = if Table.IsEmpty(convertedToTable) then #table(type table[Column1 = [Uri = number]],{}) else convertedToTable,
		expanded = Table.ExpandRecordColumn(checkEmpty, "Column1", List.Union({List.Select(existingColumns, each (Text.StartsWith(_, query[TrimType]) or  _ = "Uri")), {"Fields"}})),          
        expandedWithFields = Table.ExpandRecordColumn(expanded, "Fields", List.Select(existingColumns, each not (Text.StartsWith(_, query[TrimType]) or _ = "Uri"))),
		transformed = List.Transform(existingColumns, each {_, FriendlyRowValues}),
		pageTable = Table.FromRecords(Table.TransformRows(expandedWithFields, (row) => Record.TransformFields(row, transformed))),
        hasMoreItems = GetHasMoreItems(source)

in
	 pageTable meta [HasMoreItems = hasMoreItems, LastStart = query[start]?, SearchId = query[id]];




// Data Source Kind description
TRIMConnector = [
    TestConnection = (dataSourcePath, savedSearchId) => {"TRIMConnector.Search", dataSourcePath, savedSearchId},
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


GetAllPagesByNextLink = (url as text, options as record, schema as type, onePageOnly as logical, searchString as text) as table =>
    Table.GenerateByPage((previous) => 
        let
            // if previous is null, then this is our first page of data

            newOptions = options & [
                start = if (previous = null) then options[start] else if Value.Metadata(previous)[HasMoreItems] = false then 0 else Value.Metadata(previous)[LastStart]+PAGE_SIZE
                ],
            optionsWithCache = 
                if onePageOnly = true then 
                    newOptions 
                else 
                    newOptions & [id = if (previous = null) then Number.ToText(Number.Random()) else Value.Metadata(previous)[SearchId]], 

            // if NextLink was set to null by the previous call, we know we have no more data
            page = 
                if previous <> null and onePageOnly = true then null
                else if (optionsWithCache[start] > 0) then GetPage(url, optionsWithCache, schema) 
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

        tmoColumns = Record.FieldNames(Type.RecordFields(RefTrimMainObjectType)),   
        locationColumns = Record.FieldNames(Type.RecordFields(RefLocationType)),

       	refMainObjectFieldTransformations = List.Transform(tmoColumns, each {_, FriendlyRowValues}),
        refLocationFieldTransformations = List.Transform(locationColumns, each {_, FriendlyRowValues}),
		colValue = 
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
		colValue;


TRIMConnector.View = (baseUrl as text, savedSearchDetails as record) as table =>
    let
        // Implementation of Table.View handlers.
        //
        // We wrap the record with Diagnostics.WrapHandlers() to get some automatic
        // tracing if a handler returns an error.
        //
        View = (state as record) => Table.View(#table(null, {}), Diagnostics.WrapHandlers([
            // Returns the table type returned by GetRows()
            GetType = () => CalculateSchema(state),
            // Called last - retrieves the data from the calculated URL
            GetRows = () => 
                let                   
                    finalSchema = CalculateSchema(state),
                    finalUrl = CalculateUrl(state),
                    finalOptions = CalculateOptions(state), 
                    optionsWithTop = finalOptions & [start = if state[Skip]? <> null then state[Skip]+1 else 1],

                    result = TRIMConnector.Feed(finalUrl, finalSchema, state[Top]? <> null, optionsWithTop, savedSearchDetails[query]),
                    appliedType = Table.ChangeType(result, finalSchema)

                in
                    appliedType,

           GetRowCount = () as number =>
                    let
                        finalUrl = CalculateCountUrl(state),
                        value = TRIMConnector.Atomic(finalUrl)                        
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
                    currentSchema = GetSchemaForEntity(UlrWithTrailingSlash(state),savedSearchDetails),
                    // get the columns from the current schema (which is an M Type value)
                    rowRecordType = Type.RecordFields(Type.TableRow(currentSchema)),
                    existingColumns = CalculateExistingColumns(),
                    // calculate the new schema
                    columnsToRemove = List.Difference(existingColumns, columns),
                    updatedColumns = Record.RemoveFields(rowRecordType, columnsToRemove),
                    newSchema = RefineSchema(state, columns)
                in
                    @View(state & 
                        [ 
                            SelectColumns = columns,
                            Schema = newSchema
                        ]
                    ),

                OnSort = (order as list) =>
                    let
                        // This will convert the list of records to a list of text,
                        // where each entry is "<columnName> <asc|desc>"
                        sorting = List.Transform(order, (o) => 
                            let
                                column = GetSearchClause(UlrWithTrailingSlash(state), savedSearchDetails, o[Name]),
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
            CalculateSchema = (state) as type =>
                if (state[Schema]? = null) then
                    GetSchemaForEntity(UlrWithTrailingSlash(state),savedSearchDetails)
                else
                    state[Schema],
            RefineSchema = (state, columns) as type =>
                let
                    // get the current schema
                    currentSchema = CalculateSchema(state),
                    // get the columns from the current schema (which is an M Type value)
                    rowRecordType = Type.RecordFields(Type.TableRow(currentSchema)),
                    existingColumns = CalculateExistingColumns(),
                    // calculate the new schema
                    columnsToRemove = List.Difference(existingColumns, columns),
                    updatedColumns = Record.RemoveFields(rowRecordType, columnsToRemove),
                    newSchema = type table (Type.ForRecord(updatedColumns, false))
                in                  
                    newSchema,
            CalculateExistingColumns = () as list =>
                let                    
                    currentSchema = CalculateSchema(state),
                    // get the columns from the current schema (which is an M Type value)
                    rowRecordType = Type.RecordFields(Type.TableRow(currentSchema)),
                    existingColumns = Record.FieldNames(rowRecordType)
                in
                    existingColumns,

            CalculateCountUrl = (state) as text => 
                 let
                    ulrWithTrailingSlash = UlrWithTrailingSlash(state),
                    urlWithEntity = Uri.Combine(ulrWithTrailingSlash, state[Entity]),
                    defaultQueryString = [ resultsOnly = "true", q = savedSearchDetails[query], CountResults="true"],
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
                       urlWithEntity = Uri.Combine(ulrWithTrailingSlash,  if (savedSearchDetails[version] >= 389 and savedSearchDetails[trimType] = "Record") then "StreamSearch" else "Search")
                    //urlWithEntity = Uri.Combine(ulrWithTrailingSlash, if savedSearchDetails[version] >= 80 then "StreamSearch" else "Search")

                in
                    urlWithEntity,
            CalculateOptions = (state) as record => 
                let
                     tmoColumns = Record.FieldNames(Type.RecordFields(RefTrimMainObjectType)),
                     locationColumns = Record.FieldNames(Type.RecordFields(RefLocationType)),                     

                     allProps = List.Distinct(List.Combine({locationColumns, tmoColumns})),

                    defaultQueryString = [TrimType=state[Entity],RetrieveLoginIdForLocations="true", resultsOnly = "true", q = savedSearchDetails[query], descendantProperties = Text.Combine(allProps, ",")],

                   
                    // Check for Top defined in our state
                    qsWithTop = 
                        if (state[Top]? <> null) then
                            defaultQueryString & [ #"pageSize" = Number.ToText(if state[Top] = 0 then -1 else state[Top]), #"start" = "1" ]
                        else
                            defaultQueryString,

                    qsWithSkip = 
                        if (state[Skip]? <> null) then
                            qsWithTop & [ #"start" = Number.ToText(state[Skip] + 1) ]
                        else
                            qsWithTop,
                    qsWithSelect = qsWithSkip & [ #"properties" = Text.Combine( List.First(List.RemoveNulls({ state[SelectColumns]?, CalculateExistingColumns()})) , ",") ],
                    qsWithOrderBy = 
                        if (state[OrderBy]? <> null) then
                            qsWithSelect & [ #"sortBy" = state[OrderBy] ]
                        else
                            qsWithSelect
                in
                    qsWithOrderBy
        ]))
    in
        View([Url = baseUrl, Entity = savedSearchDetails[trimType]]);


TRIMConnector.Atomic = (url as text) as number =>
    let
        headers = [
            #"Accept" = "application/json"
        ],

        response = Web.Contents(url, [ Headers = headers ]),
        source = Json.Document(response),		
        fieldVal = source[Count]
    in
        fieldVal;


    // Returns a table type for the provided schema table
    Schema.ToTableType = (schema as table) as type =>
        let
            toList = List.Transform(schema[Type], (t) => [Type=t, Optional=false]),
            toRecord = Record.FromList(toList, schema[Name]),
            toType = Type.ForRecord(toRecord, false),
            previousMeta = Value.Metadata(schema)
        in
            type table (toType) meta previousMeta;

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
//Schema.ToTableType = Extension.LoadFunction("Table.ChangeType.pqm");
Diagnostics = Extension.LoadFunction("Diagnostics.pqm");
Diagnostics.LogValue = Diagnostics[LogValue];
Diagnostics.LogFailure = Diagnostics[LogFailure];
Diagnostics.WrapHandlers = Diagnostics[WrapHandlers];


