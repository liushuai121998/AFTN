// 初始化请求	weather/weathersbyuserid	{"userId":1}
getJson('weather/weathersbyuserid', function (data) {
	if(data.c.flag === 0) {
		showMsg('请先登录')
		$('.carousel .left').hide()
		$('.carousel .right').hide()
		return
	}
	if(data.c.flag === 1) {
		console.log(data, 'init data')
		saveInitData = data.c.airports
	//	// 初始化获取用户关注的机场天气列表
		
		// 根据airports	列表生成关注的天气列表信息
		weatherInit.createList(data.c.airports)
	   	weatherInit.createContent(data.c.airports)
	}
	
	
}, {userId: aftn_userId})

// 保存初始化的数据
var saveInitData = []

// 解析出小图片的地址信息

var weatherInit = {
	
	createList: function (data) {
		var liStr = ''
		data.forEach(function (item, index) {
			var imgUrl = ''
			var temperature = ''
			item.weathers.forEach(function (weather) {
				// 默认 METAR报
				if(weather.msgType === 'METAR') {
					var sceneStr = weather.scenes ? weather.scenes.join() : ''
					imgUrl = sceneStr ? manageWeatherPic(sceneStr, false) : ''
					temperature = weather.airTemperature ? weather.airTemperature : ''
				}
				
			})
			var img = imgUrl ? '<img class="small_img" src='+imgUrl+' />' : (item.weathers.length === 0 ? '' : '<img class="small_img" src="./images/default_small.png" />')
			if(index === 0) {
				// 初始化当前显示的航班	
				currentAirport = item.airport
				liStr = liStr + '<li data-val='+item.airport+'><span class="airport_title active">'+item.airport+'</span>'+img+'<span class="template airport_title active">'+temperature+'</span></li>'		// 默认第一个不能删除
			} else {
				liStr = liStr + '<li data-val='+item.airport+'><span class="airport_title">'+item.airport+'</span>'+img+'<span class="template airport_title ">'+temperature+'</span><span class="delete_airport_list"><i class="panel-icon">&#xe61e;</i></span></li>'
			}

		})
		// 气温	airTemperature
		$('.weather_list_content').html(liStr)
	},
	// 生成天气的详细内容
	createContent: function (data) {
		// 默认显示第一个
		createWeatherContent(data[0].weathers)
	}
	
	
}

// 每隔一段时间重新去请求一次全量数据
updateWeatherContent()
function updateWeatherContent() {
	
	saveTime['weather'].timeId = setInterval(function () {
		
		noLoadJson('weather/weathersbyuserid', function (data) {
			// 更新数据
			if(data.c.flag === 1) {
				saveInitData = data.c.airports
				console.log('weather update', data)
				var liStr = ''
				saveInitData.forEach(function (item, index) {
					var imgUrl = ''
					var temperature = ''
					item.weathers.forEach(function (weather) {
						// 默认 METAR报
						if(weather.msgType === 'METAR') {
							var sceneStr = weather.scenes ? weather.scenes.join() : ''
							imgUrl = sceneStr ? manageWeatherPic(sceneStr, false) : ''
							temperature = weather.airTemperature ? weather.airTemperature : ''
						}
						
					})
					var img = imgUrl ? '<img class="small_img" src='+imgUrl+' />' : (item.weathers.length === 0 ? '' : '<img class="small_img" src="./images/default_small.png" />')
					if(index === 0) {
						if(currentAirport === item.airport) {
							createWeatherContent(item.weathers, currentWeatherType)
							liStr = liStr + '<li data-val='+item.airport+'><span class="airport_title active">'+item.airport+'</span>'+img+'<span class="template airport_title active">'+temperature+'</span></li>'		// 默认第一个不能删除
						} else {
							liStr = liStr + '<li data-val='+item.airport+'><span class="airport_title">'+item.airport+'</span>'+img+'<span class="template airport_title">'+temperature+'</span></li>'		// 默认第一个不能删除
						}

					} else {
						if(currentAirport === item.airport) {
							// 重新渲染当前航班
							createWeatherContent(item.weathers, currentWeatherType)
							liStr = liStr + '<li data-val='+item.airport+'><span class="airport_title active">'+item.airport+'</span>'+img+'<span class="template airport_title active">'+temperature+'</span></li>'		// 默认第一个不能删除
							
						} else {
							liStr = liStr + '<li data-val='+item.airport+'><span class="airport_title">'+item.airport+'</span>'+img+'<span class="template airport_title ">'+temperature+'</span><span class="delete_airport_list"><i class="panel-icon">&#xe61e;</i></span></li>'
						}
					}
					
				})
				
				$('.weather_list_content').html(liStr)
			}
			
		}, {userId: aftn_userId, time: new Date().getTime()})

	}, weatherUTime)

}

var currentWeatherType = 'METAR'	// 当前天气的类型

/**
 * 创建天气的内容
 * @param {Object} weather
 */
function createWeatherContent (weather) {
	if(weather.length === 0) {
		return
	}
	
	$('.carousel-inner').html('')
	
	var msgType = []
	var timeStr = ''
	var imgUrl = ''
	var temperature = ''
				
	weather.forEach(function (item) {
			msgType.push(item.msgType)
			timeStr = item.obstTime.split(' ').join('/')
			switch (item.msgType) {
				case 'METAR': 
					
					if(currentWeatherType === item.msgType) {
						
						$('.obs_time').html(item.obstTime)
						weatherContent.create(item, $('<div class="item active weather_metar" data-type="METAR" data-time='+timeStr+'></div>')).appendParent($('.carousel-inner'))
						
					} else {
						weatherContent.create(item, $('<div class="item weather_metar" data-type="METAR" data-time='+timeStr+'></div>')).appendParent($('.carousel-inner'))
					}
				break
				case 'SPECI':
					if(currentWeatherType === item.msgType) {
						$('.obs_time').html(item.obstTime)
						weatherContent.create(item, $('<div class="item active weather_speci" data-type="SPECI" data-time='+timeStr+'></div>')).appendParent($('.carousel-inner'))
					} else {
						weatherContent.create(item, $('<div class="item weather_speci" data-type="SPECI" data-time='+timeStr+'></div>')).appendParent($('.carousel-inner'))
					}

				break
				case 'TAF':
					if(currentWeatherType === item.msgType) {
						$('.obs_time').html(item.obstTime)
						weatherContent.create(item, $('<div class="item active weather_taf" data-type="TAF" data-time='+timeStr+'></div>')).appendParent($('.carousel-inner'))
					} else {
						weatherContent.create(item, $('<div class="item weather_taf" data-type="TAF" data-time='+timeStr+'></div>')).appendParent($('.carousel-inner'))
					}

				break
			}
			
	})
	currentWeatherType === 'TAF' ? $('li[data-flag="tafs"]').show() : $('li[data-flag=tafs]').hide()
	if(msgType.length === 0 || msgType.length === 1) {
		// 隐藏左右箭头的切换
		$('.carousel .left').hide()
		$('.carousel .right').hide()
		
	} else {
		$('.carousel .left').show()
		$('.carousel .right').show()
	}
	
	// 切换的动画效果
	
	
	
	// 结束过渡动画
//	$('.carousel').on('slid.bs.carousel', function () {
//		// 显示发布时间
//		var $active = $('.carousel-inner .active')
//	  	$('.obs_time').html($active.attr('data-time').split('/').join(' '))
//	  
//	  	// 当前的显示的天气类型
//	  	currentWeatherType = $active.attr('data-type')
//	})
//	
	
}
	$('.carousel .right').click(function () {
		var $active = $('.carousel').find('.active')
		$active.removeClass('active')
		$active.hide()
		var $target = null
		if($active.next()[0]) {
			$target = $active.next()
			$target.show()
			$target.addClass('active')
		}else {
			$target = $active.parent().find('.item:first-child')
			$target.show()
			$target.addClass('active')
		}
		$('.obs_time').html($target.attr('data-time').split('/').join(' '))
		
	  	// 当前的显示的天气类型
	  	currentWeatherType = $target.attr('data-type')
	  	
	  	currentWeatherType === 'TAF' ? $('li[data-flag="tafs"]').show() : $('li[data-flag="tafs"]').hide()
	  	
	})
	
	$('.carousel .left').click(function () {
		
		var $active = $('.carousel').find('.active')
		$active.removeClass('active')
		$active.hide()
		
		var $target = null
		if($active.prev()[0]) {
			$target = $active.prev()
			$target.show()
			$target.addClass('active')
		}else {
			$target = $active.parent().find('.item:last-child')
			$target.show()
			$target.addClass('active')
		}
		$('.obs_time').html($target.attr('data-time').split('/').join(' '))
	  	// 当前的显示的天气类型
	  	currentWeatherType = $target.attr('data-type')
	  	currentWeatherType === 'TAF' ? $('li[data-flag="tafs"]').show() : $('li[data-flag="tafs"]').hide()
	})

var isFold = false
//折叠与收缩按钮显示隐藏天气列表
$('.weather_list_icon').click(function () {
	this.isFirst = true
	this.isShow = !this.isShow
	if(this.isShow) {
		$(this).find('.weather-fold-icon').html('&#xe62e;')
		// 显示 过渡		$('.weather_list').show(100)
		$('.weather_list').show(200)
		var oldWidth = $('.weather_detail').width() - 217
		$('.weather_detail').animate({
			width: oldWidth + 'px',
			left: '217px'
		}, 200)
		// 模拟点击第一条出现滚动条
		//$('.weather_list_content li:first-child').click()

		// 滚动条
		if(this.isFirst) {
			$(".weather_list_content").niceScroll({
				cursorcolor: "#999",
				cursorwidth: '5px',
				railpadding: { top: 0, right: 2, left: 0, bottom: 0},
			})	
			this.isFirst = false
		}
		$(".weather_list_content").getNiceScroll().hide()
		
		setTimeout(function () {
			// 解决火狐浏览器滚动条位置不对的问题
			$(".weather_list_content").getNiceScroll().show()
			$(".weather_list_content").getNiceScroll().resize()
		}, 200)
		isFold = true
		
	} else {
		$(this).find('.weather-fold-icon').html('&#xe6b3;')
		$('.weather_list').hide(200)
		
		$('.weather_detail').animate({
			width: '100%',
			left: 0
		}, 200)
		// 隐藏滚动条
		$(".weather_list_content").getNiceScroll().hide()
		isFold = false
	}
	// 先隐藏
	$(".cloud_runway").getNiceScroll().hide();
	$(".scenes_prescenes").getNiceScroll().hide();
	$(".weather_trend").getNiceScroll().hide();
	
	setTimeout(function () {
		// 再显示	然后重置大小
		$(".cloud_runway").getNiceScroll().show();
		$(".scenes_prescenes").getNiceScroll().show();
		$(".weather_trend").getNiceScroll().show();
		$(".cloud_runway").getNiceScroll().resize();
		$(".scenes_prescenes").getNiceScroll().resize();
		$(".weather_trend").getNiceScroll().resize();
		
	}, 200)
})

$(window).resize(function () {
	isFold ? $('.weather_detail').width(document.documentElement.clientWidth - 237) : $('.weather_detail').width(document.documentElement.clientWidth - 20)
})

// 轮播
$('.carousel').carousel({
	interval: false
})

// 添加天气列表
$('.add_w_list').click(function () {
	this.isShow = !this.isShow
	this.isShow ? $(this).find('i').html('&#xe605;') : $(this).find('i').html('&#xe64b;')
	this.isShow ? $('.add_list_info').show() : $('.add_list_info').hide()
//	this.isShow ? $('.weather_list_content').animate({
////		'max-height': '50%'
//	}, 200) : $('.weather_list_content').animate({
//		'max-height': '100%'
//	}, 200)
})

//输入框事件
/**
 * 输入框的事件
 * @param {Object} $input	输入框
 * @param {Object} $ul	符合条件的四字码包裹器
 */
// 删除输入框的数据
$('.weather_delete_val').click(function () {
	$(this).parent().find('input').val('')
	$(this).hide()
})

function inputEvent($input, $ul, fn) {
	var isPinyin = false;
	$input.on('compositionstart', function () {
		isPinyin = true; 
	});//此时为拼音输入法
	
	$input.on('compositionend', function () { isPinyin = false });//此时为直接输入，包括数字、字符和英文输入

	// 四字码	airportList.fourCode
	$input.keyup(function (ev) {
		this.value = this.value.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,'')	// 禁止输入中文
		$(this).val($(this).val().toUpperCase())
		var val = $(this).val().trim()
		keyUpFilter.call(this, $ul, val)
		// 按下回车键
		if(ev.keyCode === 13) {
			var that = this
			$ul.hide()
			manageAirportList.init(val, function () {
				fn && fn(val)
			})
		}
		
		val && $input.parent().find('.weather_delete_val').show()
		
	}).focus(function () {
		var val = $(this).val().trim()
		keyUpFilter.call(this, $ul, val)
		val && $input.parent().find('.weather_delete_val').show()
	}).click(function (ev) {
		ev.stopPropagation()
	})
}

// 机场列表的输入框事件
inputEvent($('.add_list_input'), $('.add_airport_code'), function () {
	manageAirportList.add()
})	

// 加号按钮
$('.add_list_btn').click(function () {
	var $input = $('.add_list_input')
	var val = $input.val()
	manageAirportList.init(val, function () {
		
		manageAirportList.add()
		
	})
})

// 搜索天气
var searchWeather = {
	init: function () {
		this.bindEvent()
	},
	bindEvent: function () {
		var that = this
		var $input = $('.weather_search .search_input')
		// 搜索按钮
		$('.search_icon').click(function () {
			var val = $input.val()
			val && that.ajaxRender(val)
		})
		// 搜索框的输入框事件
		inputEvent($input, $('.search_code'), function (val) {
			val && that.ajaxRender(val)
		})
	},
	// 发送请求渲染页面
	ajaxRender: function (val) {
		// 发送请求 显示数据	weather/weathersbyairport	{ "airport":"CNNN"}
			getJson('weather/weathersbyairport', function (data) {
				
				if(data.c.flag === 0 && data.c.errorCode === '004') {
					showMsg('没有此机场的数据')
					return
				}
				
				if(data.c.flag === 1) {
					
					currentAirport = val
					
					currentWeatherType = 'METAR'
					
					$('.weather_list_content').find('.airport_title.active').removeClass('active')
					$('.weather_list_content li[data-val='+val+']').find('.airport_title').addClass('active')
					
					createWeatherContent(data.c.weathers)
				}
				
			}, {airport: val})
	}
}

searchWeather.init()


// 四字码点击事件
$('.add_airport_code').click(function (ev) {
	ev.stopPropagation()
	
	$(this).find('.active').removeClass('active')
	$(ev.target).addClass('active')
	$('.add_list_input').val($(ev.target).html())
	
	$(this).hide()
})

$('.search_code').click(function (ev) {
	ev.stopPropagation()
	
	$(this).find('.active').removeClass('active')
	$(ev.target).addClass('active')
	$('.weather_search .search_input').val($(ev.target).html())
	
	$(this).hide()
})


$('.main_content').click(function () {
	$('.search_code').hide()
	$('.add_airport_code').hide()
})

// 机场列表的增删操作
var manageAirportList = {
	// 初始化判断事件
	init: function (val, fn) {
		if(val.length === 4 && airportList.fourCode.indexOf(val) >= 0) {
			fn && fn()
		}
	},
	// 增加
	add: function () {		
		var $input = $('.add_list_input')
		var val = $input.val()
		var $listContent = $('.weather_list_content')
		
			if($listContent.find('li[data-val='+val+']').length === 1) {
				showMsg('当前机场已经存在')
				return
			}
			$input.val('')
			$('.weather_delete_val').hide()
			$('.add_airport_code').hide()
			// weather/addairport	{"userId":1, "airport":	val}	// 返回机场的天气信息
			// 添加
			// 添加成功后发送请求
			this.sendAjax(val, 'weather/addairport', true)
		
	},
	// 删除
	deleteList: function ($target) {
		
		var airportVal = $target.attr('data-val')
		var that = this
		// 如果删除的这个是正在显示的机场则默认显示当前的上一个
		// 删除的当前显示的机场 显示上一个
		var prevAirport = $target.prev().find('.airport_title').html()
		var $prev = $target.prev()
		if(airportVal === currentAirport) {
			// 找到有数据的机场列表
			(function searchRealAir (prevAirport) {
				saveInitData.forEach(function (item) {
					if(item.airport === prevAirport) {
						if(item.weathers.length > 0) {
							$prev.find('.airport_title').addClass('active')
							currentAirport = prevAirport
							createWeatherContent(item.weathers)
							return
						} else {
							$prev = $prev.prev()
							searchRealAir($prev.find('.airport_title').html())
						}
					}
				})
			})(prevAirport)
		}
		// 删除指定这条信息
		$target.remove()
		that.sendAjax(airportVal, 'weather/delairport', false)
		// 删除成功发送请求	
		// weather/delairport	{"userId":1, "airport":"CNNN"}		///当前机场的四字码	aftn_userId 用户Id
	},
	sendAjax: function (val, url, isAdd) {
		
		if(isAdd) {
				getJson(url, function (data) {
					console.log(data)
					if(data.c.flag === 1) {
						
						saveInitData.push({
							airport: val,
							weathers: data.c.weathers
						})
						
						var imgUrl = ''
						var temperature = ''
						data.c.weathers.forEach(function (weather) {
							if(weather.msgType === 'METAR') {
								var sceneStr = weather.scenes ? weather.scenes.join() : ''
								imgUrl = sceneStr ? manageWeatherPic(sceneStr, false) : ''
								temperature = weather.airTemperature ? weather.airTemperature : ''
							}
						})
						// 添加列表
						var img = imgUrl ? '<img class="small_img" src='+imgUrl+' />' : (data.c.weathers.length === 0 ? '' : '<img class="small_img" src="./images/default_small.png" />')
						var liStr = '<li data-val='+val+'><span class="airport_title">'+val+'</span>'+img+'<span class="template airport_title">'+temperature+'</span><span class="delete_airport_list"><i class="panel-icon">&#xe61e;</i></span></li>'
						$('.weather_list_content').append(liStr)
						
					}
					
				}, {"userId": aftn_userId, "airport": val})
		} else {
			
			getJson(url, function (data) {
				if(data.c.flag === 1) {
//					 删除指定的机场信息
					saveInitData.forEach(function (item, index, arr) {
						if(item.airport === val) {
							arr.splice(index, 1)
						}
					})
				}
				
			}, {"userId": aftn_userId, airport: val})
		}
			
	}
}

// 搜索按钮
$('.weather_search .search_icon').click(function () {
	manageAirportList.init($(this).val(), function () {
			// 		// 发送请求 显示数据
			$('.carousel-inner .active').removeClass('active')
			$('.weather_metar').addClass('active')
	})
})

/**
 * 输入框的keyUp事件		生成符合输入条件的四字码集合
 * @param {Object} $code val
 */
function keyUpFilter ($code, val) {
	// 显示符合条件的四字码
	var liStr = ''
	
	if(val) {
		airportList.fourCode.forEach(function (item) {
			if(item && item.indexOf(val) >= 0) {
				liStr += '<li>'+item+'</li>'
			}
		})	
	} 
	
	liStr ? $code.html(liStr).show() : $code.html(liStr).hide()
}

var currentAirport = ''			// 当前显示的航班四字码

$('.weather_list_content').click(function (ev) {

//	$(this).find('.active').removeClass('active')
//	$(ev.target).addClass('active')
	// 字体颜色改变
	var $target = $(ev.target)
	
	switch (ev.target.nodeName.toLowerCase()) {
		case 'span':
			if(ev.target.className === 'delete_airport_list') {
				manageAirportList.deleteList($target.parent())
				return
			} else {
				$target = $target.parent().find('.airport_title')
			}
		break;
		case 'li':
			$target = $target.find('.airport_title')
		break;
		case 'i':
			// 删除信息
			manageAirportList.deleteList($target.parent().parent())
			return
		break;
		case 'img':
			$target = $target.parent().find('.airport_title')
		break;	
	}
	
	// 切换机场的天气，显示当前机场的天气
	var airportStr = $target.html()
	
	var that = this
	saveInitData.forEach(function (item) {
		if(item.airport === airportStr) {
			if(item.weathers.length === 0) {
				// 天气信息没有内容
				return
			} else {
				currentAirport = airportStr
				currentWeatherType = 'METAR'
				
				// 输入框内容清空
				$('.search_input').val('')
				$('.weather_delete_val').hide()
				
				$(that).find('.airport_title.active').removeClass('active')
				$target.addClass('active')
				createWeatherContent(item.weathers)
				return
			}
		}
	})
	
}).mousemove(function (ev) {
	ev.stopPropagation()
	$(this).find('.delete_airport_list').hide()
	
	var $target = $(ev.target)
	if(ev.target.nodeName.toLowerCase() === 'li') {
		
	} else if(ev.target.nodeName.toLowerCase() === 'span') {
		$target = $target.parent()
	} else if(ev.target.nodeName.toLowerCase() === 'i') {
		$target = $target.parent().parent()
	} else if(ev.target.nodeName.toLowerCase() === 'ul') {
		return
	}
	
	$target.find('.delete_airport_list').show()
	
})

$(document).mousemove(function (ev) {
	$('.delete_airport_list').hide()
})


// 三种天气	METAR 	SPECI 	TAF		左箭头	metar-speci-taf循环		右键头	metar-taf-speci	循环

// 生成天气的内容
var weatherContent = (function () {
	var baseTpl = [
		"<section>",
		    "<ul>",
		        				"<li data-flag='msgType'>",
		        					"<span>天气报类型:</span>",
		        					"<span>{#msgType#}</span>",
		        				"</li>",
			        			"<li data-flag='windD'>",
			        				"<span>风向:</span>",
			        				"<span>{#windD#}</span>",
			        			"</li>",
			        			"<li data-flag='windVrb'>",
			        				"<span>风是否满足VRB:</span>",
			        				"<span>{#windVrb#}</span>",
			        			"</li>",
			        			"<li data-flag='windSpeedGuest'>",
			        				"<span>阵风风速:</span>",
			        				"<span>{#windSpeedGuest#}</span>",
			        			"</li>",
			        		"</ul>",
		        		"</section>",
		"<section>",
		        			"<ul>",
			        			"<li data-flag='airport'>",
			        				"<span>机场:</span>",
			        				"<span>{#airport#}</span>",
			        			"</li>",
			        			"<li data-flag='visibility'>",
			        				"<span>机场能见度:</span>",
			        				"<span>{#visibility#}</span>",
			        			"</li>",
			        			"<li data-flag='airTemperature'>",
			        				"<span>气温:</span>",
			        				"<span>{#airTemperature#}</span>",
			        			"</li>",
			        			"<li data-flag='wsRwyMessage'>",
			        				"<span>受风切变影响的跑道:</span>",
			        				"<span>{#wsRwyMessage#}</span>",
			        			"</li>",
			        		"</ul>",
		        		"</section>",
		"<section>",
		        			"<ul>",
			        			"<li data-flag='windDchangeMin'>",
			        				"<span>风向变化的最小值:</span>",
			        				"<span>{#windDchangeMin#}</span>",
			        			"</li>",
			        			"<li data-flag='windDchangeMax'>",
			        				"<span>风向变化的最大值:</span>",
			        				"<span>{#windDchangeMax#}</span>",
			        			"</li>",
			        			"<li data-flag='windSpeed'>",
			        				"<span>风速:</span>",
			        				"<span>{#windSpeed#}</span>",
			        			"</li>",
			        			"<li data-flag='tafs' style='display: none'>",
			        				"<span>预测开始时间:</span>",
			        				"<span>{#tafStime#}</span>",
			        			"</li>",
			        		"</ul>",
		        		"</section>",
		"<section>",
		        			"<ul>",
			        			"<li data-flag='dewPointTemperature'>",
			        				"<span>露点温度:</span>",
			        				"<span>{#dewPointTemperature#}</span>",
			        			"</li>",
			        			"<li data-flag='isCavok'>",
			        				"<span>是否满足CAVOK:</span>",
			        				"<span>{#isCavok#}</span>",
			        			"</li>",
			        			"<li data-flag='airPressure'>",
			        				"<span>气压:</span>",
			        				"<span>{#airPressure#}</span>",
			        			"</li>",
			        			"<li data-flag='tafs' style='display: none'>",
			        				"<span>预测结束时间:</span>",
			        				"<span>{#tafEtime#}</span>",
			        			"</li>",
			        		"</ul>",
		        		"</section>"
	].join('')
	
	
	//	云量信息
	var cloudsTpl = [
				"<ul class='{#realData#}'>",
			        			"<li data-flag='cloudNum'>",
			        				"<span>云量:</span>",
			        				"<span>{#cloudNum#}</span>",
			        			"</li>",
			        			"<li data-flag='cloudHeight'>",
			        				"<span>云层高度:</span>",
			        				"<span>{#cloudHeight#}</span>",
			        			"</li>",
			        			"<li data-flag='cloudMore'>",
			        				"<span>特殊云类型:</span>",
			        				"<span>{#cloudMore#}</span>",
			        			"</li>",
			        		"</ul>"
	].join('')
	
	// 跑道信息	
	var runwaysTpl = [
		"<ul class='{#realData#}'>",
			        			"<li data-flag='runwayNum'>",
			        				"<span>跑道号:</span>",
			        				"<span>{#runwayNum#}</span>",
			        			"</li>",
			        			"<li data-flag='visibility'>",
			        				"<span>视程:</span>",
			        				"<span>{#visibility#}</span>",
			        			"</li>",
			        			"<li data-flag='visibilityChangeType'>",
			        				"<span>变化趋势:</span>",
			        				"<span>{#visibilityChangeType#}</span>",
			        		"</ul>"
	].join('')
	
	// 趋势信息
	var trendsTpl = [
		"<ul>",
			        			"<li data-flag='trendChangeTime' class='trend_time'>",
			        				"<span>趋势时间描述:</span>",
			        				"<span>{#trendChangeTime#}</span>",
			        			"</li>",
			        			"<li data-flag='type'>",
			        				"<span>趋势类型:</span>",
			        				"<span>{#type#}</span>",
			        			"</li>",
			        			"<li data-flag='tafAirTemperature'>",
			        				"<span>趋势内温度信息:</span>",
			        				"<span>{#tafAirTemperature#}</span>",
			        			"</li>",
			        			"<li data-flag='windD'>",
			        				"<span>风向值:</span>",
			        				"<span>{#windD#}</span>",
			        			"</li>",
			        			"<li data-flag='windVrb'>",
			        				"<span>风是否满足VRB:</span>",
			        				"<span>{#windVrb#}</span>",
			        			"</li>",
			        			"<li data-flag='windSpeed'>",
			        				"<span>风速:</span>",
			        				"<span>{#windSpeed#}</span>",
			        			"</li><li data-flag='windSpeedGuest'>",
			        				"<span>阵风风速:</span>",
			        				"<span>{#windSpeedGuest#}</span>",
			        			"</li>",
			        			"<li data-flag='visibility'>",
			        				"<span>机场能见度:</span>",
			        				"<span>{#visibility#}</span>",
			        			"</li>",
			        			"<li data-flag='isCavok'>",
			        				"<span>是否满足CAVOK:</span>",
			        				"<span>{#isCavok#}</span>",
			        			"</li>",
			        		"</ul>"
	].join('')
	
	var moniTrendInfo = [{
		type: 'leixing',
		trendChangeTime: '描述',
		tafAirTemperature: '30℃',
		windD: '12',
		windVrb: 'Y',
		windSpeed: '22',
		windSpeedGuest: '33',
		visibility: '45',
		isCavok: 'N',
		scenes: ["(轻微) (雨)", "(雷暴)"],
		prescenes: ['1', '2']
	},
	{
		type: 'leixing',
		trendChangeTime: '描述',
		tafAirTemperature: '30℃',
		windD: '12',
		windVrb: 'Y',
		windSpeed: '22',
		windSpeedGuest: '33',
		visibility: '45',
		isCavok: 'N',
		scenes: ["(轻微) (雨)", "(雷暴)"],
		prescenes: ['1', '2']
	}]
	
	/**
	 * 生成气象信息
	 * @param {Object} data
	 */
	function createScenes (data) {

			var scenesStr = ''
			if(data) {
				
				if(data.length >= 2) {
					data.forEach(function (item, index) {
						scenesStr += '<li class="real_info"><span>气象信息'+(index+1)+':</span><span>'+(item && item.replace(/\（|\）/g,' ') || "--")+'</span></li>'
					})
					scenesStr = '<ul data-flag="scenes">'+scenesStr+'</ul>'
				} else {
					
					scenesStr += '<li class="real_info"><span>气象信息1:</span><span>'+(data[0] && data[0].replace(/\（|\）/g,' ') || "--")+'</span></li>'
					scenesStr += '<li><span>气象信息2:</span><span>--</span></li>'
					scenesStr = '<ul data-flag="scenes">'+scenesStr+'</ul>'
				}
				
			} else {
				
				for(var i=0; i<2; i++) {
					scenesStr += '<li><span>气象信息'+(i+1)+':</span><span>--</span></li>'
				}
				
				scenesStr = '<ul>'+scenesStr+'</ul>'
			}
			return scenesStr
	}
	/**
	 * 生成进时气象信息
	 * @param {Object} data
	 */
	function createPrescenes (data) {
		var prescenesStr = ''
		if(data) {
			if(data.length >= 2) {
				data.forEach(function (item, index) {
					prescenesStr += '<li class="real_info"><span>进时信息'+(index+1)+':</span><span>'+(item && item.replace(/\（|\）/g,' ') || "--")+'</span></li>'
				})
				prescenesStr = '<ul data-flag="prescenes">'+prescenesStr+'</ul>'
			} else {
				prescenesStr += '<li class="real_info"><span>进时信息1:</span><span>'+(data[0] && data[0].replace(/\（|\）/g,' ') || "--")+'</span></li>'
				prescenesStr += '<li><span>进时信息2:</span><span>--</span></li>'
				prescenesStr = '<ul data-flag="prescenes">'+prescenesStr+'</ul>'
			}
		} else {
			
			for(var i=0; i<2; i++) {
				
				prescenesStr += '<li><span>进时信息'+(i+1)+':</span><span>--</span></li>'
			}
				
			prescenesStr = '<ul>'+prescenesStr+'</ul>'
		}
		return prescenesStr
	}
	/**
	 * 生成云量和跑道信息
	 * @param {Object} data
	 */
	function createCloudStr (data, tpl) {
		var str = ''
		if(data) {
			if(data.length >= 2) {
				
				data.forEach(function (item) {
					item.realData = 'real_info'
					str = str + formateString(tpl, item)
				})
				
			} else {
				data[0].realData = 'real_info'
				str = str + formateString(tpl, data[0])
				str = str + formateString(tpl, [])
				
			}
		} else {
			
			str = str + formateString(tpl, [])
			str = str + formateString(tpl, [])
			
		}
		return str
	}
	
	return {
		
		create: function (getData, $parent) {
			// 云量	clouds
			var cloudsStr = createCloudStr(getData.clouds, cloudsTpl)
			
			// 跑道信息 runways
			
			var runwaysStr = createCloudStr(getData.runways, runwaysTpl)
			
			// 气象跑道信息
			var cloudRunwayStr = '<section class="cloud_runway">'+cloudsStr + runwaysStr+'</section>'
			
			// <!--气象信息	进时气象 scenes prescenes-->
			var scenesStr = createScenes(getData.scenes)
			
			var prescenesStr = createPrescenes(getData.prescenes)
			
			var weatherInfo = '<section class="scenes_prescenes">'+ scenesStr + prescenesStr +'</section>'
			
			// 上部的基本信息
			
			// 趋势信息
			var trendsStr = ''
			
			if(getData.trends) {
				getData.trends.forEach(function (item, index) {
				//moniTrendInfo.forEach(function (item, index) {
					trendsStr += formateString(trendsTpl, item)
					// 趋势的气象信息
					var trendSceneStr = createScenes(item.scenes)
					// 趋势的进时气象信息
					var trendPresceneStr = createPrescenes(item.prescenes)
					
					trendsStr += trendSceneStr + trendPresceneStr
					
				})
				trendsStr = '<section class="weather_trend real_info">'+trendsStr+'</section>'
			} else {
				
				trendsStr += formateString(trendsTpl, {trendChangeTime: 'trendChangeTime'})
				// 趋势的气象信息
				var trendSceneStr = createScenes([])
					// 趋势的进时气象信息
				var trendPresceneStr = createPrescenes([])
					
				trendsStr += trendSceneStr + trendPresceneStr
				trendsStr = '<section class="weather_trend">'+trendsStr+'</section>'
			}
			
			

			

			
			// 天气图片信息
			var imgInfo = ''
			if(getData.scenes) {
				
				var imgStr = getData.scenes.join('')
				
				imgStr = imgStr.replace(/\（|\）/g,' ')		// 将括号去掉
				
				var realStr = []
				imgStr.split(' ').forEach(function (item) {
					if(item) {
						realStr.push(item)
					}
				})
				
				// 天气图片的描述
				var imgDesc = ''
				realStr.forEach(function (item, index) {
					
					if(index === 0) {
						// 程度描述
						imgDesc = imgDesc + '<span style="margin-right: 10px; color: #999;">'+item+'</span>'
					} else {
						imgDesc = imgDesc + '<span style="margin-right: 10px;">'+item+'</span>'
						
					}

				})
				
				imgInfo = '<section class="weather_img_wrap"><div class="weather_img"><img src='+manageWeatherPic(imgStr, true)+'><div style="margin-top: 8px; text-align: center;">'+imgDesc+'</div></div></section>'
				
			} else {
				imgInfo = '<section class="weather_img_wrap"><div class="weather_img"><img src="./images/default_big.png"></div></section>'
			}
			
			var str = '<div class="clearfix base_weather">'+formateString(baseTpl, getData)+ imgInfo + '</div>' + "<div class='clearfix other_weather_info'>"+cloudRunwayStr+weatherInfo+trendsStr+"</div>"
			
			this.$parent = $parent
			
			$parent.html(str)
			return this
		},
		appendParent: function ($carousel) {
			
			// 生成内容 添加到dom中
			$carousel.append(this.$parent)
			$(".cloud_runway").niceScroll({
				cursorcolor: "#999",
				cursorwidth: '5px',
				railpadding: { top: 0, right: 2, left: 0, bottom: 0},
				railoffset: true
			})	
			
			$(".scenes_prescenes").niceScroll({
				cursorcolor: "#999",
				cursorwidth: '5px',
				railpadding: { top: 0, right: 2, left: 0, bottom: 0},
				railoffset: true
			})	
			
			//weather_trend
			$(".weather_trend").niceScroll({
				cursorcolor: "#999",
				cursorwidth: '5px',
				railpadding: { top: 0, right: 2, left: 0, bottom: 0},
				railoffset: true
			})	
		}
	}
})()

/**
 * 模板字符		
 * @param {Object} str	需要替換的字符
 * @param {Object} data		請求來的數據
 */
function formateString (str, data) {
	
	str = str.replace(/\{#(\w+)#\}/g, function(match, key) {
		
		if(data) {
			if(data[key]) {
				if(data[key] === 'trendChangeTime') {	// 趋势时间描述
					return ''
				} else {
					return data[key]
				}
			} else {
				return '--'
			}
			
		} else {
			
			return '--'
			
		}
		
	})
	
	return str
}

// 处理天气对应的图片地址
/**
 * 
 * @param {Object} str	天气信息
 * @param {Object} isBig	是否显示大图
 */
function manageWeatherPic (str, isBig) {
	/*天气情况*/
	/*1.晴
	 * 2.雨 毛毛雨
	 * 3.雪 米雪
	 * 4.冰晶 冰雹 冰粒 小冰雹
	 * 5.雾 轻雾 烟
	 * 6.沙 霾 火山灰 沙暴 浮尘
	 * 7.
	 * 8.
	 * 9.飑 漏斗云 尘/沙旋风
	 */
	var condition = [
		['晴'],
		['雨', '毛毛雨'],
		['雪', '米雪'],
		['冰晶', '冰雹', '冰粒', '小冰雹'],
		['雾', '轻雾', '烟'],
		['沙', '霾', '火山灰', '沙暴', '浮尘'],
		['雷暴'],
		['雷暴&雨'],
		['飑', '漏斗云', '尘/沙旋风']
	]
	
	var imgUrlArr = ['./images/fine_big.png', './images/rain_big.png', './images/snow_big.png', './images/hail_big.png', './images/fog_big.png', './images/haze_big.png', './images/thunderstorm_big.png', './images/thunderstormRain_big.png', './images/squall_big.png']
	var smallImgUrlArr = ['./images/fine_small.png', './images/rain_small.png', './images/snow_small.png', './images/hail_small.png', './images/fog_small.png', './images/haze_small.png', './images/thunderstorm_small.png', './images/thunderstormRain_small.png', './images/squall_small.png']
	var imgStr = ''
	var imgIndex = 0
	condition.forEach(function (item, index) {
		
		item.forEach(function (weatherCondition) {
			
			if(str.indexOf('雨') >= 0) {
				if(str.indexOf('雷暴') >= 0) {
					imgIndex = 7 
					return
				} else {
					imgIndex = 1
					return
				}
				
			}else if(str.indexOf(weatherCondition) >= 0) {
				imgIndex = index
				return
			}
		})
		
	})
	if(isBig) {
		
		return imgUrlArr[imgIndex]
		
	} else {
		return smallImgUrlArr[imgIndex]
	}
}
