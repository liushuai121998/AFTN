/*created by ls 2017/8/3*/
/**
 * 列表显示的公共方法
 */
/**
 * List 列表基类
 */
var List = function(tableClass) {

    this.tableClass = tableClass
    this.$table = $('<table></table>')
    
    if (Array.isArray(this.tableClass)) {
        var cName = ''
        this.tableClass.forEach(function(className) {
            cName = cName + ' ' + className
        })
        this.$table.attr('class', cName)
    }
    
    this.$thead = $('<thead></thead>')
    this.$tbody = $('<tbody></tbody>')
    this.$parent = $('.list_content')

}
List.prototype.init = function() {
    this.$table.append(this.$thead)
    this.$table.append(this.$tbody)
    this.$parent.html(this.$table)
}

/**
 * 表头
 * @param {*} data 
 */
var ListHeader = function(tableClass, parent, data, isSort, bodyData, type) {
    List.call(this, tableClass)
    this.$parent = parent
    this.$headTr = $('<tr></tr>')
    this.thArr = []
    // 是否排序
    this.isSort = isSort ? isSort : false
    this.type = type || 'message'
    this.bodyData = bodyData || []
    
    if (!data || !data.header) {
        return
    }
    var i = 1,
        len = data.header.length,
        header = data.header;
        
    if(this.isSort && data.flag) {
    	// 航班列表排序
    	this.thArr.push('<th>'+header[0]+'</th>')
    	for (; i < len; i++) {
	        this.thArr.push($('<th data-flag='+data.flag[i-1]+'>' + header[i] + '<span class="sort_plane"><i class="panel-icon">&#xe70c;</i></span></th>'))
	    }
    	
    }else {
    	this.thArr.push('<th>'+header[0]+'</th>')
    	for (; i < len; i++) {
	        this.thArr.push($('<th>' + header[i] + '</th>'))
	    }
    }
}

ListHeader.prototype = new List()
ListHeader.prototype.init = function() {
    var me = this
    me.$thead.html('')
    this.thArr.forEach(function($th) {
        me.$headTr.append($th)
    })
    this.$thead.append(this.$headTr)
    List.prototype.init.call(this)
//  this.thArr = []
    // 航班报 表头
    this.isSort && this.bindSort()
    return this.$thead
}
// 绑定排序
ListHeader.prototype.bindSort = function () {
	var that = this
	
	sortCache.cloneData = deepCloneObj(this.bodyData)
	// 原始数据
	sortCache.initData = deepCloneObj(this.bodyData)
	
	this.thArr.forEach(function ($th, index) {
		// 排序的操作
		$th.count = 0
		if(index !== 0) {
			sortPlane($th, that.type)
		}
		
	})
}

/**
 * 表格内容区
 * @param {*} data 
 */
var ListBody = function(tableClass, parent, data) {
    List.call(this, tableClass)
    this.$parent = parent
    this.trArr = []
    this.data = data
    // 判断是否添加展开详情
    this.isArrow = data && data.isArrow || false
    
    this.trStrArr = []
}
ListBody.prototype = new List()
    /**
     * init
     */
ListBody.prototype.init = function() {
	
        this.createTr()
        
        var me = this
        me.$tbody.html('') 
//      this.trArr.forEach(function($tr) {
//          //me.$tbody.append($tr)
//          me.$tbody.empty().html($tr);
//      })
		
		me.$tbody.empty().html(this.trStrArr)
		console.time('start')
        // 字符串的拼接
//      var str = ''
//      this.trStrArr.forEach(function(trStr) {
//          str = str + trStr
//      })
//      
//      this.$tbody.append(str)
        
	    $(function () {
	        	
	    	console.timeEnd('start')
	    })
        
        List.prototype.init.call(this)
}
    /**
     * createTr
     */
ListBody.prototype.createTr = function() {
    var i = 0,
        len = this.data.body.length,
        body = this.data.body;
    for (; i < len; i++) {
        var $tr = $('<tr data-id='+body[i].id+'></tr>')
        
        // 字符串的拼接
        var trStr = '<tr data-id='+body[i].id+'>'
        if (typeof body[i] === 'object') {
        	
            var tdStr = '<td>'+(i + 1)+'</td>'
            
            for (var j in body[i]) {
            	if(j === 'id' || j === 'operate') {
            		
            	} else {
            		tdStr = tdStr + '<td>' + body[i][j] + '</td>'
            	}
                
            }
            trStr = trStr + tdStr + '</tr>'
//          tdStr = this.isArrow ? tdStr + '<td><span><i class="panel-icon" data-flag="fold">&#xe62b;</i></span></td>' : tdStr
            //$tr.html(tdStr)
            
        }
        //this.trStrArr.push(trStr)
        //this.trArr.push($tr)
        trStr += trStr;
    }
    this.trStrArr = trStr
}
ListBody.prototype.bindEvent = function () {
//	this.isArrow ? bindClick(this.trArr, true) : bindClick(this.trArr, false)	
}

/**
 * 有权限管理的table
 * @param {*} tableClass 
 * @param {*} parent 
 * @param {*} data 
 */
var target = {
	
}

var AbleManaBody = function(tableClass, parent, data, type, isHistory) {
//  ListBody.call(this, tableClass, parent, data)
	this.data = data || []
    this.parent = parent
    this.type = type || 'message'
    this.flag = this.data.flag || []
    this.isHistory = isHistory || false
    this.targetId = this.data.targetId || 0

}
//AbleManaBody.prototype = new ListBody()
inheritPrototype(AbleManaBody, ListBody)

AbleManaBody.prototype.createTr = function() {
	
    var i = 0,
    	len = this.data.body.length,
        body = this.data.body;
    
	var start = this.data.start || 0
	var end = this.data.end || len
	var flag = this.flag
    
    var trStr = ''
    
    if(this.type === 'message') {
    	
    	for (; i < len; i++) {
    		
    		var str8 = manageTypeStatu(body[i][flag[8]])
    		
    		trStr += '<tr data-id='+body[i].id+'><td>'+(i+1)+'</td><td>'+(body[i][flag[0]] || "--")+'</td><td>'+(body[i][flag[1]] || "--")+'</td><td>'+(body[i][flag[2]] && body[i][flag[2]].slice(0, -4) || "--")+'</td><td>'+(body[i][flag[3]] || "--")+'</td><td>'+(body[i][flag[4]] && body[i][flag[4]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[i][flag[5]] && body[i][flag[5]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[i][flag[6]] && body[i][flag[6]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[i][flag[7]] && body[i][flag[7]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+str8+'</td></tr>'
	    }
    } else if(this.type === 'plane') {
    	for (; i < len; i++) {
    		
    			// 初始化居中的设置
    			if(!this.isHistory && this.targetId === body[i].id) {
	    			target.i = i
	    			
	    			$('.common_table .list_content').animate({
						scrollTop: (target.i - 9) * 38 + 'px'
					})
	    			
    				trStr += '<tr class="closing_current" data-id='+body[i].id+'><td>'+(i+1)+'</td><td>'+body[i][flag[0]]+'</td><td>'+(body[i][flag[1]].slice(5))+'</td><td>'+body[i][flag[2]]+'</td><td>'+body[i][flag[3]]+'</td><td style="position: relative">'+ (body[i][flag[4]] && (body[i][flag[4]].slice(10, -3).replace('-', '') + manageTimeDate(body[i][flag[1]], body[i][flag[4]].slice(0, -9))) || "--")+'</td><td style="position: relative">'+(body[i][flag[5]] && (body[i][flag[5]].slice(10, -3).replace('-', '') + manageTimeDate(body[i][flag[1]], body[i][flag[5]].slice(0, -9))) || "--")+'</td><td style="position: relative">'+(body[i][flag[6]] && (body[i][flag[6]].slice(10, -3).replace('-', '') + manageTimeDate(body[i][flag[1]], body[i][flag[6]].slice(0, -9))) || "--")+'</td><td style="position: relative">'+(body[i][flag[7]] && (body[i][flag[7]].slice(10, -3).replace('-', '') + manageTimeDate(body[i][flag[1]], body[i][flag[7]].slice(0, -9))) || "--")+'</td><td>'+(body[i][flag[8]] || "--")+'</td><td>'+(body[i][flag[9]] || "--")+'</td><td>'+(body[i][flag[10]] || "--")+'</td><td>'+(body[i][flag[11]] || "--")+'</td><td>'+(body[i][flag[12]] || "--")+'</td><td>'+(body[i][flag[13]] || "--")+'</td><td>'+(body[i][flag[14]] && body[i][flag[14]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[i][flag[15]] || "--")+'</td></tr>'
	    			
	    		} else {
    				trStr += '<tr data-id='+body[i].id+'><td>'+(i+1)+'</td><td>'+body[i][flag[0]]+'</td><td>'+(body[i][flag[1]].slice(5))+'</td><td>'+body[i][flag[2]]+'</td><td>'+body[i][flag[3]]+'</td><td style="position: relative">'+ (body[i][flag[4]] && (body[i][flag[4]].slice(10, -3).replace('-', '') + manageTimeDate(body[i][flag[1]], body[i][flag[4]].slice(0, -9)))|| "--")+'</td><td style="position: relative">'+(body[i][flag[5]] && (body[i][flag[5]].slice(10, -3).replace('-', '') + manageTimeDate(body[i][flag[1]], body[i][flag[5]].slice(0, -9))) || "--")+'</td><td style="position: relative">'+(body[i][flag[6]] && (body[i][flag[6]].slice(10, -3).replace('-', '') + manageTimeDate(body[i][flag[1]], body[i][flag[6]].slice(0, -9))) || "--")+'</td><td style="position: relative">'+(body[i][flag[7]] && (body[i][flag[7]].slice(10, -3).replace('-', '') + manageTimeDate(body[i][flag[1]], body[i][flag[7]].slice(0, -9))) || "--")+'</td><td>'+(body[i][flag[8]] || "--")+'</td><td>'+(body[i][flag[9]] || "--")+'</td><td>'+(body[i][flag[10]] || "--")+'</td><td>'+(body[i][flag[11]] || "--")+'</td><td>'+(body[i][flag[12]] || "--")+'</td><td>'+(body[i][flag[13]] || "--")+'</td><td>'+(body[i][flag[14]] && body[i][flag[14]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[i][flag[15]] || "--")+'</td></tr>'
	    			
	    		}
	   } 
    	
  	} else if(this.type === 'plan') {
	   		for (; i < len; i++) {
    				trStr += '<tr data-id='+body[i].id+'><td>'+(i+1)+'</td><td>'+body[i][flag[0]]+'</td><td>'+(body[i][flag[1]].slice(5))+'</td><td>'+body[i][flag[2]]+'</td><td>'+body[i][flag[3]]+'</td><td style="position: relative">'+ (body[i][flag[4]] && (body[i][flag[4]].slice(10, -3).replace('-', '') + manageTimeDate(body[i][flag[1]], body[i][flag[4]].slice(0, -9))) || "--")+'</td><td style="position: relative">'+(body[i][flag[5]] && (body[i][flag[5]].slice(10, -3).replace('-', '') + manageTimeDate(body[i][flag[1]], body[i][flag[5]].slice(0, -9))) || "--")+'</td><td>'+(body[i][flag[6]] || "--")+'</td><td>'+(body[i][flag[7]] ||  "--")+'</td><td>'+(body[i][flag[8]] || "--")+'</td><td>'+(body[i][flag[9]] || "--")+'</td><td>'+(body[i][flag[10]] && body[i][flag[10]].slice(10, -3).replace('-', '') || "--")+'</td><td>'+(body[i][flag[11]] || "N")+'</td></tr>'
	    	}
	} else if(this.type === 'plane_detail') {
		// 报文（航班）详情
		for (; i < len; i++) {
    		trStr += '<tr data-id='+body[i].id+'><td>'+(i+1)+'</td><td>'+(body[i][flag[0]] || "--")+'</td><td>'+(body[i][flag[1]] || "--")+'</td><td>'+(body[i][flag[2]] && body[i][flag[2]].slice(0, -4) || "--")+'</td><td>'+(body[i][flag[3]] || "--")+'</td><td>'+(body[i][flag[4]] && body[i][flag[4]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[i][flag[5]] && body[i][flag[5]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[i][flag[6]] && body[i][flag[6]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[i][flag[7]] && body[i][flag[7]].slice(5, -3).replace('-', '') || "--")+'</td></tr>'
	    }
	}
    
    this.parent.html(trStr)
    
//  this.parent.find('td').outerHeight($('.list_content').height()/20)
    return this
}

AbleManaBody.prototype.init = function(fn) {
	fn && fn()
	this.createTr()
	
   	this.type === 'plane_detail' ? bindDetailClick(this.trArr, this.type, fn) : this.bindEvent()
    
    return this
}

AbleManaBody.prototype.bindEvent = function(fn) {

    bindClick(this.trArr, true, this.type, fn)
    
}

/**
 * 寄生组合继承
 * @param {Object} subClass
 * @param {Object} superClass
 */
function inheritPrototype (subClass, superClass) {
	var F = function () {}
	F.prototype = superClass.prototype
	
	subClass.prototype = new F()
	
	subClass.prototype.constructor = subClass
	
}


// 计划起飞	计划到达	实际起飞	实际到达	+1 -1 与飞行日期的时间对比
/**
 * 
 * @param {Object} flightDate
 * @param {Object} time
 */
function manageTimeDate (flightDate, time) {
	 var aBgnDate, aEndDate;
           var oBgnDate, oEndDate;
           var charM;
           aBgnDate = flightDate.split('-');
           aEndDate = time.split('-');
           oBgnDate = new Date(aBgnDate[0], aBgnDate[1], aBgnDate[2]).getTime();
           oEndDate = new Date(aEndDate[0], aEndDate[1], aEndDate[2]).getTime();
           //把相差的毫秒数转换为天数
           charM = parseInt((oEndDate - oBgnDate) / 1000 / 60 / 60 / 24);
//         console.log(flightDate, time, charM)
//	var dateM = flightDate.split('-')[1]	// 日期中的日
//	var timeM = time.split('-')[1]		// 时间中的日
//	var charM = timeM - dateM 	// 差值
	if(charM != 0) {
		if(charM > 0) {
			return '<span style="position: absolute; right: 20%; top: 0; font-size: 10px; color: #179086;">+'+charM+'</span>'
		} else {
			return '<span style="position: absolute; right: 20%; top: 0; font-size: 10px; color: red;">'+charM+'</span>'
		}
	} else {
		return ''
	}
}

// 解析报文的状态
/**
 * 处理报文的解析状态
 * @param {Object} status
 */
function manageTypeStatu (status) {
	var realStr = '正确报文'
	switch (status) {
		case '0':
			realStr = '<span style="color: #C64B48;">错误报文</span>' 
			break
		case '1':
			realStr = '<span>正确报文</span>'
			break
		case '2':
			realStr = '<span style="color: #556AA7;">未知报文</span>'
			break
		case '3':
			realStr = '<span>正确报文</span>'
			break
		case '4':
			realStr = '<span>正确报文</span>'
			break
	} 
	
	return realStr
}
/**
 * 为航班列表计划列表详情绑定事件
 * @param {Object} trArr
 * @param {Object} type
 * @param {Object} fn
 */
function bindDetailClick(trArr, type, fn) {
	var cache = {}
	if(type === 'plane_detail') {
			$('.fold_icon').hide()
			Array.prototype.forEach.call($($('.table_content')[0].getElementsByTagName('tr')), function (tr) {
			var $tr = $(tr)
			$tr.hover(function (ev) {
				cache.$foldIcon && cache.$foldIcon.remove()
				
				var $foldIcon = !$tr.isShow ? $('<div class="fold_wrap" style="cursor: pointer;"><i class="fold-icon fold_icon" data-flag="fold">&#xe62b;</i></div>') : $('<div class="fold_wrap fold_flag" style="cursor: pointer;"><i class="fold-icon fold_icon" data-flag="fold">&#xe720;</i></div>')
				
				type === 'weather' ? $('.list_content').append($foldIcon) : $('#detailShow .list_content').append($foldIcon)
				
				saveLeft.left = saveLeft.left || 0
				
				type === 'weather' ? $foldIcon.css({
					position: 'absolute',
					right: ($('.list_content')[0].offsetLeft - $('.list_content')[0].scrollLeft - saveLeft.left) + 'px',
					top: ($(this)[0].offsetTop + 12) + 'px'
				}) : $foldIcon.css({
					position: 'absolute',
					right: (10 - saveLeft.left) + 'px',
					top: ($(this)[0].offsetTop + 12) + 'px'
				})
				
				cache.$foldIcon = $foldIcon
				// 如果是连续点击的操作
				$foldIcon.find('.fold_icon').click(function (ev) {
					var that = this
//			        setTimeout(function () {
			        	ev.stopPropagation()
			        	ev.preventDefault()
			        	$(that).unbind('click') // 将之前绑定的click事件取消
			        	clickShow.call(that, $tr, function () {
			        		 // 重置滚动条
				        	$('#detailShow .list_content').getNiceScroll().show()
							$('#detailShow .list_content').getNiceScroll().resize()
			        	})
			        	
//			        }, 100)
			       
				})
				return false
				
			})
			// 双击
			$tr.dblclick(function (ev) {
					
				clickShow.call(cache.$foldIcon.find('.fold_icon'), $tr, function () {
					// 重置滚动条
					$('#detailShow .list_content').getNiceScroll().show()
					$('#detailShow .list_content').getNiceScroll().resize()
					
				})
				
			})
			

			
			})
			/**
			 * 单击或双击图标显示详情
			 * @param {Object} $tr
			 */
			function clickShow ($tr, fn) {
				
				if(type === 'plane_detail') {
						
						$('#detailShow .table_active').removeClass('table_active')
						
					} else {

						$('.table_active').removeClass('table_active')
						
					}
        			$tr.addClass('table_active')
        			
					// id 唯一标识
					var id = $tr.attr('data-id')
					
					var $msg = null
					
					$msg = cache[id] ? cache[id] : null
					
					var $target = $(this)
					
					$tr.isShow = !$tr.isShow
					
					if(!$msg) {
						var id = Number($tr.attr('data-id'))
					
						$msg = cache[id] = new ShowMessageDetail($tr, id)
						
					}
			        
			        $tr.isShow ? $target.html('&#xe720;') && $msg.show() : $target.html('&#xe62b;') && $msg.hide()
			        fn && fn()
			}

	}
		
	$('#detailShow .table_content').click(function (ev) {
		showDetailMsg (ev, true)
	})
}
/**
 * 
 * @param {Object} ev
 * @param {Object} isDetail
 */
function showDetailMsg (ev, isDetail) {
		var $tr = null
		if(ev.target.nodeName.toLowerCase() === 'tr') {
			$tr = $(ev.target)
		} else if (ev.target.nodeName.toLowerCase() === 'td') {
			$tr = $(ev.target).parent()
		} else if(ev.target.nodeName.toLowerCase() === 'tbody') {
			return 
		} else if(ev.target.nodeName.toLowerCase() === 'span') {
			$tr = $(ev.target).parent().parent()
		}
		
		// 新增的tr
		if(ev.target.nodeName.toLowerCase() === 'div' || $(ev.target).hasClass('msg_detail_content_item')) {
				return	
		}
			if(isDetail) {
				$('#detailShow .table_active').removeClass('table_active')
	        	
	        	$tr && $tr.addClass('table_active')
			}else {
	        	
	        	$('.common_table .table_active').removeClass('table_active')
	        	
	        	$tr && $tr.addClass('table_active')
	        	
	        }
		return $tr
	}
/**
 * 
 * 
 * 绑定点击事件 显示报文列表
 * @param {Object} trArr 
 * @param {Object} isManage 是否是点击的manage_icon
 * @param {Object} fn 回调函数 每个列表的显示详情函数
 */
function bindClick (trArr, isManage, type, fn) {
	// 显示 tooltip
	$('.table_content tbody').unbind('mousemove')
	$('.table_content tbody').mouseover(function (ev) {
			
			if(ev.target.nodeName.toLowerCase() === 'td') {	
				
				if($(ev.target).css('text-overflow') === 'ellipsis' && $(ev.target).html().length > 5) {
					var title = $(ev.target).html()
					$(ev.target).attr({
						"data-toggle": 'tooltip',
						"data-placement": 'left',
						"data-title": title
					})
					$(ev.target).tooltip('show')	
				}
			}
		})
	
	$('.common_table .table_content').unbind('click')	
	$('.common_table .table_content').click(function (ev) {
		var $tr = showDetailMsg(ev, false)
		$('.closing_current').removeClass('closing_current')
		if(type === 'plane' || type === 'plan') {
	            	// 显示详情
	            	if(fn) {
	            		
	            		new DetailShow($('#detailShow'), $('#detailShow .modal-body'), fn, $tr.attr('data-id')).show()
	            		
	            	} else {
	            		
	            		new DetailShow($('#detailShow'), $('#detailShow .modal-body')).show()
	            		
	            	}
	            	
	            } else {
	            	 $tr && showRightDetail(Number($tr.attr('data-id')), function (str) {
	            	 	$('.detail_content').html(str)
	            	 })
	            	 
	            }
    })
}

/**
 * 创建一个表头与tbody合并的表格
 * @param {*} tableClass 
 * @param {*} parent 
 * @param {*} data 
 */
//function ListTable(tableClass, parent, data, type) {
//  ListHeader.call(this, tableClass, parent, data)
//  ListBody.call(this, tableClass, parent, data)
//  this.type = type || 'plane'
//}
//ListTable.prototype = new ListBody()
//ListTable.prototype.init = function() {
//	
//  ListHeader.prototype.init.call(this)
//  ListBody.prototype.init.call(this)
//  
//  this.bindEvent()
//}
//ListTable.prototype.bindEvent = function () {
//		
//	bindClick(this.trArr, true, this.type)
//}

// 详情显示列表
/**
 * 点击详情显示列表 modal
 * @param {Object} $el
 * @param {Object} $modalBody
 */
function DetailShow($el, $modalBody, fn, id) {
    this.$el = $el
    this.$modalBody = $modalBody || null
    this.fn = fn || function () {}
    
    this.id = id || 0
}
DetailShow.prototype.show = function() {
    
	this.fn(this.id, function () {
	    
	    this.$el.modal('show')
	    
	    // 去掉半透明效果
	    $(".modal-backdrop").remove()
	    
	}.bind(this))
}
DetailShow.prototype.hide = function() {
    this.$el.modal('hide')
}

/**
 * 隐藏modal 列表详情的modal
 */
hideDetail()
function hideDetail() {
	
    $('.modal-dialog').find('.modal-content').click(function(ev) {
        ev.stopPropagation()
    })
    $('.modal-dialog').click(function() {
        new DetailShow($('#detailShow')).hide()
    })
    $('.close').click(function() {
        new DetailShow($('#detailShow')).hide()
    })
    
}

/**
 * 点击折叠按钮显示这条数据报文的详情
 * @param {Object} $tr
 * @param {Object} data
 */
function ShowMessageDetail($tr, id) {
	
    this.$tr = $tr
    this.id = id
    this.$msg = $('<tr></tr>')
    
    var length = this.$tr.find('td').length
    this.tdLength = length
    
    this.$td = $('<td class="msg_detail_content_item" colspan='+length+'></td>')
    
    this.$msg.attr('class', 'msg_detail_content')
    
    
}
ShowMessageDetail.prototype.init = function () {
	this.createMsg()
//	this.handleData()
	return this
}


ShowMessageDetail.prototype.createMsg = function() {
	
//	this.$td.outerWidth($('.list_content').outerWidth() - 18)
	
	this.$td.css({
		left: saveLeft.left,
		display: 'table-cell',
		'padding-left': '50px',
		'box-sizing': 'border-box'
	})
	// this.$td.html(this.data)

	
}
ShowMessageDetail.prototype.show = function () {
	
	this.createMsg()
	
	showRightDetail(this.id, renderContent.bind(this))
	
	// 数据请求到之后渲染详情
	function renderContent (str) {
		
		this.$msg.css({
			background: '#fff'
		})
		
		this.$msg.append(this.$td)
		
		this.$td.html(str)
		
		this.$tr.after(this.$msg)
		
		this.$msg.after($('<tr style="border: none"></tr>'))
		
		this.$tr.isShow = true
		
	}
}
ShowMessageDetail.prototype.hide = function () {
	
	this.$tr.next().remove()
	this.$tr.next().remove()
	
	this.$tr.isShow = false
}

/**
 * 搜索功能显示table 数据
 * @param {Object} data
 * @param {Object} $input
 */

function searchShowTable ($input, flag) {
	
	var val = $input.val()
	var reg = new RegExp(val, 'gi')
	
	var result = []
	
	if(flag === 'plane') {
		
		// 当前
		
		
		// 历史
		
		
	}
	
	
	return result	
}

/**
 * 搜索功能		// 模糊搜索	高亮显示
 * @param {Object} $parent
 */
function planeSearch ($parent, fn) {
	
	var $planeSearch = $parent.find('.search_input')
	
	$planeSearch.keyup(function (ev) {
		
		this.value = this.value.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,'')	// 禁止输入中文
		
		if(ev.keyCode === 13) {
			// 回车之后失去焦点
			$(this).blur()
//			fn($(this))
		}
		
	}).hover(function () {
		$(this).tooltip('show')
	}, function () {
		$(this).tooltip('hide')
	})
	
	var $planeSearchIcon = $parent.find('.search_icon')
	
	$planeSearchIcon.click(function () {
		
//		fn($planeSearch)
		
	})
	
}

// 过滤的结果渲染页面
/**
 * 
 * @param {Object} $input
 * @param {Object} data
 * @param {Object} type
 */
function resultShow ($input, data, type) {

	var val = $input.val()
	var reg = new RegExp(val, 'gi')
	
	var result = []
	
	sortCache.isSearch = val ? true : false
	
//	var keys = Object.keys(data[0])
	if(val === '') {
		if(type === 'message') {
			result = filterData[type].initData
			
			
		} else if(type === 'plane') {
			result = sortCache.initData
		}
		new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content .table_content tbody'), {
			        body: result,
			        isArrow: false,
			        flag: typeFlag[type].flag
			}, type).init()
		return
	}
	
	
	data.forEach(function (item) {
		
//		var str = JSON.stringify(item)
		var str = Object.values(item).join(' % # ')
		
		if(reg.test(str)) {
			result.push(item)
		}
		
	})
	
	if(type === 'plane') {
		
		if(!val.trim()) {
			sort.showData(type, sortCache.flag, sortCache.status, true)
			return
		}
		// 排序的数据
		sortCache.cloneData = result
	} else if(type === 'message') {
		filterData[type].data = result		
	}
	
	if(result.length === 0) {
		
		showMsg('检索的内容为空')
	}

	
	new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content .table_content tbody'), {
		        body: result,
		        isArrow: false,
		        flag: typeFlag[type].flag
	}, type).init()
	
}

// 历史航班和当前航班 控制日历的显示与隐藏
function showCalendar ($select, $date) {
	
	$select.change(function () {
		
		$('#date_demo3').html('请选择日期')
		this.value === 'current' ? $date.hide(500) && $('.select_show_data').hide() && $('.page_show_num').hide() && $('.mock_add').show() : $date.show(500) && $('.select_show_data').show() && $('.page_show_num').show() && $('.mock_add').hide()
		
	})
	
}


// 保存过滤阶段的数据
var filterData = {
	message: {
		
	},
	plane: {
		
	},
	weather: {
		
	},
	plan: {
		
	}
}

// 点击查找按钮搜索过滤
function SearchFilter ($el, $current, data, messageType) {
	this.$el = $el
	// 当前状态
	this.status = 'current'
	
	this.$current = $current
	
	this.startTime = ''
	
	this.endTime = ''
	
	this.data = data
	
	filterData.data = data
	
	// 报文类型  	message plane weather
	this.type = messageType
	
	this.bindEvent()
}

SearchFilter.prototype.bindEvent = function () {
	// 
	var that = this
	this.$el.click(function () {
		
		that.status = that.$current.val()
//		
//		if(that.status === 'history') {
//			that.startTime = $()
//		}
		// 分页的显示与隐藏
//		that.status === 'history' && pageing.showOrHide(that.status)
		
		that.filter()
		
	})
	
}

SearchFilter.prototype.filter = function () {
	// 发送ajax请求 请求数据
	filterState[this.status][this.type](this.status)
	
//	if(this.status === 'current') {
//		// 报文类型
//		filterShowData[this.type]()	
//		
//		return
//	}
////	if(this.time) {
//		
////		var timeArr = this.time.split(' 至 ')
////		var start = timeArr[0].slice(5)
////		var end = timeArr[0].slice(5)
//		var that = this
//		// 发送请求         	// 请求的数据 data
//		getPage('./components/message/messages.json', function (data) {
//			
//			pageing.showInit(data.messages, that.type)
//			
//		})
		
//	} else if(this.status === 'history') {
//		
//		showMsg('请选择时间')
//	}

}

var typeFlag = {
	message: {
		flag: ['msgType', 'sequence', 'fileName', 'sender', 'qfTime', 'pfTime', 'recvTime', 'lastUpdate', 'msgStatus']		//msgStatus
	},
	plane: {
		flag: ['flightNo', 'operationDate', 'orgnAirPort', 'destAirPort', 'fplD', 'fplA', 'atd', 'ata', 'passtime', 'acRegNo', 'acType', 'changeAirPort', 'taskCode', 'ssr', 'lastUpdate', 'isCnl']
	},
	plan: {
		flag: ['flightNo', 'operationDate', 'orgnAirPort', 'destAirPort', 'fplD', 'fplA', 'acRegNo', 'acType', 'changeAirPort', 'taskCode', 'lastUpdate', 'isCnl']
	},
	weather: {
		flag: []
	}
}
/**
 * 获取历史数据渲染页面
 * @param {Object} url
 * @param {Object} param
 * @param {Object} status
 * @param {Object} isInit
 * @param {Object} type
 */
function getHistoryData (url, param, status, isInit, type) {
	console.log(param, url)
			getJson(url, function (data) {
				console.log(data)
				if(data.c.flag === 0 && data.c.errorCode === '004') {
					showMsg('没有数据')
				}
				
				if(data.c.flag === 1) {
					// 成功接收到数据
					$('.common_table').show()
					// 停止实时更新
					for(var i in saveTime) {
						saveTime[i].timeId && clearInterval(saveTime[i].timeId)
					}
					if(status === 'history') {
						// 分页
						if(isInit) {
							
							pageing.showOrHide(status)
							
						}
						pageing.showInit(data.c.page.totalNum, type)
						
					}
					var body = []
					
					if(type === 'message') {
						
						body = data.c.messages
						
					} else if(type === 'plane') {
						body = data.c.flights
						// 如果是排序的状态	
						$('.sort_plane').hide()
						sortCache.flag = ''
						sortCache.status = 0
						if(sortCache.$el) {
							sortCache.$el.count = 0
						}
						sortCache.cloneData = deepCloneObj(data.c.flights)
						sortCache.initData = data.c.flights
						
						// 显示页面
						new ListHeader(['table', 'table-striped', 'table-hover', 'sl_table', 'mytable-S'], $('.list_header'), {
					        header: ['序号', '航班号', '飞行日期', '起飞', '落地', '计划起飞', '计划到达', '实际起飞', '实际到达', '飞行时长', '机号', '机型', '备降', '类型', 'SSR编码', '更新时间', '是否取消'],
					        flag: typeFlag[type].flag
					    }, true, data.c.flights, type).init()
						
					} else if (type === 'weather') {
						
						body = data.c.weathers
						
						new ListHeader(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_header'), {
					        header: ['序号', '报文类型', '流水号', '文件名', '发送者', '签发时间', '派发时间', '接收时间', '处理时间', '处理状态'],
					    }).init()
						
					} else if(type === 'plan') {
						body = data.c.flights
						// 如果是排序的状态	
						$('.sort_plane').hide()
						sortCache.flag = ''
						sortCache.status = 0
						if(sortCache.$el) {
							sortCache.$el.count = 0
						}
						sortCache.cloneData = deepCloneObj(data.c.flights)
						sortCache.initData = data.c.flights
						// 显示页面
						new ListHeader(['table', 'table-striped', 'table-hover', 'sl_table', 'mytable-S'], $('.list_header'), {
					        header: ['序号', '航班号', '飞行日期', '起飞', '落地', '计划起飞', '计划到达', '机号', '机型', '备降', '类型', '更新时间', '是否取消'],
					        flag: typeFlag[type].flag
					    }, true, data.c.flights, type).init()
					    
					}
					
					var returnRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content .table_content tbody'), {
						body: body,
						isArrow: false,
						flag: typeFlag[type].flag
					}, type, true).init()
					
					returnRes.bindEvent.call(returnRes, showPlaneDetail)
					// 显示右侧的信息
					showRightDetail(Number(body[0].id), function (str) {
						$('.detail_content').html(str)
					})
					
				}
				
			}, JSON.stringify(param))
			
}

	
	/**
	 * 获取报文的选择的类型
	 */
	function messageInit () {
		
		var $active = $('.message_type .active')
		
		if($active.attr('data-val') === 'all') {
			return ''
		}
		var $selectedActive = $active.next().find('.selected_active')
		
		var msgType = ''
		
		if($selectedActive.length === 0) {
			showMsg('报文类型选项不能为空')
			return
		}
		
		Array.prototype.forEach.call($selectedActive, function (item) {
			msgType = msgType + $(item).attr('data-val') + ','
		})
		
		msgType = msgType.slice(0, -1)
		
		return msgType
	}

// 历史和当前的过滤
var filterState = {
	history: {
		// 历史
		message: function (status) {
			// 发送请求	获取数据渲染页面
			var result = this.manageTime(true)
			
			if(!result.startTime) {
				showMsg('请选择时间')
				return
			}
			result.endTime = result.endTime || ''
			// 初始化显示第一页
			var param = {
				isHis: 1,
				parameter: result.searchVal || '',
				startTime: result.startTime,
				endTime: result.endTime,
				pageSize: result.pageSize,
				pageIndex: 1,
				msgType: result.msgType
			}
			
			var getTerm = getMultTerm()
				for(var i in getTerm) {
					// 复制
					param[i] = getTerm[i]
				}
				
			getHistoryData('message/list', param, status, true, 'message')
			
//			$('.select_show_data').val()
		},
		weather: function (status) {
//			getPage('./components/message/messages.json', function (data) {
//			
//				pageing.showInit(data.messages, 'weather')
//			
//			})
			
		},
		plane: function (status) {
			
			var result = this.manageTime(false)
			
			if(!result.startTime) {
				showMsg('请选择时间')
				return
			}
			result.endTime = result.endTime || ''
			var param = {
				isHis: 1,
				parameter: result.searchVal || '',
				startTime: result.startTime,
				endTime: result.endTime,
				pageSize: result.pageSize,
				pageIndex: 1,
			}
			var getTerm = getMultTerm()
				for(var i in getTerm) {
					// 复制
					param[i] = getTerm[i]
				}
			
			getHistoryData('flight/aftnflight', param, status, true, 'plane')
			
		},
		// 航班计划
		plan: function (status) {
			
			var result = this.manageTime(false)
			
			if(!result.startTime) {
				showMsg('请选择时间')
				return
			}
			result.endTime = result.endTime || ''

			var param = {
				isHis: 1,
				parameter: result.searchVal || '',
				startTime: result.startTime,
				endTime: result.endTime,
				pageSize: result.pageSize,
				pageIndex: 1,
			}
			var getTerm = getMultTerm()
				for(var i in getTerm) {
					// 复制
					param[i] = getTerm[i]
				}
				
			getHistoryData('flight/flightplan', param, status, true, 'plan')
			
		},
		// 处理时间
		manageTime: function (isMessage) {
			
			var startTime = $('#dateStart').val()
			var endTime = $('#dateEnd').val()
			
			var pageSize = $('.select_show_data').val()
			
			var searchVal = $('.search_input').val()
			if(isMessage) {
				var msgType = messageInit()
				console.log(msgType)
				 return {
				 	startTime: startTime,
				 	endTime: endTime,
				 	pageSize: Number(pageSize),
				 	searchVal: searchVal,
				 	msgType: msgType
				 }
				 
			} else {
				return {
				 	startTime: startTime,
				 	endTime: endTime,
				 	pageSize: Number(pageSize),
				 	searchVal: searchVal
				 }
			}
		}
	},
	// 当前  	前端过滤
	current: {
		
			message: function () {
				
//				var msgType = messageInit() === '' ? '' : messageInit().splic(',')
				
				// clone data
//				var messageData = deepCloneObj(filterData.data)
//				
//				var result = []
				
//				if(msgType === '') {
//					
//					result = messageData
//					
//				} else {
//					
//					if(msgType.indexOf('PLN_') >= 0) {
//						// SITA报文
//						var reg = new RegExp('PLN_', 'g')
//						result = messageData.filter(function (item) {
//							return reg.test(item['msgType'])
//						})
//						
//					} else {
//						
//						result = messageData.filter(function (item) {
//							
//							return msgType.indexOf(item['msgType']) >= 0
//							
//						})
//					}
//					
//				}				
				
				
//				if(result.length === 0) {
//					showMsg('没有指定类型的报文')
//					return 
//				}
				
				this.currentAjax('message/list', 'message')
				
//				return
				// 按接收时间倒序
//				sortDao(result, 'recvTime')
				
//				filterData.message = {
//					// 选择message 报文的类型
//					data: result
//				}
				
//				new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content .table_content tbody'), {
//			        body: result,
//			        isArrow: false,
//			        flag: typeFlag['message'].flag
//			    }).init()
					
			},
			// 天气报表
			weather: function () {
		//		$('.message_type .active').attr('data-val')
				
				filterData.weather = {
					// 选择weather 报文的类型
				}
				
			},
			// 航班报表	
			plane: function () {
		//		$('.message_type .active').attr('data-val')
				this.currentAjax('flight/aftnflight', 'plane')
				
			},
			// 航班计划
			plan: function () {
				
				this.currentAjax('flight/flightplan', 'plan')
				
			},
			// 发送请求	渲染过滤的数据
			currentAjax: function (url, type) {
				// 发送请求
				var param = {}
				
				if(type === 'message') {
					
					param = {
						isHis: 0,
						parameter: $('.search_input').val(),
						msgType: messageInit()
					}
					
				} else {
					
					param = {
						isHis: 0,
						parameter: $('.search_input').val()
					}
				}
				
				var getTerm = getMultTerm()
				console.log(getTerm)
				for(var i in getTerm) {
					// 复制
					param[i] = getTerm[i]
				}
				
				var isRender = false	//	 是否重新渲染
				for(var i in param) {
					    	if(param[i]) {
					    		// 清除定时器
					    		isRender = true
					    		saveTime[type].timeId && clearInterval(saveTime[type].timeId)
					    	}
						}		
						
//						if(!isRender) {
//							return
//						}
//						
				
				getJson(url, function (data) {
					
					if(data.c.flag === 0 && data.c.errorCode === '004') {
						showMsg('没有数据')
						return
					}
					
					if(data.c.flag === 1) {
						
						var body = []
						if(type === 'message') {
							body = data.c.messages
							
							// 显示第一个报文详情
							showRightDetail(data.c.messages[0].id, function (str) {
						    	$('.detail_content').html(str)
						    })
							
						} else if(type === 'plane' || type === 'plan') {
							body = data.c.flights
							// 如果是排序的状态	
							$('.sort_plane').hide()
							sortCache.flag = ''
							sortCache.status = 0
							if(sortCache.$el) {
								sortCache.$el.count = 0
							}
							sortCache.cloneData = data.c.flights
							sortCache.initData = data.c.flights
						}
						
						var returnRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content .table_content tbody'), {
					        body: body,
					        flag: typeFlag[type].flag
					    }, type).init()
					    
					    type != 'message' && returnRes.bindEvent.call(returnRes, showPlaneDetail)
					    
						pageing.showOrHide('current')
						
						// 滚动条重置
						$('.list_content').getNiceScroll().show()
						$('.list_content').getNiceScroll().resize()
					    
					}
				}, JSON.stringify(param))
			}
			
	}
}

// 分页功能
var pageing = {
				showOrHide: function (status) {
					var $paging = $('.paging')
					var $listContent = $('.list_content')
					var $detailContent = $('.detail_content')
					var $commonTable = $('.common_table')
					if(status === 'history') {
//						$commonTable.css({
//							height: 'calc(100% - 88px)'
//						})

						$commonTable.css({
							height: 'calc(100% - 93px)'
						})
						
						$paging.show()
						
				} else {
						$commonTable.css({
							height: 'calc(100% - 54px)'
						})
						
						$paging.hide()
					}
					
				},
				
				// 显示分页的层次
				showInit: function (length, type) {
					this.type = type
					
					var $prev = $('.prev')
					var $next = $('.next')
					var $level = $prev.parent().find('.level')
					
					if(length) {
						this.dataLength = length
						// 初始化		ajax 
						this.postAjax(1, true)
					}
					
					this.clickPage($prev, $next)
				},
				
				// 监听prev next 点击事件
				clickPage: function ($prev, $next) {
					var $parent = $prev.parent()
					// 解绑
					$prev.unbind('click')
					$next.unbind('click')
					var $level = $parent.find('.level')
					$level.length > 0 && $level.unbind('click')
					$('.last_page').unbind('click')
					
					var that = this
					var $levelPage = $parent.find('.level:not(.els)')
					var $selectShow = $('.select_show_data')
					var val = Number($selectShow.val())
					var $active = null
					var num = 1
					// 总数据量  	data.page.totalNum  pageSize: val  page: 1 初始化
					var level = Math.ceil(that.dataLength / val)
					
					$levelPage.click(function () {
						
						$active = $parent.find('.active')
//						$(this).addClass('active')
//						$active.removeClass('active')
						
						num = Number($(this).find('a').html())
						
						that.postAjax(num, false)
						
						if($next.prev().hasClass('active')) {
							$next.addClass('disabled')
							$prev.removeClass('disabled')
							return
						} else if($prev.next().hasClass('active')) {
							$prev.addClass('disabled')
							$next.removeClass('disabled')
						} else {
							$next.removeClass('disabled')
							$prev.removeClass('disabled')
						}
						
					})
					
					$prev.click(function () {
						
						$active = $parent.find('.active')
						if($active.prev().hasClass('prev')) {
							return
						}
//						$active.prev().addClass('active')
//						
//						$active.removeClass('active')
						$next.removeClass('disabled')
						
						num = Number($active.prev().find('a').html())
						
						num = !num ? level - 8 : num
						
						that.postAjax(num, false)
						
						if($prev.next().hasClass('active')) {
							$prev.addClass('disabled')
							$next.removeClass('disabled')
						} else {
							$prev.removeClass('disabled')
						}
						
					})
					$next.click(function () {
						
						$active = $parent.find('.active')
				
						if($active.next().hasClass('next')) {
							return
						}
						
//						$active.next().addClass('active')
//						
//						$active.removeClass('active')
						
						$prev.removeClass('disabled')
						
						
						// 发送请求
						// pageSize Number($('.select_show_data').val())
						// pageIndex:Number($active.next().find('a').html())
						
						num = Number($active.next().find('a').html())
						that.postAjax(num, false)
						
						if($next.prev().hasClass('active')) {
							$next.addClass('disabled')
							$prev.removeClass('disabled')
						} else {
							$next.removeClass('disabled')
						}
						
					})
					
					// 点击最后一页
					$('.last_page').click(function () {
						
//						var num = Number($next.prev().find('a').html())
//						
//						$active = $parent.find('.active')
//						$active.removeClass('active')
//						$next.prev().addClass('active')
//						$next.addClass('disabled')
						that.postAjax(level, false)
						
						$prev.removeClass('disabled')
						$next.addClass('disabled')
						
					})
					
					
					// 到达第几页的输入框
					var $pageInput = $('.page_input')
					$pageInput.keyup(function (ev) {
						// 按下回车键
						if(ev.keyCode === 13) {
							var val = $(this).val()
							var num = Number(val)
							if(!isNaN(num) && num <= level) {
								that.postAjax(~~num, false)
								$(this).val('')
							}
						}
					})
					
				},
				// 发送请求 显示界面
				postAjax: function (num, isInit) {
					
					// 显示数据
					var val = Number($('.select_show_data').val())
					var start = (num-1)*val
					var end = num*val
					
					var that = this
					
					if(that.type === 'plane') {
						// 航班
//						getPage('./components/plane/plane.json', function (data) {
//			
//							var returnRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content'), {
//							    body: data.flights.slice(start, end),
//							    isArrow: false
//							}, that.type).init()
//							returnRes.bindEvent.call(returnRes, showPlaneDetail)
//						})
						
					} else {
//						getPage('./components/message/messages.json', function (data) {
//			
//							new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'mytable-S', 'sl_table'], $('.list_content'), {
//							    body: data.messages.slice(start, end),
//							    isArrow: false
//							}, that.type).init()
//						
//						})
					}
					
					if(!Number(num)) {
						return
					}
					
					if(!isInit) {
						if(that.type === 'message') {
							var result = filterState.history.manageTime(true)
						} else {
							var result = filterState.history.manageTime()
						}
						
			
						if(!result.startTime) {
							showMsg('请选择时间')
							return
						}
						result.endTime = result.endTime || ''
						var param = result.msgType ? {
							isHis: 1,
							parameter: result.searchVal || '',
							startTime: result.startTime,
							endTime: result.endTime,
							pageSize: result.pageSize,
							pageIndex: num,
							msgType: result.msgType
						} : {
							isHis: 1,
							parameter: result.searchVal || '',
							startTime: result.startTime,
							endTime: result.endTime,
							pageSize: result.pageSize,
							pageIndex: num,
						}
						
						var getTerm = getMultTerm()
						for(var i in getTerm) {
							// 复制
							param[i] = getTerm[i]
						}
			
						
						if(this.type === 'message') {
							
							getHistoryData('message/list', param, status, false, this.type)
							
						} else if(this.type === 'plane') {
							
							getHistoryData('flight/aftnflight', param, status, false, this.type)
							
						} else if(this.type === 'plan') {
							
							getHistoryData('flight/flightplan', param, status, false, this.type)
							
						}
					}
					
					this.showPageLevel(num, isInit)
					
				},
				showPageLevel: function (num, isInit) {
						var $prev = $('.prev')
						var $next = $('.next')
						
						var $level = $prev.parent().find('.level')
						$level.remove()
						
						// 每页显示的数量
						var $selectShow = $('.select_show_data')
						var val = Number($selectShow.val())
						
						// 总数据量  	data.page.totalNum  pageSize: val  page: 1 初始化
						var level = Math.ceil(this.dataLength / val)
						
						var maxNum = 10
						// num NaN	prev 情况临界条件下
						
						$('.page_num').html(level)
						
						var liStr = ''
						
						if(isInit) {
							liStr = liStr + '<li class="level active"><a href="#">'+1+'</a></li>'
							if(level < maxNum) {
								
								for(var i=2; i<=level; i++) {
									liStr = liStr + '<li class="level"><a href="#">'+i+'</a></li>'
								}
								
							} else {
								for(var i=1; i < maxNum - 1; i++) {
									liStr = liStr + '<li class="level"><a href="#">'+(i+1)+'</a></li>'
								}
								liStr = liStr + '<li class="level els"><a href="#">...</a></li>'
							}
							
							$prev.addClass('disabled')
							
							if(level !== 1) {
								$next.removeClass('disabled')
							} else {
								$next.addClass('disabled')
							}
							
						} else {
							
							if(level < maxNum) {
								for(var i = 1; i <= level; i++) {
									if(num === i) {
										liStr = liStr + '<li class="level active"><a href="#">'+num+'</a></li>'
									} else {
										liStr = liStr + '<li class="level"><a href="#">'+i+'</a></li>'
									}
								}
								
							}else {
								liStr = this.pageManage(num, level, maxNum)
							}
						}
						
//						for(var i=1; i<level; i++) {
//							liStr = liStr + '<li class="level"><a href="#">'+(i+1)+'</a></li>'
//						}
//						
						
						$prev.after(liStr)
						
						// 
						this.clickPage($prev, $next)
						
			},
			dataLength: 0,
			type: '',	// message plane weather
			pageManage: function (num, level, maxNum) {
				var liStr = ''
				if(num > 5 && num < level - 5) {
								// 有两侧省略号的判断
								liStr = liStr + '<li class="level"><a href="#">'+1+'</a></li>'
								liStr = liStr + '<li class="level els"><a href="#">...</a></li>'
								
								// 显示的一直 10
								for(var j = num - 3; j <= num + 3; j++) {
									
									if(j === num) {
										
										liStr = liStr + '<li class="level active"><a href="#">'+j+'</a></li>'
										
									} else {
										
										liStr = liStr + '<li class="level"><a href="#">'+j+'</a></li>'
										
									}
									
								}
								
								liStr = liStr + '<li class="level els"><a href="#">...</a></li>'
								
							} else if(num <= 5) {
								
								for(var i = 1; i <= maxNum - 1; i++) {
									if(i === num) {
										liStr = liStr + '<li class="level active"><a href="#">'+i+'</a></li>'
									} else {
										
										liStr = liStr + '<li class="level"><a href="#">'+i+'</a></li>'
									}
								}
								liStr = liStr + '<li class="level els"><a href="#">...</a></li>'
								
								
							} else if(num >= level - 7) {
								
								liStr = liStr + '<li class="level"><a href="#">'+1+'</a></li>'
								liStr = liStr + '<li class="level els"><a href="#">...</a></li>'
								for(var i = level - 7; i <= level; i++) {
									
									if(i === num) {
										
										liStr = liStr + '<li class="level active"><a href="#">'+i+'</a></li>'
										
									} else {
										
										liStr = liStr + '<li class="level"><a href="#">'+i+'</a></li>'
									}
								}
							}
							
				return liStr			
			}
			}				


/**
 * 表格表头固定  序号列固定
 */
	var saveLeft = {}	// 保存left
	function messageScroll ($parent) {
		
		var $content = $parent ? $parent.find('.list_content') : $('.common_table .list_content')
		var $header = $parent ? $parent.find('.list_header') : $('.common_table .list_header')
		
		var headerL = 0
		$content.each(function () {
			headerL = parseInt($header.css('left'))
			this.data = {
				scrollT: this.scrollTop,
				scrollL: this.scrollLeft
			}
		}).scroll(headerL, function () {
			var t = this.data.scrollT,
			l = this.data.scrollL;
			if(t !== this.scrollTop) {
			}
			
			if(l !== this.scrollLeft) {
				if(this.scrollLeft > $(this).find('.table')[0].offsetWidth - this.offsetWidth) {
					
//					this.scrollLeft = $(this).find('.table')[0].offsetWidth - this.offsetWidth
					
				}
				// 横向滚动
				$header.css({
					left: -this.scrollLeft + headerL + 'px'
				})
				
				$header.find('th:first-child').css({
					left: this.scrollLeft + 'px'
				})
				$content.find('td:first-child:not(.msg_detail_content_item)').css({
					left: this.scrollLeft + 'px'
				})
				
//				$('.msg_detail_content_item p').css({
//					width: $('.list_content').width() - 20,
//					position: 'relative',
//					left: this.scrollLeft + 'px'
//				})
				
				saveLeft.left = this.scrollLeft
			}
			this.data = {
				scrollT: this.scrollTop,
				scrollL: this.scrollLeft
			}
		})
		
	}
// 搜索框的样式
function searchInputCss() {
	
		$('.search_input').keyup(function () {
			$(this).val().trim() ? $('.delete_val').show() : $('.delete_val').hide()
			
		})
		
		$('.delete_val').click(function () {
			$('.search_input').val('')
			$(this).hide()
		})
		
	}


// 航班的排序规则
//字段	排列顺序
//和数字有关	按照数字升序降序
//和字母有关	按照A-Z/Z-A
//和汉字有关	按照拼音A-Z/Z-A
//和时间有关	按照由早到晚或由晚到早
// 排序的逻辑
var sortCache = {
	status: 0
}

//function showSort () {
//	var $div = $('<div class="show_sort">loading...</div>')
//	$div[0].offsetHeight
//	$div.css({
//		position: 'absolute',
//		left: 0,
//		top: 0,
//		background: '#bfa'
//	})
//	$('body').append($div)
//}

function sortPlane ($th, type) {
	$th.click(function () {
//		showSort()
		sortCache.$el = $th
		$th.count++
		$(this).parent().find('.sort_plane').hide()
		// 降序
		$(this).find('.sort_plane').show()
		
		
		switch ($th.count % 3) {
			case 1:
			// 降序
			sort[1]($(this), type)
			break
			case 2:
			// 升序
			sort[2]($(this), type)
			break
			case 0:
			// 取消排序
			sort[0]($(this), type)
			break
		}
	})
}

var sort = {
	// 降序
	'1': function ($target, type) {
		$target.find('.sort_plane i').html('&#xe70c;')
		var flag = $target.attr('data-flag')
		this.showData(type, flag, 1)
	},
	// 升序
	'2': function ($target, type) {
		
		$target.find('.sort_plane i').html('&#xe602;')
		var flag = $target.attr('data-flag')
		
		this.showData(type, flag, 2)
	},
	// 取消排序
	'0': function ($target, type) {
		
		var flag = $target.attr('data-flag')
		
		$target.find('.sort_plane').hide()
		this.showData(type, flag, 0)
	},
	// 操作显示数据
	showData: function (type, flag, status, isInit) {
		
		sortCache.flag = flag
		var cloneData = []
		// 没有值的数据 --
		var noFlagData = []
		
		var i = 0, j = 0;
		
		if(isInit) {
			// 所有的数据
			sortCache.initData.forEach(function (item) {
				if(!item[flag]) {
					noFlagData[i] = item
					i++
				} else {
					cloneData[j] = item
					j++
				}
			})
			
			sortCache.cloneData = deepCloneObj(sortCache.initData)
			
		}else {
			sortCache.cloneData.forEach(function (item) {
				if(!item[flag]) {
					noFlagData[i] = item
					i++
				} else {
					cloneData[j] = item
					j++
				}
			})
		}

		if(status === 1) {
			// 降序
			cloneData.sort(sortDe)
			
			var cloneLength = cloneData.length
			for(var i=0, len=noFlagData.length; i<len; i++) {
				cloneData[cloneLength + i] = noFlagData[i]
			}
			
			
		} else if(status === 2) {
			// 升序
			cloneData.sort(sortIn)
			
			var cloneLength = cloneData.length
			for(var i=0, len=noFlagData.length; i<len; i++) {
				cloneData[cloneLength + i] = noFlagData[i]
			}
			
		} else if(status === 0) {
			
			cloneData = isInit ? sortCache.initData : sortCache.cloneData
			
		}
		
		
		filterData[type].data = cloneData
		
		sortCache.status = status
		
		var returnRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'sl_table', 'mytable-S'], $('.list_content .table_content tbody'), {
	        body: cloneData,
	        isArrow: false,
	        flag: typeFlag[type].flag,
	    }, type).init(function () {
//	    	$('.show_sort').remove()
	    })
	    
	    returnRes.bindEvent.call(returnRes, showPlaneDetail)
	    $('.list_content').getNiceScroll().show()
	    $('.list_content').getNiceScroll().resize()
	    
	}
}
		// 降序
		function sortDe (a, b) {
			var flag = sortCache.flag
			 if  (a[flag] > b[flag]) {
             	 return  -1;
	        }  else   if  (a[flag] < b[flag]) {
	             return  1;
	        }  else if (a[flag] === b[flag]) {
	             return  0;
	        }
	        
		}
		// 升序
		function sortIn (a, b) {
			var flag = sortCache.flag
			if  (a[flag] < b[flag]) {
             	 return  -1;
	        }  else   if  (a[flag] > b[flag]) {
	             return  1;
	        }  else if (a[flag] === b[flag])  {
	             return  0;
	        }
		}

// 
/**
 * 深度复制一个对象
 * @param {Object} obj
 */
function deepCloneObj (obj) {
	
	if(Object.prototype.toString.call(obj) === '[object Object]') {
				var target = {}
				for(var i in obj) {
					target[i] = deepCloneObj(obj[i])
				}
				return target
				
			} else if(Object.prototype.toString.call(obj) === '[object Array]') {
				
				var target = []
				for(var i = 0, len = obj.length; i<len; i++) {
					target[i] = deepCloneObj(obj[i])
				}
				return target
			} else {
				return obj
			}
}



// 滚动加载
/**
 * 
 * @param {Object} data
 * @param {Object} start
 * @param {Object} end
 */

function scrollLoad (data, start, end) {
	var NUM = end
	
	$('.common_table .list_content').scroll(function () {
		// 滚动到底部
//		if(this.scrollTop / ($(this).find('.table')[0].offsetHeight - $(this).outerHeight()) >= 0.95) {
		if(($(this).find('.table')[0].offsetHeight - $(this).outerHeight()) - this.scrollTop <= 0) {
			// 滚动到底部了
			if(start > data.length) {
				
				return
			} else {
				showLoading()
				setTimeout(function () {
					hideLoading()
				}, 2000)
			}
			
			start = start + NUM
			end = end + NUM
			
			if(end > data.length) {
				end = data.length
			}
			
			var $lastTr = $(this).find('.table tbody tr:last-child')
			var returnRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'sl_table', 'mytable-S'], $('.list_content'), {
		        body: data.slice(start, end),
		        isArrow: false,
		        flag: ['index', 'flightNo', 'operationDate', 'orgnAirPort', 'destAirPort', 'fplD', 'fplA', 'atd', 'ata', 'passtime', 'acRegNo', 'acType', 'changeAirPort', 'taskCode', 'ssr', 'lastUpdate', 'isCnl', 'route'],
		        start: start,
		        end: end
		    }, 'plane').createTr()
		    
		    returnRes.bindEvent.call(returnRes, showPlaneDetail)
			var i=len=returnRes.trArr.length;
			
			console.time('render')
			
			for(; i >= 0; i--) {
				
				$lastTr.after(returnRes.trArr[i])
				
			}
			
			console.timeEnd('render')
			
		} else if (this.scrollTop <= 0) {
			// 到顶部
//			if(start <= 0) {
//				return
//			} else {
//				showLoading()
//				setTimeout(function () {
//					hideLoading()
//				}, 2000)
//			}
//			start = start - NUM
//			end = end - NUM
//			var returnRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'sl_table', 'mytable-S'], $('.list_content'), {
//		        body: data.slice(start, end),
//		        isArrow: false,
//		        start: start,
//		        end: end
//		    }, 'plane').init()
//		    
//		    returnRes.bindEvent.call(returnRes, showPlaneDetail)
		}
	})
	
}

/**
 * 根据id显示 右侧的报文信息
 * @param {Object} id
 */
function showRightDetail (id, parent, fn) {
	
	noLoadJson('message/content', function (data) {
		
		if(data.c.flag === 1) {
			var content = data.c.content
			var base64 = $.base64.atob(content) 
			base64 = base64.split('\n')
			
			new CreateRightContent(base64, parent, fn)
		}
		
	}, '{"id": '+id+'}')
}
/**
 * 根据报文内容生成dom插入页面
 * @param {Object} article
 */
function CreateRightContent (article, fn) {
	this.article = article || []
	this.fn = fn || function () {}
	this.init()
}
CreateRightContent.prototype.init = function () {
	
	var str = ''
	this.article.forEach(function (article) {
		str = str + '<div class="article_item">'+article+'</div>'
	})
	this.fn(str)
	
}




// 保留的时间戳
var saveTime = {
	// 报文列表的时间戳
	message: {
		
	},
	// 天气列表的时间戳
	weather: {
		
	},
	// 航班列表的时间戳
	plane: {
		
	},
	// 航班计划
	plan: {
		
	}
}


// 更新 
/**
 * 
 * @param {Object} initData
 * @param {Object} type
 * @param {Object} time
 * @param {Object} url
 */
function updateInfo (initData, type, setTime, url) {
	// 每隔10秒更新一次
	// 现在测试环境下不是实时的
	var idArr = []
	initData.forEach(function (item) {
		idArr.push(item.id)
	})
	
	// 切换时	清楚其他的定时器	
	for(var i in saveTime) {
		saveTime[i].timeId && clearInterval(saveTime[i].timeId)
	}
	
	saveTime[type]['timeId'] = setInterval(function () {
		var param = {
			isHis: 0,
			time: String(Number(saveTime[type].time))
		}
		noLoadJson(url, function (data) {
			if(data.c.flag === 0 && data.c.errorCode === '004') {
				return
//				showMsg('没有数据')
			}
			
			if(data.c.flag === 1) {
				
				saveTime[type].time = data.c.time
				
				if(type === 'message') {
					
					updateMsg(data.c.messages)
					
				} else if (type === 'plane') {
					
					updateMsg(data.c.flights)
					
				}
				
			}
			
		}, JSON.stringify(param))
		
	}, setTime)
	
	function updateMsg (data) {
		var msg = {
						A: [],
						D: [],
						U: []
					}
					var idArr = []
					data.forEach(function (item) {
						var operate = item.operate	// 操作类型
						if(operate === 'A') {
							// 新增
							msg['A'].push(item)
//							idArr.push(item.id)

						} else if(operate === 'D') {
							// 删除
							msg['D'].push(item)
//							idArr.push(item.id)

						} else if(operate === 'U') {
							// 修改
				
							msg['U'].push(item)
//							idArr.push(item.id)
	
						}
					})
					console.log(msg['A'], msg['D'], msg['U'])
					msg['A'].length > 0 && MediaObj.send(type, 'A', msg['A'])
					msg['D'].length > 0 && MediaObj.send(type, 'D', msg['D'])
					msg['U'].length > 0 && MediaObj.send(type, 'U', msg['U'])
	}
	
	
}

// 航班信息的增删改
// 中介者模式
var MediaObj = (function () {
	var msg = {}
	return {
		// 注册
		register: function (type, operate, fn) {
			if(msg[type]) {
				msg[type][operate] = fn
			} else {
				msg[type] = {}
				msg[type][operate] = fn
			}
		},
		// 发送消息
		send: function (type, operate, data) {
			
			if(!msg[type]) {
				return
			}

			msg[type][operate] && msg[type][operate](data)
		}
	}
})()


// 具体的操作
var Manage = {
	// 更新
    U: {
    	// 航班
    	plane: function(data, type) {
	    	var flag = typeFlag[type].flag
	    	var resultData = []
	    	var idArr = []
	    	var $tbody = $('.common_table .table_content tbody')
	    	
//	    	if(sortCache.isSearch) {
//	    		var inputVal = $('.search_input').val()
//	    	}
//	    	
			data.forEach(function (item) {
				
				var $target = $tbody.find('tr[data-id='+String(item.id)+']')
				idArr.push(item.id)
				resultData.push(item)
				
				if($target[0]) {	// 存在
					
					if(sortCache.status === 0) {
						var index = $target.find('td:first-child').html()
						var resultStr = Manage.updateTr(item, flag, type, index)
						// 非排序状态下
						$target.html(resultStr)
					}
					
				}
				
			})
			
			// 数据还原
	//		filterData[type].data.forEach(function (item, index, arr) {
	//			var i = idArr.indexOf(item.id)
	//			if(i > -1) {
	//				arr[index] = resultData[i]
	//			}
	//		})
			
			sortCache.cloneData.forEach(function (item, index, arr) {
				var i = idArr.indexOf(item.id)
				if(i > -1) {
					arr[index] = resultData[i]
				}
			})
			
			sortCache.initData.forEach(function (item, index, arr) {
				var i = idArr.indexOf(item.id)
				if(i > -1) {
					arr[index] = resultData[i]
				}
			})
			
			if(sortCache.status != 0) {
				// 找出有值的数据
				var realData = []
				var noRealData = []
				var sortFlag = sortCache.flag
				sortCache.cloneData.forEach(function (item) {
					if(item[sortFlag]) {
						realData.push(item)
					} else {
						noRealData.push(item)
					}
				})
				// 排序		sortIn 升序		sortDe 降序
				sortCache.status === 1 ? realData.sort(sortDe) : realData.sort(sortIn)
				// 排序好的数据
				realData.forEach(function (item, index, arr) {
					
					if(idArr.indexOf(item.id) >= 0) {
						var $target = $tbody.find('tr[data-id='+String(item.id)+']')
						if($target[0]) {
							(function (index) {
								
								if(index < 1) {
									var $prev = $tbody.find('tr:first-child')
								} else {
									var $prev = $tbody.find('tr[data-id='+String(arr[index - 1].id)+']')
								}
								
								if(!$prev[0]) {
									arguments.callee(--index)
								} else {
									
									if(index < 1) {
//										
										var $prev = $tbody.find('tr:first-child')
										var resultStr = Manage.sortState.createTr(item, flag, type, Number($prev.find('td:first-child').html()))
										$target.remove()
										$prev.before(resultStr)
										Array.prototype.forEach.call($tbody.find('tr'), function (tr, index) {
											$(tr).find('td:first-child').html(index + 1)
										})
									} else {
										console.log($prev[0], 'real.....', $target[0], $prev.find('td:first-child').html())
										var resultStr = Manage.sortState.createTr(item, flag, type, Number($prev.find('td:first-child').html()))
										$target.remove()
										$prev.after(resultStr)
										Array.prototype.forEach.call($tbody.find('tr'), function (tr, index) {
											$(tr).find('td:first-child').html(index + 1)
										})
									}
									
								}
							})(index)
//							var resultStr = Manage.updateTr(item, flag, type, 0)
//							$target.html(resultStr)
//							Array.prototype.forEach.call($target.parent().find('tr'), function (tr, trIndex) {
//								$(tr).find('td:first-child').html(trIndex + 1)
//							})
							
						}
						
					}
				})	
				// 没有排序好的数据
				noRealData.forEach(function (item, index, arr) {
					if(idArr.indexOf(item.id) >= 0) {
						var $target = $tbody.find('tr[data-id='+String(item.id)+']')
						if($target[0]) {
							(function (index) {
								var $noprev = $tbody.find('tr[data-id='+String(arr[index - 1].id)+']')
								if(!$noprev[0]) {
									arguments.callee(--index)
								} else {
									console.log($noprev[0], 'no.....')
										var resultStr = Manage.sortState.createTr(item, flag, type, Number($noprev.find('td:first-child').html()) + 1)
										
										$target.remove()	
										$noprev.after(resultStr)
										
										Array.prototype.forEach.call($tbody.find('tr'), function (tr, index) {
											$(tr).find('td:first-child').html(index + 1)
										})
																		}
							})(index)
//							var resultStr = Manage.updateTr(item, flag, type, 0)
//							$target.html(resultStr)
//							Array.prototype.forEach.call($target.parent().find('tr'), function (tr, trIndex) {
//								$(tr).find('td:first-child').html(trIndex + 1)
//							})
						}
						
					}
				})
				
			}
	   },
	   // 报文
	   message: function (data, type) {
	   		// 原始数据 filterData[type].data
	   		var flag = typeFlag[type].flag
	   		var idArr = []
	   		
	   		data.forEach(function (item) {
	   			idArr.push(item.id)
	   		})
	   		
	   		var showArr = []
	   		
	   		filterData[type].data.forEach(function (item, index, arr) {
	   			var i = idArr.indexOf(item.id)
	   			if( i >= 0) {
	   				// 添加
	   				showArr.push({
	   					id: item.id,
	   					data: item
	   				})
	   				arr[index] = data[i]
	   			}
	   		})
	   		
	   		// 更新初始化数据
	   		filterData[type].initData.forEach(function (item, index, arr) {
	   			var i = idArr.indexOf(item.id)
	   			if(i >= 0) {
	   				arr[index] = data[i]
	   			}
	   		})
	   		
	   		if(showArr.length === 0) {
	   			return
	   		}
	   		
	   		var $tbody = $('.common_table .table_content tbody')
	   		
	   		showArr.forEach(function (item) {
	   			
	   			var $target = $tbody.find('tr[data-id='+String(item.id)+']')
	   			
	   			if($target[0]) {
	   				// 存在即更新
	   				var tdStr = Manage.updateTr(item.data, flag, type, Number($target.find('td:first-child').html()))
	   				$target.html(tdStr)
	   			}
	   			
	   		})
	   		
	   		
	   }
    },
    // 删除
    D: {
    	// 航班
    	plane: function(data, type) {
    	
	    	var len = $('.common_table .table_content tbody').find('tr').length
	    	
	    	var idArr = []
			data.forEach(function (item) {
				var $target = $('.common_table .table_content tbody tr[data-id='+String(item.id)+']')
				if($target[0]) {
					idArr.push(item.id)
					$target.remove()
				}
			})

			// 数据还原
	//		filterData[type].data.forEach(function (item, index, arr) {
	//			if(idArr.indexOf(item.id) > -1) {
	//				arr.splice(index - spliceFlag, 1)
	//				spliceFlag++
	//			}
	//		})
			
			spliceData(sortCache.cloneData, idArr)
			spliceData(sortCache.initData, idArr)
			
			/**
			 * 
			 * @param {Object} data
			 * @param {Object} idArr
			 */
			function spliceData (data, idArr) {
				var spliceFlag = 0
				data.forEach(function (item, index, arr) {
				
					if(idArr.indexOf(item.id) > -1) {
						arr.splice(index - spliceFlag, 1)
						spliceFlag++
					}
					
				})
			}
	
	   },
	   // 报文
	   message: function (data, type) {
	   		// 删除
	   		var $tbody = $('.common_table .table_content tbody')
	   		var idArr = []
	   		
	   		data.forEach(function (item) {
	   			idArr.push(item.id)
	   			var $target = $tbody.find('tr[data-id='+String(item.id)+']')
	   			$target[0] && $target.remove()
	   		})
	   		
	   		var spliceFlag = 0
	   		
	   		filterData[type].data.forEach(function (item, index, arr) {
	   			if(idArr.indexOf(item.id) >= 0) {
	   				arr.splice(index - spliceFlag, 1)
//	   				var $target = $tbody.find('tr[data-id='+String(item.id)+']')
//	   				$target[0] && $target.remove()
	   			}
	   		})
	   		
	   		// 初始化数据也需要变化
	   		var initFlag = 0
	   		filterData[type].initData.forEach(function (item, index, arr) {
	   			if(idArr.indexOf(item.id) >= 0) {
	   				arr.splice(index - initFlag, 1)
	   			}
	   		})
	   		
	   }
    },
    // 添加
    A: {
    	// 航班
    	plane: function (data, type) {
	    	var $tbody = $('.common_table .table_content tbody')
	    	var len = $tbody.find('tr').length
	    	var flag = typeFlag[type].flag
	    	var sortFlag = sortCache.flag
			// 排序状态
			if(sortCache.status != 0) {
//				if(!sortCache.isSearch) {
					// 非搜索状态
					// 找出有值的数据
					var realData = []
							
							sortCache.cloneData.forEach(function (item) {

								if(item[sortFlag]) {
									realData.push(item)
								}
							})		
					data.forEach(function (item) {
						// 排序找到当前的元素的上一个元素的id 添加到上个元素的后面		// 属性值为空的没考虑
						// item[flag]	值为空就不用排序了
//						if($tbody.find('tr[data-id='+String(item.id)+']').length === 0) {}
							
							sortCache.cloneData.push(item)
							sortCache.initData.push(item)
						if(!item[sortFlag]) {
							len = $tbody.find('tr').length
							var trStr = Manage.sortState.createTr(item, flag, type, len + 1)
							$tbody.append(trStr)	
						} else {
							realData.push(item)
							// 排序
							sortCache.status === 1 ? realData.sort(sortDe) : realData.sort(sortIn)
							
							var i = realData.indexOf(item)
							
							if(i > 0) {
								
								var prevId = realData[i - 1].id
								
								var $prev = $('.common_table .table_content tbody tr[data-id='+String(prevId)+']')
								console.log(prevId, $prev[0])
								// 更新序号
								var len = $prev.prevAll().length
								
								var trStr = Manage.sortState.createTr(item, flag, type, len + 1)
								
//								var count = 0
//								
//								for(var i = len - 1; i > 0; i--) {
//									count++
//									$($prev.prevAll()[i]).find('td:first-child').html(count)
//								}
//								
//								$prev.find('td:first-child').html(Number($prev.find('td:first-child').html()))
//								
//								Array.prototype.forEach.call($prev.nextAll(), function (item) {
//									var $firstTd = $(item).find('td:first-child')
//									$firstTd.html(Number($firstTd.html()) + 1)
//								})
								
								$prev.after(trStr)
								
								Array.prototype.forEach.call($tbody.find('tr'), function (tr, index) {
									$(tr).find('td:first-child').html(index + 1)
								})
							} else if (i === 0) {
								var trStr = Manage.sortState.createTr(item, flag, type, len + 1)
								$tbody.find('tr:first-child').before(trStr)
								Array.prototype.forEach.call($tbody.find('tr'), function (tr, index) {
									$(tr).find('td:first-child').html(index + 1)
								})
							}
						}
						
					})
//				} else {
					// 搜索状态
					// 获取输入框的值
//	    			var inputVal = $('.search_input').val()
//	    			
//					data.forEach(function (item) {
//						
//						sortCache.cloneData.push(item)
//						sortCache.initData.push(item)
//						
//						if(!item[sortFlag] && Object.values(item).join(' ').indexOf(inputVal) >= 0) {
//							
//							$tbody.append(trStr)	
//							
//						} else {
//								
//							// 找出有值的数据
//							var realData = []
//							
//							sortCache.cloneData.forEach(function (item) {
//								if(item[sortFlag]) {
//									realData.push(item)
//								}
//							})
//							
//							// 排序
//							sortCache.status === 1 ? realData.sort(sortIn) : realData.sort(sortDe)
//							
//							var i = realData.indexOf(item)
//							if(i > 0 && Object.values(item).join(' ').indexOf(inputVal) >= 0) {
//								
//								(function (i) {
//									
//									if(i < 0) {
//										return
//									}
//									
//									var prevId = realData[i - 1].id
//									var $prev = $('.common_table .table_content tbody tr[data-id='+String(prevId)+']')
//									if(!$prev[0]) {
//										arguments.callee(--i)
//									} else {
//										var trStr = Manage.sortState.createTr(item, flag, type, Number($prev.find('td:first-child').html()) + 1)
//										$prev.before(trStr)
//										return
//									}
//									
//								})(i)
//								
//							}
//						}
//					})
					
//				}
			
			} else if(sortCache.status === 0) {
				// 非排序搜索状态
				var trStr = Manage.addTr(data, type, flag, len)
				$('.common_table .table_content tbody').append(trStr)
				
			}
			$('.list_content').getNiceScroll().show()
			$('.list_content').getNiceScroll().resize()
			// 搜索状态下
//	    	if(sortCache.isSearch) {
//	    		
//	    		// 获取输入框的值
//	    		var inputVal = $('.search_input').val()
//	    		var showTrArr = []
//	    		data.forEach(function (item) {
//	    			sortCache.cloneData.push(item)
//					sortCache.initData.push(item)
//					
//	    			if(Object.values(item).join(' ').indexOf(inputVal) > 0) {
//	    				// 显示在页面中
//	    				showTrArr.push(item)
//	    			}
//	    			
//	    		})
//	    		
//	    		var trStr = Manage.addTr(showTrArr, type, flag, len)
//	    		
//				$('.common_table .table_content tbody').append(trStr)
//
//	    	}
			
	   },
	   // 报文
	   message: function (data, type) {
//	   	
//	   		var messageData = filterData[type].data, len = messageData.length;
//	   		var initData = filterData[type].initData, initLen = initData.length
	   		var $tbody = $('.common_table .table_content tbody')
	   		
//	   		var showData = []
//	   		
//	   		var msgType = messageInit() ? messageInit().split(',') : ''
//	   		var inputVal = $('.search_input').val()
//	   		
//	   		if(msgType === '') {
//		   			if(!sortCache.isSearch) {
//		   				data.forEach(function (item, index) {
//				   			// 显示数据的增加
//					   		messageData[len + index] = item
//					   		initData[initLen + index] = item
//					   		showData.push(item)
//					   	})
//		   			} else {
//		   				data.forEach(function (item, index) {
//		   					messageData[len + index] = item
//					   		initData[initLen + index] = item
//		   					Object.values(item).join(' ').indexOf(inputVal) >= 0 && showData.push(item)	
//		   				})
//		   			}
//		   			
//		   		} else {
//			   		if(!sortCache.isSearch) {
//			   			if(msgType[0] === 'PLN_') {
//			   				
//			   				data.forEach(function (item, index) {
//				   				messageData[len + index] = item
//						   		initData[initLen + index] = item
//						   		item.msgType && item.msgType.indexOf('PLN_') >= 0 && showData.push(item)
//				   			})
//			   			
//			   			} else {
//			   				data.forEach(function (item, index) {
//				   				messageData[len + index] = item
//						   		initData[initLen + index] = item
//						   		msgType.indexOf(item.msgType) >= 0 && showData.push(item)
//				   			})
//			   			}
//			   			
//			   		} else {
//			   			
//			   			if(msgType[0] === 'PLN_') {
//			   				
//			   				data.forEach(function (item, index) {
//				   				messageData[len + index] = item
//						   		initData[initLen + index] = item
//						   		item.msgType.indexOf('PLN_') >= 0 && Object.values(item).join(' ').indexOf(inputVal) >= 0 && showData.push(item)
//				   			})
//			   			
//			   			} else {
//			   				data.forEach(function (item, index) {
//				   				messageData[len + index] = item
//						   		initData[initLen + index] = item
//						   		msgType.indexOf(item.msgType) >= 0 && Object.values(item).join(' ').indexOf(inputVal) >= 0 && showData.push(item)
//				   			})
//			   			}
//			   		}
//			   		
//		   		}
	   		var showData = []
	   		data.forEach(function (item) {
	   			if($tbody.find('tr[data-id='+String(item.id)+']').length === 0) {
	   				showData.push(item)
	   			}
	   		})
	   		if(showData.length === 0) {
	   			
	    		return
	    	} else {
	    		
	    		var trStr = Manage.addTr(showData, type, typeFlag[type].flag, $tbody.find('tr').length)
	   		
		   		Array.prototype.forEach.call($tbody.find('tr'),function (tr) {
		   			var $firstTd = $(tr).find('td:first-child')
		   			$firstTd.html(Number($firstTd.html()) + showData.length)
		   		})
		   		
			   	$tbody.prepend(trStr)
	    	}
	    	
	   		// 初始化数据的增加
	   		$('.list_content').getNiceScroll().show()
			$('.list_content').getNiceScroll().resize()
	   		
	   }
    },
    // 添加
    addTr: function (data, type, flag, initLen) {
		var body = data
		var flag = flag
		var trStr = ''
		var len = data.length, i = 0, count=0;

		if(type === 'message') {
			
	    	for (var j = len - 1; j >= 0; j--) {
	    		
	    		count++
	    		
	    		
	    		var str8 = manageTypeStatu(body[j][flag[8]])
//	    		if(body[j][flag[8]]) {
//	    			str8 = body[j][flag[8]].indexOf('正确') < 0 ? '未处理' : '正确'
//	    		} else {
//	    			str8 = '未处理'
//	    		}
	    		
	    		trStr += '<tr data-id='+body[j].id+'><td>'+(count)+'</td><td>'+(body[j][flag[0]] || "--")+'</td><td>'+(body[j][flag[1]] || "--")+'</td><td>'+(body[j][flag[2]] && body[j][flag[2]].slice(0, -4) || "--")+'</td><td>'+(body[j][flag[3]] || "--")+'</td><td>'+(body[j][flag[4]] && body[j][flag[4]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[j][flag[5]] && body[j][flag[5]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[j][flag[6]] && body[j][flag[6]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[j][flag[7]] && body[j][flag[7]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+str8+'</td></tr>'
	    		
		    }
	    	
	    	
	    } else if(type === 'plane') {
	    	for (; i < len; i++) {
	    		
	    		if(!$('.table_content tbody tr[data-id='+String(body[i].id)+']')[0]) {
//	    			filterData[type].data.push(body[i])
					sortCache.cloneData.push(body[i])
					sortCache.initData.push(body[i])
					
	    			trStr += '<tr data-id='+body[i].id+'><td>'+(i+initLen+1)+'</td><td>'+body[i][flag[0]]+'</td><td>'+body[i][flag[1]].slice(5)+'</td><td>'+body[i][flag[2]]+'</td><td>'+body[i][flag[3]]+'</td><td style="position: relative">'+ (body[i][flag[4]] && body[i][flag[4]].slice(10, -3).replace('-', '')  + (manageTimeDate(body[i][flag[1]], body[i][flag[4]].slice(0, -9))) || "--")+'</td><td style="position: relative;">'+(body[i][flag[5]] && body[i][flag[5]].slice(10, -3).replace('-', '') + (manageTimeDate(body[i][flag[1]], body[i][flag[5]].slice(0, -9)))  || "--")+'</td><td style="position: relative">'+(body[i][flag[6]] && body[i][flag[6]].slice(10, -3).replace('-', '') + (manageTimeDate(body[i][flag[1]], body[i][flag[6]].slice(0, -9)))  || "--")+'</td><td style="position: relative">'+(body[i][flag[7]] && body[i][flag[7]].slice(10, -3).replace('-', '') + (manageTimeDate(body[i][flag[1]], body[i][flag[7]].slice(0, -9)))  || "--")+'</td><td>'+(body[i][flag[8]] || "--")+'</td><td>'+(body[i][flag[9]] || "--")+'</td><td>'+(body[i][flag[10]] || "--")+'</td><td>'+(body[i][flag[11]] || "--")+'</td><td>'+(body[i][flag[12]] || "--")+'</td><td>'+(body[i][flag[13]] || "--")+'</td><td>'+(body[i][flag[14]] && body[i][flag[14]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(body[i][flag[15]] || "--")+'</td></tr>'
	    		}
		    }
	    }
	    return trStr
	},
	// 更新
	updateTr: function (item, flag, type, index) {
		
		var tdStr = ''
		if(type === 'message') {
	    	var str8 = manageTypeStatu(item[flag[8]])
	    	tdStr = '<td data-id='+item.id+'>'+(index || 0)+'</td><td>'+(item[flag[0]] || "--")+'</td><td>'+(item[flag[1]] || "--")+'</td><td>'+(item[flag[2]] && item[flag[2]].slice(0, -4) || "--")+'</td><td>'+(item[flag[3]] || "--")+'</td><td>'+(item[flag[4]] && item[flag[4]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(item[flag[5]] && item[flag[5]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(item[flag[6]] && item[flag[6]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(item[flag[7]] && item[flag[7]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+str8+'</td>'
	    } else if(type === 'plane') {
	    	tdStr = '<td data-id='+item.id+'>'+(index || 0)+'</td><td>'+(item[flag[0]] || "--")+'</td><td>'+item[flag[1]].slice(5)+'</td><td>'+item[flag[2]]+'</td><td>'+item[flag[3]]+'</td><td style="position: relative">'+ (item[flag[4]] && (item[flag[4]].slice(10, -3).replace('-', '')  + manageTimeDate(item[flag[1]], item[flag[4]].slice(0, -9)))  || "--")+'</td><td style="position: relative;">'+(item[flag[5]] && (item[flag[5]].slice(10, -3).replace('-', '')  + manageTimeDate(item[flag[1]], item[flag[5]].slice(0, -9)))  || "--")+'</td><td style="position: relative">'+(item[flag[6]] && (item[flag[6]].slice(10, -3).replace('-', '')  + manageTimeDate(item[flag[1]], item[flag[6]].slice(0, -9))) || "--")+'</td><td style="position: relative">'+(item[flag[7]] && (item[flag[7]].slice(10, -3).replace('-', '')  + manageTimeDate(item[flag[1]], item[flag[7]].slice(0, -9))) || "--")+'</td><td>'+(item[flag[8]] || "--")+'</td><td>'+(item[flag[9]] || "--")+'</td><td>'+(item[flag[10]] || "--")+'</td><td>'+(item[flag[11]] || "--")+'</td><td>'+(item[flag[12]] || "--")+'</td><td>'+(item[flag[13]] || "--")+'</td><td>'+(item[flag[14]] && item[flag[14]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(item[flag[15]] || "--")+'</td>'
	    }
	    
	    return tdStr
	},
	// 排序状态下
	sortState:{
		// 生成tr
		createTr: function (item, flag, type, index) {
			
			var trStr = ''
			if(type === 'plane') {
	    		trStr = '<tr data-id='+item.id+'><td>'+(index || 0)+'</td><td>'+(item[flag[0]] || "--")+'</td><td>'+item[flag[1]].slice(5)+'</td><td>'+item[flag[2]]+'</td><td>'+item[flag[3]]+'</td><td style="position: relative">'+ (item[flag[4]] && (item[flag[4]].slice(10, -3).replace('-', '')  + manageTimeDate(item[flag[1]], item[flag[4]].slice(0, -9)))  || "--")+'</td><td style="position: relative;">'+(item[flag[5]] && (item[flag[5]].slice(10, -3).replace('-', '')  + manageTimeDate(item[flag[1]], item[flag[5]].slice(0, -9)))  || "--")+'</td><td style="position: relative">'+(item[flag[6]] && (item[flag[6]].slice(10, -3).replace('-', '')  + manageTimeDate(item[flag[1]], item[flag[6]].slice(0, -9))) || "--")+'</td><td style="position: relative">'+(item[flag[7]] && (item[flag[7]].slice(10, -3).replace('-', '')  + manageTimeDate(item[flag[1]], item[flag[7]].slice(0, -9))) || "--")+'</td><td>'+(item[flag[8]] || "--")+'</td><td>'+(item[flag[9]] || "--")+'</td><td>'+(item[flag[10]] || "--")+'</td><td>'+(item[flag[11]] || "--")+'</td><td>'+(item[flag[12]] || "--")+'</td><td>'+(item[flag[13]] || "--")+'</td><td>'+(item[flag[14]] && item[flag[14]].slice(5, -3).replace('-', '') || "--")+'</td><td>'+(item[flag[15]] || "--")+'</td></tr>'
//		    	trStr = '<tr data-id='+item.id+'><td>'+(index)+'</td><td>'+item[flag[0]]+'</td><td>'+item[flag[1]].slice(5)+'</td><td>'+item[flag[2]]+'</td><td>'+item[flag[3]]+'</td><td>'+ (item[flag[4]] && item[flag[4]].slice(10, -3).replace('-', '') || "--")+'</td><td>'+(item[flag[5]] && item[flag[5]].slice(10, -3).replace('-', '') || "--")+'</td><td>'+(item[flag[6]] && item[flag[6]].slice(10, -3).replace('-', '') || "--")+'</td><td>'+(item[flag[7]] && item[flag[7]].slice(10, -3).replace('-', '') || "--")+'</td><td>'+(item[flag[8]] || "--")+'</td><td>'+(item[flag[9]] || "--")+'</td><td>'+(item[flag[10]] || "--")+'</td><td>'+(item[flag[11]] || "--")+'</td><td>'+(item[flag[12]] || "--")+'</td><td>'+(item[flag[13]] || "--")+'</td><td>'+(item[flag[14]] && item[flag[14]].slice(10, -3).replace('-', '') || "--")+'</td><td>'+(item[flag[15]] || "--")+'</td></tr>'
	
		    }
		    return trStr
		}
	}
}





// 发送请求获取航班数据
function getPlaneData (type, data) {
		// 清除定时器
		for(var i in saveTime) {
			saveTime[i].timeId && clearInterval(saveTime[i].timeId)
		}
    	if(data.c.flag === 0 && data.c.errorCode === '004') {
    		showMsg('没有数据')
    		// 没有数据全都隐藏
    		$('.common_table').hide()
    		new SearchFilter($('.search_btn'), $('.select_cur_his'), [], type)
    	}
    	
    	
    	if(data.c.flag === 1) {
    		// 有数据才显示
    		$('.common_table').show()
    		// 成功接收到数据
    		hideLoading()
			// 显示页面
			
		    
		    if(type === 'plane') {
		    	new ListHeader(['table', 'table-striped', 'table-hover', 'sl_table', 'mytable-S'], $('.list_header'), {
			        header: ['序号', '航班号', '飞行日期', '起飞', '落地', '计划起飞', '计划到达', '实际起飞', '实际到达', '飞行时长', '机号', '机型', '备降', '类型', 'SSR编码', '更新时间', '是否取消'],
			        flag: typeFlag[type].flag
			    }, true, data.c.flights, type).init()
		    	var targetId = getTargetId(data.c.flights)
				var returnRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'sl_table', 'mytable-S'], $('.list_content .table_content tbody'), {
			        body: data.c.flights,
			        isArrow: false,
			        targetId: targetId,
			        flag: typeFlag['plane'].flag
			    }, type).init()
			    
		  } else {
		  		new ListHeader(['table', 'table-striped', 'table-hover', 'sl_table', 'mytable-S'], $('.list_header'), {
			        header: ['序号', '航班号', '飞行日期', '起飞', '落地', '计划起飞', '计划到达','机号', '机型', '备降', '类型', '更新时间', '是否取消'],
			        flag: typeFlag[type].flag
			    }, true, data.c.flights, type).init()
			    
		  		var targetId = getTargetId(data.c.flights)
				var returnRes = new AbleManaBody(['table', 'table-striped', 'table-hover', 'table-bordered', 'sl_table', 'mytable-S'], $('.list_content .table_content tbody'), {
			        body: data.c.flights,
			        isArrow: false,
			        targetId: targetId,
			        flag: typeFlag['plan'].flag
			    }, type).init()
		   }
		    
		    filterData[type].data = data.c.flights
//		    var oDate = new Date();var iM = oDate.getTime()
//		    
			saveTime[type].time = data.c.time
			
			type === 'plane' && updateInfo(data.c.flights, type, timeCell, '/flight/aftnflight')
		    
			returnRes.bindEvent.call(returnRes, showPlaneDetail)
			// 滚动条
//			messageScroll()
			
			// 过滤搜索
			new SearchFilter($('.search_btn'), $('.select_cur_his'), data.c.flights, type)
			
    	}
    }


// 将时间格式转换为毫秒数
function splitTime (start) {
        // 兼容火狐     new date("Year","Month","Day","Hour","Minutes","Seconds");(在Chrome 和 Firefox IE8中都兼容，其它未测试。)
        var arr = start.split(' ')
        arr = arr[0].split('-').concat(arr[1].split(':'))
        var startTime = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]).getTime()
		return startTime
}
/**
 * 获取目标离当前时间最近的列表项的id
 * @param {Object} data
 */
function getTargetId (data) {
	
	var arr = data.map(function (item) {
		    	var midd = {
		    		id: item.id,
		    		fplD: item.fplD
		    	}
		    	return midd
		    })
		    var oDate = new Date().getTime()
		    var result = []		// 大于当前时间的
		    var ltResult = []	// 小于当前时间的
		    arr.forEach(function (item, index) {
		    	
		    	var time = item.fplD ? splitTime(item.fplD) : '000000'
		    	arr[index].fplD = time
		    	// 大于当前时间的
		    	time - oDate >= 0  && result.push(arr[index])
		    	time - oDate < 0 && ltResult.push(arr[index])
		    	
		    })
		   var targetId = 0
		   if(result.length === 0) {
		   	   // 全部小于当前时间的
		   	   var arr1 = []
		   	   
		   	   arr.forEach(function (item) {
		   	   		arr1.push(item.fplD)
		   	   })
		   	   	
		   	   var Max = Math.max.apply(null, arr1)
		   	   targetId = arr[arr1.indexOf(Max)].id   
		   	   
		   } else {
		   		
		   		var arr2 = []
		   		
		   		result.forEach(function (item) {
		   			arr2.push(item.fplD)
		   		})
		   		// 所有大于当前时间的找出最小的
		   		var Min = Math.min.apply(null, arr2)
		   		
		   		var arr3 = []
		   		
		   		ltResult.forEach(function (item) {
		   			arr3.push(item.fplD)
		   		})
		   		// 所有小于当前时间的找出最大的
		   		var Max = Math.max.apply(null, arr3)
		   		
		   		targetId = Min - oDate > oDate - Max ? ltResult[arr3.indexOf(Max)].id : result[arr2.indexOf(Min)].id
		   	   
		   }
		   
		   target.id = targetId
		   
		   return targetId
}


// 模拟四字码
var mockFourData = ['ZBAA', 'ZSJN', 'ZGOW', 'ZSYW', 'ZSAQ', 'ZPJH', 'ZBTL', 'WMKK', 'ZUXC', 'KSEA', 'NZWN', 'OPRN', 'LSGG', 'EDDB', 'ROAH', 'RJSN', 'VECC', 'ZBNY', 'ZWSS']

// 复杂过滤 搜集条件
var complexFilter = {
	init: function (type) {
		// 过滤包裹器的显示隐藏
		this.filterContainerShow()
		// 事件
		this.selectTerm(type)
	},
	filterContainerShow: function () {
		
		$('.filter_btn').click(function (ev) {
			// 报文类型框隐藏
			$('.select_show').removeClass('open')
			
			ev.stopPropagation()
			this.isShow = !this.isShow
			this.isShow ? $('.filter_container').show() : $('.filter_container').hide()
		})
		// 隐藏
		$('.main_warp').click(function () {
			$('.filter_container').hide()
			
			if($('.filter_btn')[0]) {
				$('.filter_btn')[0].isShow = false
			}
		})
		$('.filter_container').click(function (ev) {
			ev.stopPropagation()
			$('.filter_term .option').hide()
		})
	},
	selectTerm: function (type) {
		var that = this
		// 机场字码
		var airports = []
		if(type === 'plane') {
			airports = airportList.fourCode
		} else if(type === 'plan') {
			airports = airportList.threeCode
		}
		// 输入框的事件
		$('.filter_term').find('input').keyup(function (ev) {
			var flag = $(this).attr('data-flag')
			
			this.value = this.value.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,'')	// 禁止输入中文
			
			// 获取输入框的值
			$(this).val($(this).val().toUpperCase())
			var val = $(this).val()
			if(flag != 'type') {
				// 机场
				var liStr = ''
				if(val) {
					
					airports.forEach(function (item) {
						if(item && item.indexOf(val) >= 0) {
							liStr = liStr + '<li>'+item+'</li>'
						}
					})
					
					liStr ? $(this).next().html(liStr).show() : $(this).next().html(liStr).hide() 
					
					if(ev.keyCode === 13) {
						// 回车键
						that.filterTermAdd($(this).parent().prev(), $(this))
					}
					
				} else {
					$(this).next().hide()
				}
			}
			
			
		}).focus(function () {
			var flag = $(this).attr('data-flag')
			var val = $(this).val()
			$('.filter_term').find('input').next().hide()
			if(flag != 'type') {
				if(val) {
					var liStr = ''
					airports.forEach(function (item) {
							if(item && item.indexOf(val) >= 0) {
								liStr = liStr + '<li>'+item+'</li>'
							}
						})
					$(this).next().html(liStr).show()
				}
			}
			
		}).click(function (ev) {
			// 阻止事件传播
			ev.stopPropagation()
		})
		
		
		// 监听选择四字码
		$('.term_input .option').click(function (ev) {
			// 阻止事件传播
			ev.stopPropagation()
			if(ev.target.nodeName.toLowerCase() === 'li'){
				$(this).find('.active').removeClass('active')
				var $target = $(ev.target)
				$target.addClass('active')
				$(this).prev().val($target.html())
			}
			$(this).hide()
		})
		
		// 添加按钮
		$('.filter_container').find('.add_term').click(function () {
			var $target = $(this)
			// 获取输入框的值
			var dataType = $target.attr('data-type')
			
			if(dataType === 'time') {
				// 时间区间
				// 获取下拉框的值
				var timeType = $('.select_time_type').val()
				if(!timeType) {
					
					showMsg('请选择时间类型')
					
				} else {
					// 选中的option的值
					var $option = $('.select_time_type>option:selected')					
					console.log($option.attr('data-type'))
					that.filterTermAdd($target, timeType, dataType, type, $option.attr('data-type'))
				}
				
			} else if(dataType === 'status'){
				// 报文状态
				// 获取状态下拉框的值
				var statusType = $('.message_status_sel').val()
				if(!statusType) {
					showMsg('请选择报文状态')
				} else {
					var $option = $('.message_status_sel>option:selected')
					var dataVal = $option.attr('data-val')
					var dataType = $option.attr('data-type')
					var $needTerm = $('.need_term')
					if($needTerm.find('li[data-val='+dataVal+']').length === 1) {
						return
					}
					var $li = $('<li data-val='+dataType+' data-type="msgstatus"><span class="term_val">'+ dataVal +'</span><span class="delete_term"><i class="delete-icon">&#xe601;</i></span></li>')
					$li.appendTo($needTerm)
					// 删除
					$li.find('.delete_term').click(function () {
						$li.remove()
					})
				}
			} else {
				var $input = $target.next().find('input')
				var val = $input.val()
				
				that.filterTermAdd($target, val, dataType, type)
				$input.val('')
				dataType != 'acType' && $input.next().hide()
			}
		})
		
	},
	// 过滤添加
	filterTermAdd: function ($target, val, type, airportType, optionStr) {
		// 机场字码
		var airports = []
		
		var textLength = 3
		if(airportType === 'plane') {
			
			airports = airportList.fourCode
			textLength = 4
			
		} else if(airportType === 'plan') {
			airports = airportList.threeCode
			textLength = 3
		}
		
		if(!val) {
			return
		} else {
			
			var $needTerm = $('.need_term')
			var dataVal = $target.attr('data-val')
			var dataType = $target.attr('data-type')
			
			if(type != 'acType') {
				// 不是机型
				// 验证
				if(type != 'time') {
					
					if( val.length != textLength || airports.indexOf(val) < 0) {
						return
					}
					
				} else {
					// 时间
					dataType = optionStr ? optionStr : $target.attr('data-type')
					dataVal = val
					// start_time
					var startTime = $('.time_range .start_time').html()
					var endTime = $('.time_range .end_time').html()
					val = startTime > endTime ? endTime + '-' + startTime : startTime + '-' + endTime
					
				}
				
			} else {
				
				// 匹配中文[\u4e00-\u9fa5]
				if(/[\u4e00-\u9fa5]/i.test(val) || !(/^[a-zA-z][0-9]{3}$/gi).test(val)) {
					$('.term_input .valid_input').show()
					return
				}
				
			}
			
			var str = dataVal + ' ' + val
			
			var isEx = false
			Array.prototype.forEach.call($needTerm.find('li[data-val='+dataVal+']'), function (item) {
				if($(item).find('.term_val').html() === str) {
					isEx = true
				}
			})
			
			if(isEx) {
				return
			}
				var $li = $('<li data-val='+dataVal+' data-type='+dataType+'><span class="term_val">'+ dataVal +" " + val +'</span><span class="delete_term"><i class="delete-icon">&#xe601;</i></span></li>')
				$li.appendTo($needTerm)
				// 删除
				$li.find('.delete_term').click(function () {
					$li.remove()
				})

		}
	}
	
}

// 选择时间区间
/**
 * 选择时间区间
 * @param {Object} ev	事件对象
 * @param {Object} isStart	是否是开始时间
 */

var timeSeleSave = {
	
}

function selectTimeSect (ev, isStart) {
	
	this.initX = this.offsetLeft
	this.startX = ev.clientX
	var that = this
	
	var maxL = $('.thumb_wrap').width()			// 开始00:00  结束 23:59
	
	// 获取开始的位置信息
	that.startThumb = {
		left: $('.start_thumb')[0].offsetLeft
	}
	// 获取结束时间的位置信息
	that.endThumb = {
		left: $('.end_thumb')[0].offsetLeft
	}

	var $startTime = $('.start_time')
	var $endTime = $('.end_time')
	
	
	var startTempTime = $startTime.html()
	var endTempTime = $endTime.html()
	
//	if(timeSeleSave.startLeft > timeSeleSave.endLeft) {
//		// 说明start在后	end 在前
//		console.log($(that).attr('class'))
//		
//		var temp = timeSeleSave.startLeft
//		timeSeleSave.startLeft = timeSeleSave.endLeft
//		timeSeleSave.endLeft = temp
//		
//		if($(that).attr('class') === 'end_thumb') {
//			// 点击end
//			timeSeleSave.isEndPrev = true
//			isStart = true
//		} else {
//			isStart = false
//		}
//		
//	}
	
	$(document).mousemove(function (ev) {
		ev.preventDefault()
		that.moveX = ev.clientX
		var l = (that.initX + that.moveX - that.startX)
		
		if(l > maxL) {
			l = maxL
			return
			
		} else if(l < 0) {
			l = 0
			return
		}
		
		var time = (l/maxL)*(23*60*60*1000 + 59*60*1000)
		var hours = parseInt(time/(1000*60*60))
		var minutes = parseInt(time/(1000*60) - Math.floor(time/(1000*60*60))*60)
		
		hours = hours < 10 ? '0' + hours : hours
		
		minutes = minutes < 10 ? '0' + minutes : minutes
		
		$(that).css({
			left: l + 'px'
		})
		
		
		if(isStart) {
			
			timeSeleSave.startLeft = l
			// 判断
//			$startTime.html(hours + ':' + minutes)
			if(timeSeleSave.startLeft && timeSeleSave.endLeft && timeSeleSave.startLeft > timeSeleSave.endLeft) {
				
				$startTime = $('.end_time')
//				$endTime.html(hours + ':' + minutes)
//				$startTime.html(endTempTime)
			} else {
				$startTime = $('.start_time')
			}

			
			$startTime.html(hours + ':' + minutes)
			
			$('.decorate_thumb').css({
				left: Math.min(that.endThumb.left, that.offsetLeft) + 'px',
				width: Math.abs(that.endThumb.left - that.offsetLeft) + 'px'
			})
			
		} else {
			
			timeSeleSave.endLeft = l
//			$endTime.html(hours + ':' + minutes)
			if(timeSeleSave.startLeft && timeSeleSave.endLeft && timeSeleSave.startLeft > timeSeleSave.endLeft) {
				
//				$startTime.html(hours + ':' + minutes)
//				$endTime.html(startTempTime)
				$endTime = $('.start_time')
				
			} else {
				
				$endTime = $('.end_time')
//				$endTime.html(hours + ':' + minutes)

			}
			
			$endTime.html(hours + ':' + minutes)
			
			$('.decorate_thumb').css({
				left: Math.min(that.startThumb.left, that.offsetLeft) + 'px',
				width: Math.abs(that.startThumb.left - that.offsetLeft) + 'px'
			})
			
		}
		
	}).mouseup(function (ev) {
		ev.preventDefault()
		$(this).unbind('mousemove')
		$(this).unbind('mouseup')
	})	
}

// 获取多选字段条件
function getMultTerm () {
	var $li = $('.need_term').find('li')
	if($li.length === 0) {
		return undefined
	} else {
		var result = {
			
		}
		Array.prototype.forEach.call($li, function (li) {
			// 获取
			var dataType = $(li).attr('data-type')
			var termVal = $(li).find('.term_val').html().slice(3)
			if(dataType === 'msgstatus') {
				// 报文状态
				termVal = Number($(li).attr('data-val'))
			}
			if(result[dataType]) {
				result[dataType].push(termVal)
			} else {
				result[dataType] = []
				result[dataType].push(termVal)
			}
			
		})
		return result
	}
}
// 重置数据
var resetData = {
	init: function () {
		$('.need_term').html('')
		$('.select_time_type').val('-选择-')
		
		$('.message_status_sel').val('-选择-')
//		$('.decorate_thumb').css({
//			width: '0px',
//			left: '0px'
//		})
//		$('.start_thumb').css({
//			left: '0px'
//		})
//		$('.end_thumb').css({
//			left: '0px'
//		})
		
		// 开始结束时间需要重新改变
//		timeSeleSave.startTime = 0
//		timeSeleSave.endTime = 23*60*60*1000 + 59*60*1000
		// 重置时间选段
		$('.start_time').html('00:00')
		$('.end_time').html('23:59')
		$('.nstSlider .rightGrip').css({
			left: 0
		})
		$('.nstSlider .leftGrip').css({
			left: 0
		})
		$('.nstSlider .bar').css({
			width: 0
		})
		
		$('.search_input').val('')
		$('.message_type_title').html('全部')
		$('.message_type .active').next().hide()
		$('.message_type .active').removeClass('active')
		$('.message_type a[data-val=all]').addClass('active')
		$('.delete_val').hide()
		

		$('.list_content').getNiceScroll().resize()
		$('.list_content').getNiceScroll().show()
	},
	history: function () {
		this.init()
		$('#dateStart').val('')
		$('#dateEnd').val('')
	},
	current: function (url, callback, type) {
		// 发送请求
		this.init()
		var param = {
			isHis: 0
		}
		
		getJson(url, function (data) {
			
			if(data.c.flag === 0 && data.c.errorCode === '004') {
				ShowMsg('没有数据')
			}
			
			if(data.c.flag === 1) {
				
				callback(data)
				
				pageing.showOrHide('current')
				
				if(type === 'plane') {
					
				}
				if(type === 'plane' || type === 'plan') {
					
					if(type === 'plane') {
						// 重置	将接近当前时间列表显示在中间
						var $target = $('.common_table .table_content tr[data-id='+target.id+']')	
						$target.addClass('closing_current')
						var len = $target.prevAll().length
						$target.parent().parent().parent().animate({
							scrollTop: (len - 9) * 38 + 'px'
						})
					} 
					// 如果是排序的状态	
					$('.sort_plane').hide()
					sortCache.flag = ''
					sortCache.status = 0
					if(sortCache.$el) {
						sortCache.$el.count = 0
					}
					sortCache.cloneData = deepCloneObj(data.c.flights)
					sortCache.initData = data.c.flights
				}
				
				// 重置滚动条
				$('.list_content').getNiceScroll().show()
				$('.list_content').getNiceScroll().resize()
				
			}
			
		}, JSON.stringify(param))
	}
}


// 请求四字码和三字码
var airportList = {
	threeCode: [],	// 三字码
	fourCode: []	// 四字码
}
getJson('sys/airportlist', function (data) {

	if(data.c.flag === 1) {
		// 成功接收到数据
		var airports = data.c.airports
		airports.forEach(function (item) {
			airportList.threeCode.push(item.iata)
			airportList.fourCode.push(item.icao)
		})
	}
}, '')


/**
 * 整理时间选段(修改bug 使用滑动控件)
 */
function nstSlideTime () {
 
	$('.nstSlider').nstSlider({

                "left_grip_selector": ".leftGrip",

                "right_grip_selector": ".rightGrip",

                "value_bar_selector": ".bar",

                "value_changed_callback": function(cause, leftValue, rightValue) {
                	
                    $('.leftLabel').text(manageNstTime(leftValue));
                    $('.rightLabel').text(manageNstTime(rightValue));
                }
                

    });
    $('.nstSlider .bar').css({
    	width: 0
    })
    $('.nstSlider .rightGrip').css({
    	transform: 'translate(-50%, -50%)'
    })
    $('.start_time').html('00:00')
    $('.end_time').html('23:59')
   	function manageNstTime (leftValue) {
   		leftValue = Number(leftValue)
					var lHour = parseInt(leftValue/(1000*60*60))
					var lMin = parseInt(leftValue/(1000*60) - Math.floor(leftValue/(1000*60*60))*60)
					lHour = lHour < 10 ? '0' + lHour : lHour
		
					lMin = lMin < 10 ? '0' + lMin : lMin
		return lHour + ':' + lMin
   	}
}

