(function ($) {
        var _searchDialog = null;

        function getSearchDialog(cm) {
                if (!_searchDialog) {
                        _searchDialog = $('<div class="CodeMirror-dialog CodeMirror-dialog-top"></div>');
                        var searchInput = $('<input type="text" class="CodeMirror-Search-Box main">').on("focus", function () {
                                        _searchDialog.removeClass("searching");
                                }).on("blur", function () {
                                        _searchDialog.addClass("searching");
                                }),
                        replaceInput = $('<input type="text" class="CodeMirror-Search-Box">').on("focus", function () {
                                        _searchDialog.removeClass("searching");
                                }).on("blur", function () {
                                        _searchDialog.addClass("searching");
                                }),
                        backwardInput = $('<input type="checkbox" class="CodeMirror-Check-Box">'),
                        regexInput = $('<input type="checkbox" class="CodeMirror-Check-Box">'),
                        close = function () {
                                _searchDialog.hide();
                                cm.focus();
                        },
                        doSearch = function () {
                                var query = parseQuery(searchInput.val(), regexInput[0].checked);
                                var state = getSearchState(cm);
                                if (!query) {
                                        clearSearch(cm);
                                } else {
                                        if (isQueryChanged(state.query, query)) {
                                                cm.operation(function () {
                                                        if (!query)
                                                                return;
                                                        state.query = parseQuery(query, regexInput[0].checked);
                                                        cm.removeOverlay(state.overlay);
                                                        state.overlay = searchOverlay(state.query);
                                                        cm.addOverlay(state.overlay);
                                                        state.posFrom = state.posTo = cm.getCursor();
                                                        findNext(cm, backwardInput[0].checked);
                                                });
                                        } else {
                                                findNext(cm, backwardInput[0].checked);
                                        }
                                }
                                cm.focus();
                        },
                        replace = function (text, all, next) {
                                var query = searchInput.val();
                                var state = getSearchState(cm);
                                if (isQueryChanged(state.query, query)) {
                                        return false;
                                }
                                if (all) {
                                        cm.operation(function () {
                                                for (var cursor = getSearchCursor(cm, query); cursor.findNext(); ) {
                                                        if (typeof query != "string") {
                                                                var match = cm.getRange(cursor.from(), cursor.to()).match(query);
                                                                cursor.replace(text.replace(/\$(\d)/, function (_, i) {
                                                                                return match[i];
                                                                        }));
                                                        } else
                                                                cursor.replace(text);
                                                }
                                        });
                                } else {
                                        if (state.posTo.ch == state.posFrom.ch && state.posTo.line == state.posFrom.line) {
                                                return;
                                        }
                                        var cursor = getSearchCursor(cm, query, backwardInput[0].checked ? state.posTo : state.posFrom);
                                        var start = cursor.from(),
                                        match;
                                        if (!(match = backwardInput[0].checked ? cursor.findPrevious() : cursor.findNext())) {
                                                cursor = getSearchCursor(cm, query);
                                                if (!(match = backwardInput[0].checked ? cursor.findPrevious() : cursor.findNext())
                                                         || (start && cursor.from().line == start.line && cursor.from().ch == start.ch))
                                                        return;
                                        }
                                        cm.setSelection(cursor.from(), cursor.to());
                                        cm.scrollIntoView({
                                                from : cursor.from(),
                                                to : cursor.to()
                                        });
                                        cursor.replace(typeof query == "string" ? text : text.replace(/\$(\d)/, function (_, i) {
                                                        return match[i];
                                                }));
                                        if (backwardInput[0].checked) {
                                                state.posTo = state.posFrom = cursor.from();
                                        } else {
                                                state.posTo = state.posFrom = cursor.to();
                                        }
                                        if (next) {
                                                findNext(cm, backwardInput[0].checked);
                                        }
                                }
                                cm.focus();
                        },
                        closeIcon = $('<button type="button" class="btn btn-default btn-xs closeIcon">X</button>').on("click", close),
                        sButton = $('<button type="button" class="btn btn-default btn-xs">Find</button>').on('click', doSearch),
                        rButton = $('<button type="button" class="btn btn-default btn-xs">Replace</button>').on('click', function () {
                                        replace(replaceInput.val());
                                }),
                        rfButton = $('<button type="button" class="btn btn-default btn-xs">Replace/Find</button>').on("click", function () {
                                        replace(replaceInput.val(), false, true);
                                }),
                        raButton = $('<button type="button" class="btn btn-default btn-xs">Replace All</button>').on("click", function () {
                                        replace(replaceInput.val(), true);
                                });
                        _searchDialog.on("keydown", function (e) {
                                if (e.keyCode == 27) {
                                        close();
                                        if (e.preventDefault) {
                                                e.preventDefault();
                                        } else {
                                                return false;
                                        }
                                }
                        });
                        $(cm.getWrapperElement()).append(
                                _searchDialog.html(closeIcon).append($("<div class='pull-left'>").append("<label>Search: <label>").append(searchInput),
                                        [$("<div class='pull-left'>").append("<label>Back: <label>").append(backwardInput), $("<div class='pull-left'>").append("<label>Replace: <label>").append(replaceInput), $("<div class='pull-left'>").append("<label>Regex: <label>").append(regexInput), $("<div class='pull-left'>").append(sButton, [rButton, rfButton, raButton])]));
                }
                setTimeout(function () {
                        _searchDialog.find(".CodeMirror-Search-Box.main").focus();
                }, 200);
                return _searchDialog;
        }
        function isQueryChanged(a, b) {
                if (a === b) {
                        return false;
                } else if (a && a.source && b && b.source) {
                        return a.source !== b.source;
                } else {
                        return true;
                }
        }
        function openDialog(cm) {
                clearSearch(cm);
                closeNotification(cm, null);
                getSearchDialog(cm).show();
        }
        function closeNotification(cm, newVal) {
                if (cm.state.currentNotificationClose)
                        cm.state.currentNotificationClose();
                cm.state.currentNotificationClose = newVal;
        }
        function searchOverlay(query) {
                if (typeof query == "string")
                        return {
                                token : function (stream) {
                                        if (stream.match(query))
                                                return "searching";
                                        stream.next();
                                        stream.skipTo(query.charAt(0)) || stream.skipToEnd();
                                }
                        };
                return {
                        token : function (stream) {
                                if (stream.match(query))
                                        return "searching";
                                while (!stream.eol()) {
                                        stream.next();
                                        if (stream.match(query, false))
                                                break;
                                }
                        }
                };
        }
        function findNext(cm, rev) {
                cm.operation(function () {
                        var state = getSearchState(cm);
                        var cursor = getSearchCursor(cm, state.query, rev ? state.posFrom : state.posTo);
                        if (!cursor.find(rev)) {
                                cursor = getSearchCursor(cm, state.query, rev ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm
                                                        .firstLine(), 0));
                                if (!cursor.find(rev))
                                        return;
                        }
                        cm.setSelection(cursor.from(), cursor.to());
                        cm.scrollIntoView({
                                from : cursor.from(),
                                to : cursor.to()
                        });
                        state.posFrom = cursor.from();
                        state.posTo = cursor.to();
                });
        }
        function parseQuery(query, isRE) {
                return isRE ? new RegExp(query) : query;
        }
        function SearchState() {
                this.posFrom = this.posTo = this.query = null;
                this.overlay = null;
        }
        function getSearchState(cm) {
                return cm.state.search || (cm.state.search = new SearchState());
        }
        function getSearchCursor(cm, query, pos) {
                // Heuristic: if the query string is all lowercase, do a case
                // insensitive search.
                return cm.getSearchCursor(query, pos, typeof query == "string" && query == query.toLowerCase());
        }
        function clearSearch(cm) {
                cm.operation(function () {
                        var state = getSearchState(cm);
                        if (!state.query)
                                return;
                        state.query = null;
                        cm.removeOverlay(state.overlay);
                });
        }

        CodeMirror.commands.find = openDialog;
        CodeMirror.commands.findPrev = openDialog;
        CodeMirror.commands.clearSearch = clearSearch;
        CodeMirror.commands.replace = openDialog;
        CodeMirror.commands.replaceAll = openDialog;
})(jQuery);
