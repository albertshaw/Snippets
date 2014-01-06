$(document).ready(function () {
	var _win = $(window),
	_editorview = $('#editorview'),
	_sidepreview = $('#sidepreview'),
	_myCodeMirror;

	function delayEmit(func, wait) {
		var timeout = null;
		return function () {
			var context = this,
			args = arguments;
			var later = function () {
				timeout = null;
				func.apply(context, args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	_myCodeMirror = CodeMirror(_editorview[0], {
			mode : 'markdown',
			lineWrapping : true,
			lineNumbers : true,
			value : $("#formarticle").val(),
			extraKeys : {
				"Enter" : "newlineAndIndentContinueMarkdownList"
			}
		});
	function measureBoxHeight() {
		_editorview.parents('.row-offcanvas').height(
			_win.height() - _editorview.offset().top - $('#controlpanel').height());
		setTimeout(function () {
			_myCodeMirror.setSize("100%", "100%");
		}, 0);
	}
	_win.on('resize', delayEmit(measureBoxHeight, 200));
	var _onEditorScroll;
	function spyEditorScroll() {
		_onEditorScroll = delayEmit(function (cm) {
				var scrollInfo = cm.getScrollInfo();
				if (scrollInfo.height) {
					_sidepreview.off("scroll");
					_sidepreview.scrollTop(scrollInfo.top / scrollInfo.height * _sidepreview[0].scrollHeight);
					setTimeout(spyPreviewScroll, 500);
				}
			}, 500);
		_myCodeMirror.on("scroll", _onEditorScroll);
	}
	spyEditorScroll();
	function spyPreviewScroll() {
		_sidepreview.on("scroll", delayEmit(function () {
				if (_sidepreview[0].scrollHeight) {
					_myCodeMirror.off("scroll", _onEditorScroll);
					_myCodeMirror.scrollTo(null, _sidepreview.scrollTop() / _sidepreview[0].scrollHeight * _myCodeMirror.getScrollInfo().height);
					setTimeout(spyEditorScroll, 500);
				}
			}, 500));
	}
	spyPreviewScroll();

	_myCodeMirror.on("change", delayEmit(function (cm) {
			$('#sidepreview').html(marked(cm.getValue()));
		}, 500));
	$('#sidepreview').html(marked(_myCodeMirror.getValue()));
	measureBoxHeight();
	$('#offcanvastoggle').click(function () {
		var rowoffcanvas = $('.row-offcanvas');
		rowoffcanvas.toggleClass('active');
		if (rowoffcanvas.is('.active')) {
			this.innerHTML = "Back";
		} else {
			this.innerHTML = "Preview";
		}
	});
	$('#markdownhelper').click(function () {
		$.ajax({
			type : "GET",
			url : "help",
			success : function (data) {
				_myCodeMirror.setValue(data);
			}
		});
	});
	$('#submitarticle').click(function () {
		$("#formarticle").val(_myCodeMirror.getValue());
		$("#formarticlename").val($("#titleInput").val());
		$("#formarticletags").val($("#tagsInput").val());
		$("#formarticlesumm").val($("#summaryInput").val());
		$("#articleform").submit();
	});
});
