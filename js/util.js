var serviceUrl = 'http://192.168.1.198:8081/aftn_server/';
//var serviceUrl = 'http://192.168.3.50:8085/aftn_server/';
var aftn_userId = "";//全局userid
var $YHGL = false;
var $QXGL = false;

// 每隔多少秒去请求一次数据
// 10s
var timeCell = 10000	// 报文	和 航班更新的时间
var weatherUTime = 1000*60 // 天气更新的时间		一分钟更新一次
//var serviceUrl = ''
/**
 * getPage 获取页面
 * @param {*} url 
 * @param {*} callback 
 * @param {*} jsonStr 
 */
function getPage(url, callback, jsonStr) {
    showLoading()
    $.ajax({
        url: url,
        type: 'post',
        data: jsonStr,
        contentType: "application/json",
        success: function(data) {
            callback(data)            
        },
        error: function() {
            hideLoading()
            console.error('请求失败')
        }
    })
}


var ismodalshow=false;
$("#myModal-loading").on("hidden.bs.modal",function(){ 
	ismodalshow = false;
});
 
 

function showLoading()
{
	//console.log('kkjj'+ismodalshow);
	if(!ismodalshow)
	{
		ismodalshow = true; 
		$('#myModal-loading').modal('show');
	}	
}
/**
 * 显示loading框
 */
//function showLoading() {
//  $('#myModal-loading').modal('show')
//}
/**
 * 隐藏loading框
 */
function hideLoading() {
	
    $('#myModal-loading').modal('hide')
    
}
/**
 * showMsg
 * @param {*} content 
 */
function showMsg(content) {
	
    $('#myModal-msg').modal('show')
        // 显示的内容
    $('#myModalLabel').html(content)
    
    $('#myModal-msg .btn').click(function () {
    	$('#myModal-msg').modal('hide')
    })
}

    /**
     * 发送ajax请求获取数据
     * @param {*} url 
     * @param {*} callback 
     * @param {*} param 
     */
function getJson(url, callback, param) {  
	if(param instanceof Object)
	{
		param = JSON.stringify(param);
	} 
	
	showLoading()
    $.ajax({
        url: serviceUrl + url,
        data: param.toString(),
        type: "post",
        success: function(dataJson) {
        	hideLoading();  
        	if(dataJson.c.errorCode=="001")
        	{
        		window.location.href = "login.html";
        	}
            callback(dataJson);
        },
        error: function() {
        	console.log('error')
            hideLoading();
        }
    });
}


function noLoadJson (url, callback, param) {
	if(param instanceof Object)
	{
		param = JSON.stringify(param);
	} 
    $.ajax({
        url: serviceUrl + url,
        data: param.toString(),
        type: "post",
        success: function(dataJson) {
            callback(dataJson);
        },
        error: function() {
        	console.log('error')
            hideLoading();
        }
    });
}


function parseParam(urlinfo) {
		var params = urlinfo.split("?")[1];
		if(params==undefined)
		{
			return "";
		}
		var dataJson = "{";
		var arrayParam = params.split("&");
		for (var i = 0; i < arrayParam.length; i++) {
			var str = arrayParam[i].split("=");
			var key = str[0];
			var value = str[1];
			dataJson += key + ":'" + value + "',"
		}
		dataJson += "a:1}"
		dataJson = eval("(" + dataJson + ")");
		return dataJson;
	}



//缓存封装
var TempCache = {
	cache:function(value){
	    window.localStorage.setItem("name",value);
	},
	getCache:function(){
	    return   window.localStorage.getItem("name");
	},
	setItem:function(key,value){
	     window.localStorage.setItem(key,value);
	}, 
	getItem:function(key){
	    return  window.localStorage.getItem(key);
	},
	removeItem:function(key){
	    return  window.localStorage.removeItem(key);
	}
};