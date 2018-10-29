(function () {
    "use strict";

    var qs = getToken();

    $.ajaxSetup({
        beforeSend: function (xhr) {
           // xhr.setRequestHeader("Authorization", "Bearer me");
            xhr.setRequestHeader("Authorization", "Bearer " + qs);
            
        }
    });


    // The Office initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {

        });
    };

    fabric['PeoplePicker'].prototype._mySelectResult = function (e) {
        var uri = $(e.srcElement).parents('.ms-PeoplePicker-result').first().attr('data-trim-uri');

        $(this._container).find('.ms-PeoplePicker-searchBox').find('.ms-Persona').remove();
        $(this._container).find('.trim-field-name').first().val(uri);

        this._selectResult(e); 
    }

    fabric['PeoplePicker'].prototype.refreshList = function () {

        // Select all results and remove event listeners by cloning
        var peoplePickerResults = this._peoplePickerMenu.querySelector(".ms-PeoplePicker-result");
        var resultsParent = peoplePickerResults.parentNode;
        var resultsClone = resultsParent.cloneNode(true);
        resultsParent.parentNode.replaceChild(resultsClone, resultsParent);
        // Get all results
        this._peoplePickerResults = this._peoplePickerMenu.querySelectorAll(".ms-PeoplePicker-result");
        // Add _selectResult listeners to each result
        for (var i = 0; i < this._peoplePickerResults.length; i++) {
            var personaResult = this._peoplePickerResults[i].querySelector(".ms-Persona");
            var removeButton = this._peoplePickerResults[i].querySelector(".ms-PeoplePicker-resultAction");

            personaResult.addEventListener("click", this._mySelectResult.bind(this), true);
            removeButton.addEventListener("click", this._removeItem.bind(this), true);
        }
    };

    $.when(loadRecordTypes()).then(function (r) {
        var DropdownHTMLElements = document.querySelectorAll('.ms-Dropdown');
        for (var i = 0; i < DropdownHTMLElements.length; ++i) {
            var Dropdown = new fabric['Dropdown'](DropdownHTMLElements[i]);
        }



        $('#recordTypePicker').on('change', function () {
            var me = $(this);
            var uri = Number(me.val());

            try {
                var qs = getToken();
                $.ajax({
                    url: "/WordAddin/serviceapi/Record",
                    method: "POST",
                    dataType: "json",
                    data: {
                        "RecordRecordType": uri,
                        "Properties": "DataEntryFormDefinition",
                        "ByPassSave": true
                    },
                    success: function (data) {
                        writeForm(data.Results[0].DataEntryFormDefinition)
                        console.log(data);
                    },
                    error: function (ex) {
                        console.log(ex.message);
                    }
                });
            } catch (ex) {
                console.log(ex.message);
            }

        });

    });
    var ButtonElements = document.querySelectorAll(".ms-Button");
    for (var i = 0; i < ButtonElements.length; i++) {
        var el = ButtonElements[i];

        new fabric['Button'](el, function (e) {

            e.preventDefault();
       //     var itemId = Office.context.document.id;
       //     console.log("item id: " + itemId);

            if (this.id == 'selectDocument') {

                var data = $('#CreateRecordForm').serialize();

                $.post("/WordAddin/serviceapi/Record", data, null, 'json')
                    .done(function (response, statusText) {
                        if (statusText === "success") {
                            Office.context.ui.messageParent(response.Results[0].Uri);
                        }
                    })
                    .fail(function (xhr) {
                        var err = eval("(" + xhr.responseText + ")");
                        console.log(err.ResponseStatus.Message);
                    });
            //    var uri = $('.is-selected').attr('data-uri');
            //    console.log(uri);
            }

            ////var rr = { 'Id': uri };
            //Office.context.ui.messageParent(uri);
        });

    }



})();

function getValue(val) {
    if (val) {
        if (val.DateTime) {
            if (val.IsClear === false) {
                return val.DateTime;
            }

            return "";
        }

        if (val.Uri) {
            return val.Uri;
        }

        if (val.Uri === 0) {
            return "";
        }

        return val;
    }
    return "";
}

function objectField(caption, name, trimType, defaultVal) {
    var sel = $('<div class="ms-PeoplePicker ms-PeoplePicker--compact">'
        + '  <div class="ms-PeoplePicker-searchBox">'
        + '    <div class="ms-TextField ms-TextField--textFieldUnderlined">'
        + '      <input type="hidden" name="' + name + '" class="trim-field-name"  type="text" value="' + getValue(defaultVal) + '">'        
        + '      <input class="ms-TextField-field" type="text" value="" placeholder="Select or enter a ' + caption + '">'
        + '    </div>'
        + '  </div>'
        + '  <div class="ms-PeoplePicker-results ms-PeoplePicker-results--compact">'
        + '    <div class="ms-PeoplePicker-resultGroup">'
        + '      <div class="ms-PeoplePicker-resultGroupTitle">'
        + '        Favorites'
        + '      </div>'
        + '      <div class="ms-PeoplePicker-result" tabindex="1">'
        + '        <div class="ms-Persona ms-Persona--sm">'
        + '          <div class="ms-Persona-imageArea">'
        + '            <div class="ms-Persona-initials ms-Persona-initials--blue">RM</div>'
        + '          </div>'
        + '          <div class="ms-Persona-presence">'
        + '          </div>'
        + '          <div class="ms-Persona-details">'
        + '            <div class="ms-Persona-primaryText">Russel Miller</div>'
        + '            <div class="ms-Persona-secondaryText">Sales</div>'
        + '          </div>'
        + '        </div>'
        + '        <button class="ms-PeoplePicker-resultAction">'
        + '          <i class="ms-Icon ms-Icon--Clear"></i>'
        + '        </button>'
        + '      </div>'
        + '    <button class="ms-PeoplePicker-searchMore">'
        + '      <div class="ms-PeoplePicker-searchMoreIcon">'
        + '        <i class="ms-Icon ms-Icon--Search"></i>'
        + '      </div>'
        + '      <div class="ms-PeoplePicker-searchMoreText">'
        + '        Search'
        + '      </div>'
        + '    </button>'
        + '  </div>'
        + '</div>');


    var pp = new fabric['PeoplePicker'](sel[0]);

    var observer = new MutationObserver(function (mutations) {
        if ($(mutations[0].target).css('display') !== 'none') {
      

            mutations.forEach(function (mutation) {
                $(mutation.target).find('.ms-PeoplePicker-result').remove();

                var searchString = 'unkFavorite';

                if (name === 'RecordContainer') {
                    searchString += ' OR recMyContainers'
                }

                $.ajax({
                    url: "/WordAddin/serviceapi/" + trimType + "?q=" + searchString + "&properties=ToolTip,Icon,LocationUnit&ExcludeCount=true&PropertyValue=String",
                    method: "GET",
                    dataType: "json",
                    success: function (data) {

                        $.each(data.Results, function (idx, val) {
                            $(mutation.target).find('.ms-PeoplePicker-searchMore').before($('<div class= "ms-PeoplePicker-result" tabindex = "1" data-trim-uri="' + getValue(val.Uri) + '">'
                                + '        <div class="ms-Persona ms-Persona--sm">'
                                + '          <div>'
                                + '            <image src="/WordAddin/images/icon/' + val.Icon.Id + '_x32.png">'
                                + '          </div>'
                                //+ '          <div class="ms-Persona-presence">'
                                //+ '          </div>'
                                + '          <div class="ms-Persona-details">'
                                + '            <div class="ms-Persona-primaryText">' + val.ToolTip + '</div>'
                                + '            <div class="ms-Persona-secondaryText">' + (val.LocationUnit || {}).StringValue + '</div>'
                                + '          </div>'
                                + '        </div>'
                                + '        <button class="ms-PeoplePicker-resultAction">'
                                + '          <i class="ms-Icon ms-Icon--Clear"></i>'
                                + '        </button>'
                                + '      </div>'));

                        });

                        pp.refreshList();

                        sel.find('.ms-Persona').on('click', function () {
                            console.log($(this).attr('data-trim-uri'));

                        });
                    },
                    error: function (ex) {
                        console.log(ex.message);

                    }
                });
            });  


        }
    });
    var target = sel.find('.ms-PeoplePicker-results').first()[0];
    observer.observe(target, {
        attributes: true
    });
    
    return pp;
}

function dateField(caption, name) {
    return $('<div class="ms-DatePicker">'
        + '  <div class="ms-TextField">'
        + '    <label class="ms-Label">' + caption + '</label>'
        + '    <i class="ms-DatePicker-event ms-Icon ms-Icon--Event"></i>'
        + '    <input name="' + name + '" class="ms-TextField-field" type="text" placeholder="Select a date&hellip;">'
        + '  </div>'
        + '  <div class="ms-DatePicker-monthComponents">'
        + '    <span class="ms-DatePicker-nextMonth js-nextMonth"><i class="ms-Icon ms-Icon--ChevronRight"></i></span>'
        + '    <span class="ms-DatePicker-prevMonth js-prevMonth"><i class="ms-Icon ms-Icon--ChevronLeft"></i></span>'
        + '    <div class="ms-DatePicker-headerToggleView js-showMonthPicker"></div>'
        + '  </div>'
        + '  <span class="ms-DatePicker-goToday js-goToday">Go to today</span>'
        + '  <div class="ms-DatePicker-monthPicker">'
        + '    <div class="ms-DatePicker-header">'
        + '      <div class="ms-DatePicker-yearComponents">'
        + '        <span class="ms-DatePicker-nextYear js-nextYear"><i class="ms-Icon ms-Icon--ChevronRight"></i></span>'
        + '        <span class="ms-DatePicker-prevYear js-prevYear"><i class="ms-Icon ms-Icon--ChevronLeft"></i></span>'
        + '      </div>'
        + '      <div class="ms-DatePicker-currentYear js-showYearPicker"></div>'
        + '    </div>'
        + '    <div class="ms-DatePicker-optionGrid">'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="0">Jan</span>'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="1">Feb</span>'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="2">Mar</span>'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="3">Apr</span>'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="4">May</span>'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="5">Jun</span>'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="6">Jul</span>'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="7">Aug</span>'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="8">Sep</span>'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="9">Oct</span>'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="10">Nov</span>'
        + '      <span class="ms-DatePicker-monthOption js-changeDate" data-month="11">Dec</span>'
        + '    </div>'
        + '  </div>'
        + '  <div class="ms-DatePicker-yearPicker">'
        + '    <div class="ms-DatePicker-decadeComponents">'
        + '      <span class="ms-DatePicker-nextDecade js-nextDecade"><i class="ms-Icon ms-Icon--ChevronRight"></i></span>'
        + '      <span class="ms-DatePicker-prevDecade js-prevDecade"><i class="ms-Icon ms-Icon--ChevronLeft"></i></span>'
        + '    </div>'
        + '  </div>'
        + '</div>');
}

function writeForm(formDef) {

    var recordForm = $('#record-form-fields');
    recordForm.empty();

    $.each(formDef.Pages, function (pageIdx, page) {
        if (page.Type === "Normal") {
            recordForm.append('<span class="ms-font-1">' + page.Caption + '</span>');

            $.each(page.PageItems, function (pageItemIdx, pageItem) {
                if (pageItem.Type != 'Line') {

                    var input;


                    if (pageItem.Format === 'Date' || pageItem.Format === 'Datetime') {
                        input = dateField(pageItem.Caption, pageItem.Name);
                        new fabric['DatePicker'](input[0]);
                    }

                    if (pageItem.ObjectType != "Unknown") {
                        input = $(objectField(pageItem.Caption, pageItem.Name, pageItem.ObjectType, pageItem.Value)._container);
                      // var pp = new fabric['PeoplePicker'](input[0]);

                    }

                    if (!input) {
                        var input = $('<div class="ms-TextField">'
                            + '<label class= "ms-Label" for="' + pageItem.Name + '">' + pageItem.Caption + '</label>'
                            + '<input class="ms-TextField-field" type="text" name="' + pageItem.Name + '" value="' + getValue(pageItem.Value) + '" placeholder="">'
                            + '</div>');
                        new fabric['TextField'](input[0]);
                    }

                    input.appendTo(recordForm);

                }
            });
        }

    });
}

function urldecode(str) {
    return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}

function parseQueryString(queryString) {
    var params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
};

function getToken() {
    var qs = parseQueryString(window.location.search.substring(1));

    return qs['accessToken'];
}

function loadRecordTypes() {

    var dfd = jQuery.Deferred();

    var qs = parseQueryString(window.location.search.substring(1));

    $('#MyExternalURL').val(qs["docUrl"]);

    try {
        $.ajax({
            url: "/WordAddin/serviceapi/RecordType?q=hasElecDocSupport and rtyBehaviour:Document&properties=NameString",
            method: "GET",
            dataType: "json",
            success: function (data) {

                $.each(data.Results, function (idx, val) {
                    $('#recordTypePicker').append($('<option>', { value: val.Uri, text: val.NameString }));

                });

                dfd.resolve({ "status": "success"});

            },
            error: function (ex) {
                console.log(ex.message);
                dfd.resolve({ "status": "error" });
            }
        });
    } catch (ex) {
        console.log(ex.message);
    }

    return dfd.promise();
}