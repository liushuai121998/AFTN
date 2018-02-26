// $(function() {

// })
	// 滚动条
//	$(".list_content").mCustomScrollbar({
//	    axis:"y",
//	    theme: 'minimal-dark',
//	    setTop: 0,
//	    scrollInertia: 0,
//	    scrollbarPosition: 'inside'
//	});
	$(".list_content").niceScroll({
		cursorcolor: '#999',
		cursorwidth: '10px',
		cursorminheight: 40,
		railpadding: { top: 0, right: 5, left: 0, bottom: 0},
		horizrailenabled: false,
		oneaxismousemode: false,
		preventmultitouchscrolling: false
	})

    $('#div_date_demo3').hide()    
    
    // 获取当前的航班数据
    getJson('flight/aftnflight', getPlaneData.bind(null, 'plane'), '{"isHis": 0}')
    
    
    //	日历的显示隐藏
    showCalendar($('.select_cur_his'), $('#div_date_demo3'))
/**
 * 显示航班列表的详情
 */
// 绑定点击事件 显示详情列表 modal


function showPlaneDetail(id, fn) {
	// 通过id发送ajax
	var param = {
		type: 1,
		id: Number(id)
	}
	getJson('/message/listbyid', function (data) {
		
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




// 检索框的搜索功能
planeSearch($('.plane_wrap'), function ($input) {
	
	resultShow($input, filterData.plane.data, 'plane')
	
})	    



// 模拟新增数据
$('.mock_add').click(function () {
	
//	$('.table_content tr[data-id='+targetId+']').offset()
	
	var $target = $('.common_table .table_content tr[data-id='+target.id+']')	
	$target.find('td').css({
		background: '#BAE0F3'
	})
	
	var len = $target.prevAll().length
	
	$target.parent().parent().parent().animate({
		scrollTop: (len - 9) * 34 + 'px'
	})
	
	
	return
	var data = {
                "id":6,
                "flightNo":"6AA8701",
                "operationDate":"2017-05-01",
                "orgnAirPort":"VPPP",
				"destAirPort":"NPPN",
				"fplD": "1130",
				"fplA": "0830",
				"atd": "--",
				"ata": "--",
				"passtime": "09h50",
				"acRegNo": "343",
				"acType": "557",
				"changeAirPort": "PSPD",
				"taskCode": "补班",
				"ssr": "5435",
				"lastUpdate": "0425 12:30",
				"isCnl": "是",
				"operate":"A"
				
			}
	var $tr = resolveAdd(data)
	
	var $tbody = $('.plane_list_wrap .list_content .table tbody')
	
	var insertDom = function (status) {
		
		sortCache.cloneData.push(data)
		sortCache.cloneData.sort(function (a, b) {
			
			return status === 2 ? a[sortCache.flag] < b[sortCache.flag] : a[sortCache.flag] > b[sortCache.flag]
		})
		
		var index = sortCache.cloneData.indexOf(data)
		// 前一条数据
		
		var prevId = sortCache.cloneData[index - 1].id
		
		
		var $prevTd = $tbody.find('tr[data-id='+String(prevId)+']')
		
		$prevTd.after($tr)
		
	}
	switch (sortCache.status) {
		case 0: 
		// 无排序状态
		sortCache.cloneData.push(data)
		$tbody.append($tr)
		break
		case 1:
		
		// 降序状态
		insertDom(1)
		break
		case 2:
		// 升序状态
		insertDom(2)
		break
	}
	
})


// 解析新增的数据
/**
 * 
 * @param {Object} data
 */
function resolveAdd (data) {
	
	var $tr = $('<tr></tr>')
	
	var length = sortCache.cloneData&&sortCache.cloneData.length || 4
	
	var tdStr = '<td>'+(length + 1)+'</td>'
	for(var i in data) {
		
		if(i === 'id') {
			
			$tr.attr('data-id', data[i])
			
		}else if(i === 'operationDate') {
			
			var str = data[i].slice(5)
	        tdStr = tdStr + '<td>' + str + '</td>'
			
		} else if (i != 'operate') {
			tdStr = tdStr + '<td>' + data[i] + '</td>'
		}
		
	}
	$tr.html(tdStr)
	
	return $tr
}


// 搜索框的样式
searchInputCss()


MediaObj.register('plane', 'A', function (data) {
	// 新增
	Manage['A']['plane'](data, 'plane')
	
})

MediaObj.register('plane', 'U', function (data) {
	// 更新
	Manage['U']['plane'](data, 'plane')
})

MediaObj.register('plane', 'D', function (data) {
	// 删除
	Manage['D']['plane'](data, 'plane')
})


// 多条件过滤
complexFilter.init('plane')

$('.end_thumb').mousedown(function (ev) {
	ev.preventDefault()
	selectTimeSect.call(this, ev, false)
})

$('.start_thumb').mousedown(function (ev) {
	ev.preventDefault()
	selectTimeSect.call(this, ev, true)
})

// 重置按钮
$('.reset_btn').click(function () {
	var state = $('.select_cur_his').val()
	// 当前和历史的状态
	if(state === 'current') {
		resetData[state]('flight/aftnflight', function (data) {
			
			var returnRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content .table_content tbody'), {
			        body: data.c.flights,
			        isArrow: false,
			        flag: typeFlag['plane'].flag
			    }, 'plane').init()
			returnRes.bindEvent.call(returnRes, showPlaneDetail)
			// 重新开启定时器
			updateInfo(data.c.flights, 'plane', timeCell, '/flight/aftnflight')	
			
		}, 'plane')
		
	} else {
		resetData[state]()
	} 
	
})

nstSlideTime()


$('.plane_list_wrap .list_content').each(function () {
	this.data = {
		l:  this.scrollLeft
	}
}).scroll(function () {
	// 横向滚动
	if(this.data.l != this.scrollLeft) {
		$('.plane_list_wrap .list_header').css({
		left: -this.scrollLeft + 'px'
		})
		$('.plane_list_wrap .list_header').find('th:first-child').css({
			left: this.scrollLeft + 'px'
		})
		this.data.l = this.scrollLeft
		$(this).find('tr>td:first-child').css({
			left: this.scrollLeft + 'px'
		})
	}
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
