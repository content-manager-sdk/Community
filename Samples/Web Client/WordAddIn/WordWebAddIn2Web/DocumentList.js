(function () {
    "use strict";



    // The Office initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
    //      //  loadList();
        });
    };
    /*
    (function () {
        var match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
    })();
    */

    loadList();

    var ButtonElements = document.querySelectorAll(".ms-Button");
    for (var i = 0; i < ButtonElements.length; i++) {
        var el = ButtonElements[i];

        new fabric['Button'](el, function () {
            if (this.id == 'selectDocument') {

                var uri = $('.is-selected').attr('data-uri');
                console.log(uri);
            }

            //var rr = { 'Id': uri };
            Office.context.ui.messageParent(uri);
        });

    }


})();

function urldecode(str) {
    return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}

function loadList() {

    var qs = window.location.search.split('=');
    qs = qs[1].split('&')[0];

    qs = urldecode(qs);

    try {
        $.ajax({
            url: "/WordAddin/api/Document",
            method: "GET",
            dataType: "json",
            headers: { "Authorization": "Bearer " + qs },
       //     headers: { "Authorization": "Bearer me" },
            success: function (data) {
                var dl = $("#gridTableBody");
                dl.empty();
                $.each(data, function (idx, item) {
                    dl.append('<tr data-uri="' + item.Id + '"><td class="ms-Table-rowCheck"></td><td>' + item.Title + '</td><td>' + item.Number + '</td><td>' + item.Modified + '</td></tr>')

                });

                //var ListElements = document.querySelectorAll(".ms-List");
                //for (var i = 0; i < ListElements.length; i++) {
                //    new fabric['List'](ListElements[i]);
                //}

                var TableElements = document.querySelectorAll(".ms-Table");
                for (var i = 0; i < TableElements.length; i++) {
                    new fabric['Table'](TableElements[i]);
                }

                $('#gridTableBody tr').click(function () {
                    $(this).siblings().removeClass('is-selected')
                });

                $('.ms-Table-rowCheck').hide();

                //$('.ms-ListItem-selectionTarget').click(function () {
                //    $(this).parent().siblings().removeClass('is-selected')
                //});

            },
            error: function (ex) {
                console.log(ex.message);
                //dfd.resolve("error");
            }
        });
    } catch (ex) {
        console.log(ex.message);
    }
}
