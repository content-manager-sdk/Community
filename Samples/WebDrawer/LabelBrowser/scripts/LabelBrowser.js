$(function () {
    var addGroupLabels = false;
    var myUri;
    var fetchLocations = $.get("Location", { "q": "hasMember:me OR hasMember:[hasMember:me]", "format": "json" });

    var createLbl = function (evt) {
        var thisBtn = $(this).parent();
        var cancelForm = function () {
            lblForm.remove();
            thisBtn.children("i, button").show();
        }
        
        var parentUri = $(this).attr('data-parent-uri');

        var locSel = $('<select name="UserLabelOwner" />')
        .append('<option value="' + myUri + '">Private</option>');

        fetchLocations.done(function (data) {
            for (var locCount = 0; locCount < data.Results.length; locCount++) {
                var loc = data.Results[locCount]
                locSel.append('<option value="' + loc.Uri + '">' + loc.LocationSortName.Value + '</option>')
            }
        });

        var lblForm = $('<form />')
            .append('<label>Name:</label> <input name="UserLabelName" />')
            .submit(function () { return false;});

        if (addGroupLabels) {
            lblForm
            .append('<label>Owner:</label> ')
            .append(locSel);
        }
        lblForm
            .append($('<br /><button type="button" class="btn">Cancel</button>')
                .click(cancelForm))
            .append('<button class="btn" type="submit">Create</button>')
            .submit(function () {
                var form = $(this);
                var body = {};
                form.children(':input').each(function (idx, item) {
                    var inputVal = $(this).val();
                    if (inputVal) {
                        body[$(this).attr('name')] = $(this).val();
                    }
                });

                $.ajax({
                    type: "POST",
                    url: "UserLabel",
                    data: JSON.stringify(body),
                    contentType: 'application/json',
                    success: function (data) {
                        if (thisBtn[0].nodeName === "DIV") {
                            $('#contentcolumn').empty();
                            createTable($('#contentcolumn'), "top");
                        } else {
                            thisBtn.parent().find('table.trim-list').remove();
                            createTable(thisBtn.parent().children('td:nth-child(2)'), parentUri, thisBtn.parent().children('td').first());
                        }
                        cancelForm();
                    },
                    failure: function (errMsg) {
                        alert(errMsg);
                    }
                });
                return false;
            });
        if (parentUri) {
            lblForm.append('<input type="hidden" name="NewLowerLevel" value="true">')
            .append('<input type="hidden" name="Uri" value="' + parentUri + '">');
        }
        thisBtn.children("i, button").hide();
        thisBtn.append(lblForm);
    };

    var createTable = function (cell, parentUri, targetCell) {
        var query = parentUri === 'top' ? parentUri : "parent:" + parentUri;
        $.get("UserLabel", { "q": query, "format": "json", "pageSize": 500 }).done(function (data) {
            var tbl = $('<table class="table trim-list search-results" style="margin-top:6px;"></table>');
            var tbody = $("<tbody/>");

            if (parentUri === "top") {
                $('<button class="btn pull-right"><i class="icon-tag" /> Create top level</button>')
                .click(createLbl)
                .appendTo($('<div style="padding: 0 10px 35px 10px;"></div>')
                .appendTo(cell));
            }

            if (data.Results.length > 0) {

                for (var lblCount = 0; lblCount < data.Results.length; lblCount++) {
                    var lbl = data.Results[lblCount];
                    var icon = $('<i data-parent-uri="' + lbl.Uri + '" class="icon-tag"></i>')
                        .css('cursor', 'pointer')
                        .click(createLbl);
                    var container = $('<td width="20"></td>')
                    .append(icon);

                    var iconCell = $('<td class="row-icon"><img width="36" style="margin-top:-20px" src="images/record_types/' + lbl.Icon.Id + '.png" /></td>')
                        .click(expandLabel)
                        .css('cursor', 'pointer')
                        .prepend('<strong style="padding-top:6px">+</strong>');

                    var row = $('<tr></tr>')
                        .append(iconCell)
                        .append('<td><a class="prop-val" data-label-uri="' + lbl.Uri + '" href="Record?q=label:' + lbl.Uri + '">' + lbl.UserLabelName.Value + '</a></td>')
                        .append(container);
                    tbody.append(row);
                }
                tbl.append(tbody);



                cell.append(tbl);
            } else {
                if (targetCell) {
                    $(targetCell).children('strong').remove();
                    $(targetCell).children('img').css('margin-top', '0');
                }
            }



        });

    }
    var expandLabel = function () {
        var targetCell = this;
        var cell = $(this).parent().find('td:nth-child(2)').first();

        var existingTable = cell.find("table");

        if (existingTable.length > 0) {
            existingTable.remove();
        }
        else {
            var labelUri = $(this).parent().find('a.prop-val').first().attr("data-label-uri");
            createTable(cell, labelUri, targetCell);
        }
    }

    $.get("Location/me", { "properties": "permissions", "format": "json" }).done(function (data) {
        addGroupLabels = data.Results[0].Permissions["ModifyInternalLocation"];
        myUri = data.Results[0].Uri;
        createTable($('#contentcolumn'), "top");
    });
});