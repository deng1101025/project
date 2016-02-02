$(function() {
	createConnection('History');
	bindNextWeekClickEvent();
});

function createConnection(tableName) {
	var obj = {
		'tableName': tableName,
		'method': 'GET',
		'callback': searchData
	};
	myAjax(obj);
}

function searchData(data) {
	if(data) {
		if(data.length == 0) { //创建一个安排
			var members = getMemberList();
			var objAdd = {
				'tableName': data.tableName,
				'method': 'POST',
				'data': {"nameList": members},
				'callback': function(items) {
					createNowWeekArrage(items.nameList.split(','));
				}
			};
			myAjax(objAdd);
		} else if(data.length == 1) { //只有一个安排
			var memberList = data[0].nameList.split(',');
			createNowWeekArrage(memberList);
		} else { //有两个以上的安排
			initArrange(data);
		}
		
	}
}


//初始化日期安排
function initArrange(data) {
	var memberList1 = data[data.length - 2].nameList.split(',');
	var memberList2 = data[data.length - 1].nameList.split(',');
	
	if(!judgeIsLaterWednesday()) {
		createNowWeekArrage(memberList2);
	} else {
		createNowWeekArrage(memberList1);
		createNextWeekArrage(memberList2);
	}
}

function bindNextWeekClickEvent() {
	$('.wrap').off('click', '#btn_searchNextArrage').on('click', '#btn_searchNextArrage', function() {
		if(judgeIsLaterWednesday()) {
			$('#nextContent').removeClass('none');
		} else {
			alert('周三之后才会生成新的日期安排');
		}
	});
}

//生成一周的安排
function createWeekArrage(witchWeek, memberList) {
	var weekDays = getWeekDays();
	var appendStr = "<a href='javascript:;' class='list-group-item active item'><span class='itemLeft'>日期</span><span class='itemRight'>姓名</span></a>";
	for(var i = 0; i < memberList.length; i++) {
		appendStr += "<a href='javascript:;' class='list-group-item item'><span class='itemLeft'>" + weekDays[i] + "</span><span class='itemRight'>" + memberList[i] + "</span></a>";
	}
	if(witchWeek == '0') {
		$('#content ul').append(appendStr);
	} else {
		$('#nextContent ul').append(appendStr);
	}
	
}

//生成本周安排
function createNowWeekArrage(memberList) {
	createWeekArrage("0", memberList);
}

//生成下周安排
function createNextWeekArrage(memberList) {
	createWeekArrage("1", memberList);
}

//判断今天是否是本周的周三之后的日期（包括周三）
function judgeIsLaterWednesday() {
	var nowTime = new Date();
	var week = nowTime.getDay();
	if (week == 0) {  
        day = "星期日";  
	} else if (week == 1) {  
        day = "星期一";  
	} else if (week == 2) {  
        day = "星期二";  
	} else if (week == 3) {  
        day = "星期三";  
	} else if (week == 4) {  
        day = "星期四";  
	} else if (week == 5) {  
        day = "星期五";  
	} else if (week == 6) {  
        day = "星期六";  
	}  
	if(week >= 3) {  //如果是周三之后的返回true
		return true
	} else {
		return false;  //如果不是周三之后的返回false
	}
}

//获取随机排序的成员列表
function getMemberList() {
	var memberList = ["贺成璋", "杨迪", "康兵奎", "齐继超", "蒋蓝宇", "王涛亮", "邓占伟"];
	memberList = sortArray(memberList);
	return memberList;
}

function sortArray(inputArray) {
	var returnArray = inputArray.sort(function(){
		return Math.random() > 0.5 ? -1 : 1;
	});
	return returnArray;
}

function getWeekDays() {
	return ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"];
}

//function create

function myAjax(obj) {
	var now = Date.now();
	var appKey = $.sha1("A6909866626214"+"UZ"+"127003AF-95C4-E61F-E0A6-9A81858B799C"+"UZ"+now)+"."+now;
	$.ajax({
	    "url": "https://d.apicloud.com/mcm/api/" + obj.tableName,
	    "method": obj.method || "GET",
	    "cache": false,
	    "headers": {
		    "X-APICloud-AppId": "A6909866626214",
		    "X-APICloud-AppKey": appKey
	    },
	    "data": obj.data
	}).success(function (data, status, header) {
		console.log(data);
		data.tableName = obj.tableName;
		if(obj.callback) {
			obj.callback(data);
		}
	}).fail(function (header, status, errorThrown) {
        console.log('fail');
	});
}

