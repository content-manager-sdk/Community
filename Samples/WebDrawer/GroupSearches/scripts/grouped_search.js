
var makeQuery = function () {
    var value = []; // $("#default-search-query").val();
    var exactMatch = $('#exact-string-searches');
    exactMatch = exactMatch && exactMatch[0] && exactMatch[0].checked;

    var gropuFirstTwo = $('group-first-two').prop('checked');

    var lastBool = 'AND';
    try {
        var lastBool;
        $('.clause-selector').each(function () {
            var fld = $(this).parents('.control-group').first().find('.search-clause').first();
            //===================keep track of the last selected field's format so that we can use later while setting lastBool
            var last_field_format = null;
            $(this).children('option').filter("option:selected").each(function () {

                var searchClause = $(this).val();

                if (searchClause) {
                    var fldFormat = $(this).parameterFormat();
                    var fldValue = fld.val();
                    if (fldFormat && (fldValue || fldFormat === 'Boolean')) {
                        if (
                            fldValue.indexOf(':') < 0
                            && fldFormat !== 'BigNumber'
                            && fldFormat !== 'Number'
                            && fldFormat !== 'Date'
                            && fldFormat !== 'Datetime'
                        ) {

                            if (exactMatch) {
                                fldValue = '"' + fldValue + '"';
                            }

                            var objectType = $(this).objectTypeParameter();

                            var wordSearchClause;

                            if (objectType === 'Classification') {
                                wordSearchClause = 'plnWord';
                            }

                            if (objectType === 'Schedule') {
                                wordSearchClause = 'schWord';
                            }

                            if (objectType === 'Record') {
                                wordSearchClause = 'recTitle';
                            }

                            if (wordSearchClause) {
                                fldValue = '[' + wordSearchClause + ':' + fldValue + '] OR ' + fldValue;
                            }

                        }
                        last_field_format = fldFormat;
                        if (fldFormat !== 'Boolean') {
                            searchClause += ":" + fldValue + '';
                        }
                        if (value.length > 0) {
                            value.push(lastBool);
                        }
                        value.push(searchClause);

                    }
                }

            });
            if (last_field_format && (last_field_format === 'Date' || last_field_format === 'Datetime'))
                lastBool = fld.next().next().children('.active').attr('name');
            else
                lastBool = fld.next().children('.active').attr('name');
        });

        if (value.length > 0) {
            if (value.length >= 5) {
                if ($('#group-first-two').attr('checked')) {
                    value.splice(3, 0, ")");
                    value.splice(0, 0, "(");
                } else {
                    value.push(')');
                    value.splice(2, 0, "(");
                }
            }
            var defaultValue = $("#default-search-query").val();
            if (defaultValue) {
                return defaultValue + " AND (" + value.join(" ") + ")";
            } else {
                return value.join(" ");
            }
        }
        return;
    }
    catch (error) {
        console.log(error);
        return;
    }
}

$(function () {




    var searchString = "";
    $("#search-form").off('submit').on("submit", function (event) {

        var value = makeQuery();

        var sortBy = [];

        if (value) {
            try {

                $('.sortby-selector').each(function () {
                    var ascending = $(this).next('label').first().children(':checked').length > 0 ? "-" : "";
                    $(this).children('option').filter("option:selected").each(function () {
                        var sortClause = $(this).val();

                        if (sortClause) {
                            sortBy.push(sortClause + ascending);
                        }
                    });
                })

            }
            catch (error) {
                console.log(error);
                return false;
            }
        }

        if (!value) {
            // if value has not been populated do nothing;
            return false;
        }

        $("#search-query").val(value);
        if (sortBy.length > 0) {
            $('#sortBy').val(sortBy.join(','));
        }


    });


    var onFormChange = function () {
        var searchQuery = makeQuery();
        var displayQuery = $('#sampleQuery');

        if ($('#sampleQuery').text() !== searchQuery) {
            $('#sampleQuery').text(searchQuery);
        }
    }

    setInterval(onFormChange, 1000);


});