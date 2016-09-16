// link this this script from the bottom of _Layout.cshtml when adding the date picker to Content Manager 8.1.
// for later versions place customer_scripts.cshtml and custom_head.cshtml in the Views\Shared folder.
$(function () {

//this is not related to the date picker, it is only to show a progress icon when searching to let users know
// something is happening.
	 $( "form" ).submit(function( event ) {
		 $("body").css("cursor", "progress");
	 });

// add CSS so we do not have to di it manually in _Layout.cshtml	 
	$('head').append('<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/smoothness/jquery-ui.min.css" type="text/css" />');
	$('head').append('<link rel="stylesheet" href="css/jquery.comiseo.daterangepicker.css" type="text/css" />');

// switch off the link click behaviour in webdrawer.js, this behaviour breaks the calendar paging and is unnecessary anyway.	
    $(document).off("click", "a");

// how we add the date picker to date search fields

// first set up the options and the change event to convert the date range from a JSON object to a search compatible string.	
    var rangePickerSettings = {
        buttonImage: 'calendar.png',
		datepickerOptions:{changeYear: true},
		presetRanges:[],
		dateFormat: "MM/DD/YYYY",
		altFormat: 'mm-dd-yyyy',
		applyButtonText:"OK",
		 change: function (event, data) {
			 var range = $(this).daterangepicker("getRange");
			 var format = data.instance.options.dateFormat;
			 var start = moment(range.start).format(format);
			 var end = moment(range.end).format(format);

			 if (start !== end) {
				 $(this).val(start + ' To ' + end);
			 } else {
				 $(this).val(start);
			 }
		 }
	}

	// now actually add the picker to the search fields
	
	// first in custom search forms
    $('input').each(function () {
        var fld = $(this);

        var isDate = function (n) {
            var toReturn = false;
            $.each(searchClauses, function (key, value) {
                if (value.Name === n) {
                    toReturn = value.ParameterFormat === 'Datetime' || value.ParameterFormat === 'Date';
                    return false;
                }

            });
            return toReturn;
        }

        if (isDate(fld.attr('name'))) {
            fld.daterangepicker(rangePickerSettings);
        }
    });

	
	// how add the picker to date fields from the default search form, also remove the picker when a non
	// date search clause is selected.
    $('.clause-selector').change(function () {
        var fld = $(this).parents('.control-group').first().find('.search-clause').first();

        $(this).children('option').filter("option:selected").each(function () {
            fld.prop('disabled', $(this).parameterFormat() === 'Boolean');

            if ($(this).parameterFormat() === 'Datetime' || $(this).parameterFormat() === 'Date') {
                // some of the default formatting interferes with the date picker, lets remove it
                $(fld).parent('.input-append').removeClass('input-append');

                // set the date picker on a Date or Datetime field
                $(fld).daterangepicker(rangePickerSettings);
            } else {
                if (fld.daterangepicker) {
                    fld.daterangepicker('destroy');
                }
            }
        });

    });
});