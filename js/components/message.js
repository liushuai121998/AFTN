 //  日历控件
    // 默认显示当前航班 		日历隐藏
    $('#div_date_demo3').hide()
	$(".list_content").niceScroll({
		cursorcolor: '#999',
		cursorwidth: '10px',
		cursorminheight: 40,
		railpadding: { top: 0, right: 0, left: 0, bottom: 0},
		horizrailenabled: false
	})

	$(".detail_content").niceScroll({
		cursorcolor: '#999',
		cursorwidth: '10px',
		cursorminheight: 40,
		railpadding: { top: 0, right: 0, left: 0, bottom: 0},
	})
	
	var body = []   
	/**
	 * 获取数据渲染页面
	 * @param {Object} data
	 */
	function getInitData (data) {
		
		if(data.c.flag === 0 && data.c.errorCode === '004') {
			showMsg('没有数据')
			$('.common_table').hide()
		}
		
//		var flag = ['index', 'msgType', 'sequence', 'fileName', 'sender', 'qfTime', 'pfTime', 'recvTime', 'lastUpdate', 'bz']
		if(data.c.flag === 1) {
			$('.common_table').show()
			    new ListHeader(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_header'), {
			        header: ['序号', '报文类型', '流水号', '文件名', '发送者', '签发时间', '派发时间', '接收时间', '处理时间', '处理状态'],
			    }).init()
			// 默认按照 接受的时间倒序排列
//			sortDao(data.c.messages, 'recvTime')
			
			// 保留时间戳
			saveTime.message.time = data.c.time
			
			var messageRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content .table_content tbody'), {
		        body: data.c.messages,
		        isArrow: false,
		        flag: typeFlag['message'].flag
		    }).init()
		    
		    // 默认显示第一个
		    showRightDetail(data.c.messages[0].id, function (str) {
		    	$('.detail_content').html(str)
		    })
//		    messageModalDetail(messageRes)
		    
//		    scrollLoad(data.c.messages.slice(start, end), start, end)

		    filterData.message.data = data.c.messages
		    filterData.message.initData = deepCloneObj(data.c.messages)
		    
		    new SearchFilter($('.search_btn .main_btn'), $('.select_cur_his'), data.c.messages, 'message')
		    
		    // 每隔10秒请求一次
			updateInfo(data.c.messages, 'message', timeCell, '/message/list')
		    
		}
	}
	
	(function () {
		var paramInit = {
			"isHis": 0
		}
		getJson('message/list', getInitData, JSON.stringify(paramInit))
	})();
	
    
    // 报文列表的过滤
//  triggerFilter({
//  	flag: 'messageType',	// 标识 报文类型
//  	showInfo: {
//  		$el: $('.select_show'),
//  		isChange: true,			// 是否是change 事件
//  		data: body
//  	},
//  	filterFlag: 'message'
//  }, {
//  	flag: 'time',
//  	showInfo: {
//  		$el: $('.ta_btn'),
//  		isChange: false, 		// click事件
//  		data: body
//  	},
//  	filterFlag: 'message'
//  })
	
    
    //	日历的显示隐藏
    showCalendar($('.select_cur_his'), $('#div_date_demo3'))

$('.message_type').click(function (ev) {
	ev.stopPropagation()
	var $target = $(ev.target)
	var $messageA = $(this).find('a')
	var $title = $('.message_type_title')
	if(ev.target.nodeName.toLowerCase() === 'a') {
		
		$messageA.removeClass('active')
		$messageA.next().hide()
		
//		ev.target.isToggle = !ev.target.isToggle
		$target.addClass('active')
		
		$title.html($target.html())
		$target.next().show().find('li').addClass('selected_active').find('.selected_type').show()
//		$target.next() && ev.target.isToggle ? $target.next().show().find('input').prop('checked', true) : $target.next().hide()
		
		// return false 禁止点击a链接时隐藏
		return false
	}else if(ev.target.nodeName.toLowerCase() === 'li') {
		
		var $selectedType = $target.find('.selected_type')
		$target.hasClass('selected_active') ? $target.removeClass('selected_active') && $selectedType.hide() : $target.addClass('selected_active') && $selectedType.show()
		
		return false
	} else if(ev.target.nodeName.toLowerCase() === 'span') { 
		var $selectedType = $target.parent().find('.selected_type')
		$target.parent().hasClass('selected_active') ? $target.parent().removeClass('selected_active') && $selectedType.hide() : $target.parent().addClass('selected_active') && $selectedType.show()
		return false
	} else if(ev.target.nodeName.toLowerCase() === 'i') {
		
		var $selectedType = $target.parent().parent().find('.selected_type')
		$target.parent().parent().hasClass('selected_active') ? $target.parent().parent().removeClass('selected_active') && $selectedType.hide() : $target.parent().parent().addClass('selected_active') && $selectedType.show()
		
		return false
	}
	
})
//$('.message_type').find('li').hover(function (ev) {
//	
//	if(ev.target.nodeName.toLowerCase() === 'a' && $(ev.target).next()) {
//		$(ev.target).next().show()
//	}
//	
//}, function (ev) {
//	
//	if(ev.target.nodeName.toLowerCase() === 'a' && $(ev.target).next()) {
//		$(ev.target).next().hide()
//	}
//	
//})

// 搜索框的样式
searchInputCss()

// 倒序排列
/**
 * 根据接收的时间倒序
 * @param {Object} data
 */
function sortDao (data, type) {
	data.sort(function (a, b) {
				 if  (a[type] > b[type]) {
	             	 return  -1;
		        }  else   if  (a[type] < b[type]) {
		             return  1;
		        }  else  {
		             return  0;
		        }
			})
}


// 检索框的搜索功能
planeSearch($('.message_wrap'), function ($input) {
//	 resultShow($input, filterData.message.data, 'message')
})


// 实时更新
MediaObj.register('message', 'A', function (data) {
	// 新增
	Manage['A']['message'](data, 'message')
	
})
MediaObj.register('message', 'U', function (data) {
	// 更新
	Manage['U']['message'](data, 'message')
})
//
MediaObj.register('message', 'D', function (data) {
	// 删除
	Manage['D']['message'](data, 'message')
	
})

// 多条件过滤
complexFilter.init()

// 多条件选择
$('.end_thumb').mousedown(function (ev) {
	selectTimeSect.call(this, ev, false)
})

$('.start_thumb').mousedown(function (ev) {
	selectTimeSect.call(this, ev, true)
})


// 重置按钮
$('.reset_btn').click(function () {
	
	var state = $('.select_cur_his').val()
	// 当前和历史的状态
	console.log(state)
	if(state === 'current') {
		
		resetData[state]('message/list', function (data) {
			var returnRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content .table_content tbody'), {
			        body: data.c.messages,
			        isArrow: false,
			        flag: typeFlag['message'].flag
			    }, 'message').init()
			// 重新开启定时器
			updateInfo(data.c.messages, 'message', timeCell, '/message/list')		
		})
		
	} else {
		resetData[state]()
	} 
	
})

nstSlideTime()


$('.message_list_wrap .list_content').each(function () {
	this.data = {
		l:  this.scrollLeft
	}
}).scroll(function () {
	// 横向滚动
	if(this.data.l != this.scrollLeft) {
		$('.message_list_wrap .list_header').css({
		left: -this.scrollLeft + 'px'
		})
		$('.message_list_wrap .list_header').find('th:first-child').css({
			left: this.scrollLeft + 'px'
		})
		this.data.l = this.scrollLeft
		$(this).find('tr>td:first-child').css({
			left: this.scrollLeft + 'px'
		})
	}
})
