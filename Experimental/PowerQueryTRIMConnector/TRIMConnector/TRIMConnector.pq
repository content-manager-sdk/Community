// This file contains your Data Connector logic

section TRIMConnector;


RecordTypeName = "Record";
Properties = {"RecordDateCreated", "RecordTitle","RecordNumber", "RecordCheckedOutOn"};
PropertiesLoc = {"DateLastUpdated", "LocationSortName"};


//BaseUrl = "http://localhost/ServiceAPI/";

[DataSource.Kind="TRIMConnector", Publish="TRIMConnector.Publish"]
shared TRIMConnector.Search = Value.ReplaceType(TRIMConnector.Go, TRIMConnector.GoType);
//shared TRIMSearchConnector.Search = (serviceUrl as text, optional objectType as text, optional searchString as text) => TRIMConnector.Go(serviceUrl, objectType, searchString) as table;


//[DataSource.Kind="TRIMConnector", Publish="TRIMConnector.Publish"]
shared TRIMConnector.Browse = (url) => TrimNavTable(url) as table;

TRIMConnector.Feed = (url as text, schema as type, onePageOnly as logical, start as number, searchString as text) as table => GetAllPagesByNextLink(url, start, schema, onePageOnly, searchString);

//[Publish="TRIMConnector.Publish"]
//[DataSource.Kind="TRIMConnector", Publish="TRIMConnector.Publish"]
//shared TRIMConnector.Search = (searchString as text) as table => GetAllPagesByNextLink(BaseUrl, 1, GetSchemaForEntity("Record"), false, searchString);

RootEntities = {
    "Record",
    "Location"
};

RefRecordType = type nullable [
    RecordTitle = text,
    RecordNumber = text
];



RecordType = type table [
    RecordTitle = text,
    RecordNumber = text,
    RecordDateCreated = datetime,
    RecordCheckedOutOn = datetime,
    RecordIsElectronic = logical,
    RecordContainer = nullable RefRecordType
];


LocationType = type table [
    LocationSortName = text,
    DateLastUpdated = datetime
];

SchemaTable = #table({"Entity", "Type"}, {
    {"Record", RecordType },
    {"Location", LocationType }
});   
    
   
 

GetSchemaForEntity = (entity as text) as type => try SchemaTable{[Entity=entity]}[Type] otherwise error "Couldn't find entity: '" & entity &"'";
//GetStartingSchemaForEntity = (entity as text) as type => try StartingSchemaTable{[Entity=entity]}[Type] otherwise error "Couldn't find entity: '" & entity &"'";

TRIMConnector.GoType = type function (
    baseUrl as (Uri.Type meta [
        Documentation.FieldCaption = "ServiceAPI URL",
        Documentation.FieldDescription = "URL to your ServiceAPI URL",
        Documentation.SampleValues = {"http://MyServer/ServiceAPI"}
    ]),
    optional entity as (type text meta [
        Documentation.FieldCaption = "Object Type",
        Documentation.FieldDescription = "Select if you wish to search by object type, otherwise leave blank to browse.",
        Documentation.AllowedValues = { "Record", "Location" }
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
        go = 
            if entity = null or searchString = null then
                TrimNavTable(baseUrl)
            else 
                TRIMConnector.View(baseUrl, entity, searchString)
    in
        go;


genNavColumn = (url as text, entity as text) as table => 
    let 
        objects = #table(
            {"Key", "Name",            "Data",                           "ItemKind", "ItemName", "IsLeaf"},{
            {entity & "Favourites", "Favourites",        TRIMConnector.View(url, entity, "unkFavorite"), "Table",    "Table",    true}         
        }),
        supplemented = 
            if entity = "Record" then
                Table.InsertRows(objects, 0, {
                [Key = "CheckedOut", Name = "Checked Out", Data = TRIMConnector.View(url, entity, "checkedOutBy:[all]"), ItemKind = "Table", ItemName = "Table", IsLeaf = true ],
                [Key = "CheckedOutToMe", Name = "Checked Out To Me", Data = TRIMConnector.View(url, entity, "checkedOutBy:[me]"), ItemKind = "Table", ItemName = "Table", IsLeaf = true ]
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


GetPage = (url as text, query as record, schema as type) =>
	let	 

        // get the columns from the current schema (which is an M Type value)
        rowRecordType = Type.RecordFields(Type.TableRow(schema)),
        existingColumns = Record.FieldNames(rowRecordType),
       // props = if Text.Contains(url,"/Record") then Properties else PropertiesLoc,

		options = [
            Headers=[#"Accept"="application/json"], 
            Query=query
        ],
        
		source = Json.Document(Web.Contents( url, options)),		
        results = source[Results],
       
        #"Converted to Table" = Table.FromList(results, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
        CheckEmpty = if Table.IsEmpty(#"Converted to Table") then #table(type table[Column1 = [Uri = number]],{}) else #"Converted to Table",
		#"Expanded Column1" = Table.ExpandRecordColumn(CheckEmpty, "Column1", existingColumns),        
		dd = List.Transform(existingColumns, each {_, FriendlyRowValues}),
		pp = Table.FromRecords(Table.TransformRows(#"Expanded Column1", (row) => Record.TransformFields(row, dd))),
        hasMoreItems = GetHasMoreItems(source),
		r = Table.TransformColumnNames(pp, FriendlyColumnName),
        _ex = Diagnostics.LogValue("ex: ",r)
in
	 _ex meta [HasMoreItems = hasMoreItems, LastStart = query[start]?];




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


GetAllPagesByNextLink = (url as text, startAt as number, schema as type, onePageOnly as logical, searchString as text) as table =>
    Table.GenerateByPage((previous) => 
        let
            // if previous is null, then this is our first page of data
            nextStart = if (previous = null) then startAt else if Value.Metadata(previous)[HasMoreItems] = false then 0 else Number.FromText(Value.Metadata(previous)[LastStart])+30,
            // if NextLink was set to null by the previous call, we know we have no more data
            page = 
                if previous <> null and onePageOnly = true then null
                else if (nextStart > 0) then GetPage(url, [start= Number.ToText(nextStart)], schema) 
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
 
FriendlyColumnName = (colName) => 
	let
        path = List.Select(RootEntities, each Text.StartsWith(colName, _)),
		cn = 
        if List.Count(path) = 1 then
          //  Text.RemoveRange(colName, 0, Text.Length(List.First(path)))		
          colName
		else 
			colName
	in
		cn;


FriendlyRowValues = (row) =>
	let
       	refRecordFieldTransformations = List.Transform({"RecordTitle","RecordNumber"}, each {_, FriendlyRowValues}),

		v = 
            if row is null then
                null
            else if Record.HasFields(row, "Uri") then
                Record.TransformFields(row, refRecordFieldTransformations)
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
        props = if entity = "Record" then Properties else PropertiesLoc,
        View = (state as record) => Table.View(null, Diagnostics.WrapHandlers([
            // Returns the table type returned by GetRows()
            GetType = () => CalculateSchema(state),

            // Called last - retrieves the data from the calculated URL
            GetRows = () => 
                let
                    finalSchema = CalculateSchema(state),
                    finalUrl = CalculateUrl(state),
                                       
                    result = TRIMConnector.Feed(finalUrl, finalSchema, state[Top]? <> null, if state[Skip]? <> null then state[Skip]+1 else 1, searchString),

                    _result = Diagnostics.LogValue("result: ", result ),
                    appliedType = Table.ChangeType(_result, finalSchema),
                    _appliedType = Diagnostics.LogValue("ap: ", appliedType )
                in
                    _appliedType,

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
                    currentSchema = CalculateSchema(state),
                    // get the columns from the current schema (which is an M Type value)
                    rowRecordType = Type.RecordFields(Type.TableRow(currentSchema)),
                    existingColumns = CalculateExistingColumns(),
                    // calculate the new schema
                    columnsToRemove = List.Difference(existingColumns, columns),
                    updatedColumns = Record.RemoveFields(rowRecordType, columnsToRemove),
                    newSchema = type table (Type.ForRecord(updatedColumns, false))
                in
                    @View(state & 
                        [ 
                            SelectColumns = columns,
                            Schema = newSchema
                        ]
                    ),

            //
            // Helper functions
            //
            // Retrieves the cached schema. If this is the first call
            // to CalculateSchema, the table type is calculated based on
            // the entity name that was passed into the function.
            CalculateSchema = (state) as type =>
                if (state[Schema]? = null) then
                    GetSchemaForEntity(entity)
                else
                    state[Schema],

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
                    urlWithEntity = Uri.Combine(ulrWithTrailingSlash, state[Entity]),

                    // Uri.BuildQueryString requires that all field values
                    // are text literals.
                    defaultQueryString = [ resultsOnly = "true", q = searchString],



                    // Check for Top defined in our state
                    qsWithTop =
                        if (state[Top]? <> null) then
                            // add a $top field to the query string record
                            defaultQueryString & [ #"pageSize" = Number.ToText(if state[Top] = 0 then -1 else state[Top]), #"start" = "1" ]
                        else
                            defaultQueryString,

                    qsWithSkip = 
                        if (state[Skip]? <> null) then
                            qsWithTop & [ #"start" = Number.ToText(state[Skip] + 1) ]
                        else
                            qsWithTop,
                    qsWithSelect =
                        if (state[SelectColumns]? <> null) then
                            qsWithSkip & [ #"properties" = Text.Combine(state[SelectColumns], ",") ]
                        else
                            qsWithSkip& [ #"properties" = Text.Combine(props, ",") ],
                    encodedQueryString = Uri.BuildQueryString(qsWithSelect),
                    finalUrl = urlWithEntity & "?" & encodedQueryString
                in
                    finalUrl
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
