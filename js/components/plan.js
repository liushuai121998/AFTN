    //  日历控件
    
    $('#div_date_demo3').hide()
    // 滚动条	
    $(".list_content").niceScroll({
		cursorcolor: '#999',
		cursorwidth: '10px',
		cursorminheight: 40,
		railpadding: { top: 0, right: 5, left: 0, bottom: 0},
		horizrailenabled: false
	})
    
    $('#detailShow .list_content').niceScroll({
    	cursorcolor: '#999',
    	cursorwidth: '10px',
    	cursorminheight: 40,
		railpadding: { top: 0, right: 0, left: 0, bottom: 0},
    })
    
//
//  new ListHeader(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_header'), {
//      header: ['序号', '航班号', '飞行日期', '起飞', '落地', '计划起飞', '计划到达', '实际起飞', '实际到达', '飞行时长', '机号', '机型', '备降', '类型', 'SSR编码', '更新时间', '是否取消']
//  }, true).init()
//	getPage('./components/plane/plane.json', function (data) {
//		hideLoading()
//		var returnRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content'), {
//	        body: data.flights,
//	        isArrow: false
//	    }, 'plane').init()
//	    
//	    returnRes.bindEvent.call(returnRes, showPlaneDetail)
//		messageScroll()
//		
//	})
    //	日历的显示隐藏
    showCalendar($('.select_cur_his'), $('#div_date_demo3'))
    // 获取当前航班计划数据
    getJson('flight/flightplan', getPlaneData.bind(null, 'plan'), '{"isHis": 0}')
    
// 搜索框的样式
searchInputCss()

planeSearch($('.plane_wrap'), function ($input) {
	 
	resultShow($input, filterData.plane.data, 'plane')
	
})

function showPlaneDetail(id, fn) {
	// 通过id发送ajax
	var param = {
		type: 2,
		id: Number(id)
	}
	getJson('/message/listbyid', function (data) {
		if(data.c.flag === 0 && data.c.errorCode === '004') {
			showMsg('没有数据')
		}
		if(data.c.flag === 1) {
			
			new ListHeader(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('#detailShow .list_header'), {
		        header: ['序号', '报文类型', '流水号', '文件名', '发送者', '签发时间', '派发时间', '接收时间', '处理时间'],
		        flag: typeFlag['message'].flag,
		    }).init()
	    
			new AbleManaBody(['table', 'sl_table', 'mytable-S'], $('#detailShow .list_content .table_content tbody'), {
		        body: data.c.messages,
		        isArrow: true,
		        flag: typeFlag['message'].flag,
		    }, 'plane_detail').init()
		    
		    
		    $('.total_num').html('报文共计'+data.c.messages.length+'条')
		    
			fn && fn()
		}
		
	}, JSON.stringify(param))
	
}

$('.mock_add').click(function () {
	
//	$('.table_content tr[data-id='+targetId+']').offset()
	
//	var $target = $('.common_table .table_content tr[data-id='+target.id+']')
//	
//	$target.find('td').css({
//		background: '#BAE0F3'
//	})
//	
//	var len = $target.prevAll().length 
//	$target.parent().parent().parent().animate({
//		scrollTop: (len - 9) * 39 + 'px'
//	})
	
})

//MediaObj.register('plan', 'A', function (data) {
//	// 新增
//	Manage['A']['plan'](data, 'plan')
//	
//})
//
//MediaObj.register('plan', 'U', function (data) {
//	// 更新
//	Manage['U']['plan'](data, 'plan')
//})
//
//MediaObj.register('plan', 'D', function (data) {
//	// 删除
//	Manage['D']['plan'](data, 'plan')
//})

// 多条件过滤
complexFilter.init('plan')


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
	if(state === 'current') {
		
		resetData[state]('flight/flightplan', function (data) {
			var returnRes =new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content .table_content tbody'), {
			        body: data.c.flights,
			        isArrow: false,
			        flag: typeFlag['plan'].flag
			    }, 'plan').init()
			returnRes.bindEvent.call(returnRes, showPlaneDetail)
		}, 'plan')
	} else {
		resetData[state]()
	} 
	
})

nstSlideTime ()

$('.plan_list_wrap .list_content').scroll(function () {
	$('.plan_list_wrap .list_header').css({
		left: -this.scrollLeft + 'px'
	})
	$('.plan_list_wrap .list_header').find('th:first-child').css({
		left: this.scrollLeft + 'px'
	})
	$('.plan_list_wrap .list_content').find('td:first-child').css({
		left: this.scrollLeft + 'px'
	})
})

$('#detailShow .list_content').each(function () {
	this.data = {
		l: this.scrollLeft
	}
}).scroll(function () {
	if(this.data.l != this.scrollLeft) {
		$('#detailShow .list_header').css({
		left: -this.scrollLeft + 'px'
		})
		$('#detailShow .list_header').find('th:first-child').css({
			left: this.scrollLeft + 'px'
		})
		this.data.l = this.scrollLeft
		if(typeof saveLeft) {
			saveLeft.left = this.scrollLeft
		}
		$(this).find('tr>td:first-child').css({
			left: this.scrollLeft + 'px'
		})
	}
})