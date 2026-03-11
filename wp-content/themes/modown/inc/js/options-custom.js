jQuery(document).ready(function($) {
	$('.fade').delay(1000).fadeOut(1000);
	$('.of-color').wpColorPicker();
	$('.group').hide();
	var activetab = '';
	if (typeof(localStorage) != 'undefined') {
		activetab = localStorage.getItem("activetab")
	}
	if (activetab != '' && $(activetab).length) {
		$(activetab).fadeIn()
	} else {
		$('.group:first').fadeIn()
	}
	$('.group .collapsed').each(function() {
		$(this).find('input:checked').parent().parent().parent().nextAll().each(function() {
			if ($(this).hasClass('last')) {
				$(this).removeClass('hidden');
				return false
			}
			$(this).filter('.hidden').removeClass('hidden')
		})
	});
	if (activetab != '' && $(activetab + '-tab').length) {
		$(activetab + '-tab').addClass('nav-tab-active')
	} else {
		$('.nav-tab-wrapper a:first').addClass('nav-tab-active')
	}
	$('.nav-tab-wrapper a').click(function(evt) {
		$('.nav-tab-wrapper a').removeClass('nav-tab-active');
		$(this).addClass('nav-tab-active').blur();
		var clicked_group = $(this).attr('href');
		if (typeof(localStorage) != 'undefined') {
			localStorage.setItem("activetab", $(this).attr('href'))
		}
		$('.group').hide();
		$(clicked_group).fadeIn();
		evt.preventDefault();
		$('.wp-editor-wrap').each(function() {
			var editor_iframe = $(this).find('iframe');
			if (editor_iframe.height() < 30) {
				editor_iframe.css({
					'height': 'auto'
				})
			}
		})
	});
	$('.group .collapsed input:checkbox').click(unhideHidden);
	function unhideHidden() {
		if ($(this).attr('checked')) {
			$(this).parent().parent().parent().nextAll().removeClass('hidden')
		} else {
			$(this).parent().parent().parent().nextAll().each(function() {
				if ($(this).filter('.last').length) {
					$(this).addClass('hidden');
					return false
				}
				$(this).addClass('hidden')
			})
		}
	}
	$('.of-radio-img-img').click(function() {
		$(this).parent().parent().find('.of-radio-img-img').removeClass('of-radio-img-selected');
		$(this).addClass('of-radio-img-selected')
	});
	$('.section-colorradio .of-colorradio-label').click(function() {
		$(this).addClass('of-colorradio-label-selected').siblings('.of-colorradio-label').removeClass('of-colorradio-label-selected')
	});
	$('#mbt-theme-active').click(function() {
		var that = $(this);
		var username = $('#mbt_modia_username').val(),
		token = $('#mbt_modia_token').val();
		if ($.trim(username) == '') {
			alert('请输入模板兔用户名');
			return
		}
		if ($.trim(token) == '') {
			alert('请输入激活码');
			return
		}
		that.attr("disabled", "disabled").val('激活中...');
		$.ajax({
			url: _MBT.uri + "/inc/includes/class-options-admin.php",
			data: {
				theme: _MBT.theme,
				home: _MBT.home,
				username: username,
				token: token,
				action: 'active'
			},
			dataType: "json",
			type: "POST",
			success: function(t) {
				that.removeAttr("disabled").val('激活主题');
				if (1 == t.status) {
					alert(t.message);
					window.location.reload()
				} else {
					alert(t.message);
					window.location.reload()
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				that.removeAttr("disabled").val('激活主题');
				alert('如果刷新后可进行主题设置，即为激活成功！');
				window.location.reload()
			}
		})
	});
	$('#mbt-theme-check').click(function() {
		var that = $(this);
		that.attr("disabled", "disabled").text('检查中...');
		$.ajax({
			url: _MBT.uri + "/inc/includes/check.php",
			data: {
				theme: _MBT.theme,
				home: _MBT.home,
				action: 'check'
			},
			dataType: "json",
			type: "POST",
			success: function(t) {
				that.removeAttr("disabled").text('检查更新');
				if (1 == t.status) {
					alert('有更新可用，请到模板兔官网下载新版覆盖！')
				} else {
					alert('您当前版本是最新版，无需更新！')
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				that.removeAttr("disabled").text('检查更新');
				alert('检查异常，可在模板兔官网查看主题详情！')
			}
		})
	});
	$('#mbt-theme-restart').click(function() {
		var that = $(this);
		if(confirm("请勿频繁激活，否则我们有权禁封您的授权！确认删除当前激活然后重新激活主题？重新激活不影响主题已设置内容，但为保险起见，建议先备份数据库。")){
			that.attr("disabled", "disabled").text('处理中...');
			$.ajax({
				url: _MBT.uri + "/inc/includes/check.php",
				data: {
					theme: _MBT.theme,
					action: 'restart'
				},
				dataType: "json",
				type: "POST",
				success: function(t) {
					that.removeAttr("disabled").text('重新激活');
					if (1 == t.status) {
						location.reload();
					} else {
						alert('处理失败！')
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					that.removeAttr("disabled").text('重新激活');
					alert('处理失败！')
				}
			})
		}
	});
});