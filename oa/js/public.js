let COMPETITIONPATH = '/Competition/';
let ACCOUNTPATH = '/Competition/';
let SUCCESSCODE = 200;
let SEARCH = location.search;
let fileList={};
let loFlag = true;
let ahs= "";
$(function(){
    //加载结构
    loadCons();
    loadReady();
});
function successAuthLogout(data) {
    console.log(data);
}
/**
 * 加载结构，头部，底部，menu
 */
function loadCons(){
    $('#header').load('header.html');
    $('#leftBox').load("menu.html");
    $('.contentWrap').css('minHeight',$(window).height()-100);
    $('#menu').load("menu.html");
    if(sessionStorage.getItem('userName')){
        var userName = sessionStorage.getItem('userName');
        userName = userName.toUpperCase();
        var userStr = '<div class="user"><span class="uName" id="loginOut">退出</span><span class="uImg" id="user">'+userName+'</span></div>';
        $('#menuContainer').append(userStr);
        $('#loginOut').click(function () {
            mAjax('../login/authLogout.do','',function (data) {
                if (data.code == 200){
                    sessionStorage.clear();
                    window.location.href = '../login.jsp';
                }
            })
        });
        $('#user').on('click',function () {
            console.log(loFlag);
            if(!loFlag){
                $(this).parent().css('left',-60);
                loFlag = true;
                return
            }
            $(this).parent().css('left',0);
            loFlag = false;
        });
    }

    // $(document).click(function () {
    //     $('#user').parent().css('left','-60');
    // })
}

/**
 * 信息更新 select更改默认值方法
 **/
function changeSelectValue(selectId,value){
    layui.use('form', function(){
        var form = layui.form();
        var valDom = $('#'+selectId).siblings('div.layui-form-select').children('dl.layui-anim').children('dd');
        if(valDom.length == 0 && $(valDom).attr('lay-value') == value){
            $(valDom).addClass('layui-this').click();
        }
        for (var i=0;i<=valDom.length;i++){
            if($(valDom[i]).attr('lay-value') == value){
                $(valDom[i]).addClass('layui-this').siblings().removeClass('layui-this');
                $(valDom[i]).click();
                return;
            }
        }
        form.render('select');
    });
}
//获得select选中的值
function getSelect(selectId) {
    var val = $('#'+selectId).siblings('div.layui-form-select').children('dl.layui-anim').children('dd.layui-this').attr('lay-value');
    return val;
}
/**
 * 信息更新 radio更改默认值方法
 **/
function changeRadioValue(radioId,value){
    $('input[name='+radioId+']').siblings('div').each(function () {
        if($(this).prev(':first').val() == value){
            $(this).addClass('layui-form-radioed');
            $(this).click();
        }else{
            $(this).removeClass('layui-form-radioed')
        }
    })
}
//获得select选中的值
function getRadio(radioId) {
    var val = $('#'+radioId+' div').children('div.layui-form-radioed').prev('input[name='+radioId+']').val();
    return val;
}
/**
 * 获取用户
 * @type {Array}
 */
function getUser(){
    mAjax('../user/getCurrentUser.do','',successGetUser);
}
function successGetUser(data){
    if(data.code == 200){
        var user = data.content.user;
        if(user == null){
            location.href = '../'
        }
        $('#uname').text(user.uname);
        $('#exit').click(function(){
            mAjax('../login/authLogout.do','',successGetOut);
        });
    }
}

/**
 * 初始化文件上传插件
 * params 数组对象 [{ele，url}]
 * 例如：var params = [
 {ele:'indexBanner',url:' ../activity/upload.do'},
 {ele:'messageBanner',url:' ../activity/upload.do'}
 ];
 */
function hsUpload(params){
    //遍历params 初始化 上传控件
    for(var i=0;i<params.length;i++){
        var item = params[i];
        // console.log("item:"+JSON.stringify(item));
        var btnObj = '#'+item.ele; //点击按钮
        //动态添加input节点 插入到点击按钮前
        var inputObj = item.id+'_Input'; //input
        var inputHid = item.id; //input
        var inputHtml =  '<input type="file" style="display: none" id="'+inputObj+'"/>';
        var inputHidden =  '<input type="hidden"  id="'+inputHid+'"/>';
        $(inputHtml).insertBefore(btnObj);
        if(item.needCreate){
            $(inputHidden).insertAfter(btnObj);
        }
        //初始化input标签
        $('#'+inputObj).fileupload({
            url: item.url
            //,dataType: 'json'4
            ,autoUpload: true
            ,done: function (e, data) {
                if(data.result.code == 200){
                    $(this).siblings('.uploadradioContainer').css('opacity','1');
                    console.log(data.result.content);
                    fileList[e.target] = data.result.content;
                    var id = $(this).attr('id');
                    var mId = id.split('_')[0];
                    $('#'+mId).val(data.result.content.url);
                }
            }
            ,fail: function () {
                console.log('fail upLoad!')
            }
        });
        //点击button按钮时 触发input[type=file]
        $(btnObj).on('click',function (ev) {
            ev.stopPropagation();
            $(this).prev().click();
        });
    }
}


/**
 * 设置menu选中
 */
function setMenuSelected(){
    var href = location.href.split('?')[0].split('/');
    var menuClass = href[href.length-1].split('.')[0].split('_')[0];
    $('.'+menuClass).removeClass('hide');
    $('.'+menuClass).parent().addClass('menu-selected');
}
/**
 * init layui 组件
 * params:[{开始dom，结束dom,format:}，{时间dom}]
 */
function initDate(params) {
    layui.use('laydate',function () {
        var laydate = layui.laydate;
        for(var i=0;i< params.length;i++){
            var item = params[i];
            if (item.length == 1){
                initSingleDate(item[0]);
            }
            if (item.length == 2){
                initCoupleDate(item[0],item[1]);
            }
        }
    })
}
function initSingleDate(dom) {
    var start = {
        max: '2099-06-16'
        ,format: 'YYYY-MM-DD' //日期格式
        ,isclear: true
        ,choose: function(datas){
            console.log(dom+'=='+datas)
        }
    };
    document.getElementById(dom).onclick = function(){
        start.elem = this;
        laydate(start);
    }
}
function initCoupleDate(dom1,dom2) {
    var start = {
        max: '2099-06-16'
        ,format: 'YYYY-MM-DD' //日期格式
        ,istoday: false
        ,choose: function(datas){
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas //将结束日的初始值设定为开始日
        }
    };
    var end = {
        max: '2099-06-16'
        ,format: 'YYYY-MM-DD' //日期格式
        ,istoday: false
        ,choose: function(datas){
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };

    document.getElementById(dom1).onclick = function(){
        start.elem = this;
        laydate(start);
    };
    document.getElementById(dom2).onclick = function(){
        end.elem = this;
        laydate(end);
    }
}
function changeTime(startTime,endTime) {
    var timeStr1 = "23:59:59",
        timeStr2 = "00:00:00",
        obj = {};
    //当开始时间为空时 且 结束时间不为空 这样为错误操作 提示并返回false
    if(startTime == '' && endTime !=''){
        return false;
    }
    //当开始时间 结束时间为空
    if(startTime == '' && endTime ==''){
        obj = {
            'endTime':'',
            'startTime':''
        };
        return obj;
    }
    //当开始时间不为空时候 结束时间为空时 将结束时间设置为 今天+1
    if(startTime != '' && endTime == ''){
        endTime = startTime.split('-');
        endTime[2] = parseInt(endTime[2])+1;
        if (endTime[2] >= 0 && endTime[2] <= 9) {
            endTime[2] = "0" + endTime[2];
        }
        endTime = endTime.join('-')+ " " +timeStr1;
        startTime = startTime+ " " +timeStr2;
        obj = {
            'endTime':endTime,
            'startTime':startTime
        };
        return obj;
    }
    //当开始时间不为空时候 结束时间不为空时 开始时间等于结束时间 将结束时间 +1
    if(startTime != '' && endTime != ''){
        endTime = endTime+ " " +timeStr1;
        startTime = startTime+ " " +timeStr2;
        obj = {
            'endTime':endTime,
            'startTime':startTime
        };
        return obj;
    }
}

/**
 * 封装ajax
 */
function mAjax(url,param,method){
    $.ajax({
        type:"GET",
        dataType:"json",
        url:url,
        data:param,
        success:method,
        xhrFields:{
            withCredentials:  true
        },
        error:function(error){
            console.log(error);
        }
    });
}
function postAjax(url,param,method){
    $.ajax({
        type:"POST",
        dataType:"json",
        url:url,
        data:param,
        success:method,
        xhrFields:{
            withCredentials:  true
        },
        error:function(error){
            console.log(JSON.stringify(error));
        }
    });
}


function formAjax(url,param,method){
    $.ajax({
        type:"POST",
        dataType:"json",
        url:url,
        data:param,
        success:method,
        processData: false,
        contentType: false,
        error:function(error){
            console.log(JSON.stringify(error));
        }
    });
}
/**
 * 校验输入框
 * @param id
 * @param msg
 * @returns {boolean}
 */
function checkInput(id,msg){
    if($('#'+id).val().length < 1){
        $('#'+id).focus();
        skyNoty(msg);
        return false;
    }
    return true;
}
/**
 * 校验变量 不为空 undefine null
 */
function checkValue(val,msg){
    if(!val){
        skyNoty(msg);
        return false;
    }
    return true;
}
//校验数字
function isNumber(text){
    var reg = new RegExp("^[0-9]*$");
    if(!reg.test(text)){
        return false;
    }
    return true;
}
//校验数字
function isMath(text){
    if(!isNaN(text)){
        return true;
    }
    return false;
}
//javascript 校验手机号
function isMobile(value){
    var pattern=/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if(!pattern.test(value)){
        return false;
    }
    return true;
}
//javascript 邮箱
function isEmail(value){
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!reg.test(value) ) {
        return false;
    }
    return true;
}
//提示
function skyNoty(msg){
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.msg(msg,{
            time: 1800 //1.8秒关闭（如果不配置，默认是3秒）
        });

    });
}
//loading 加载层
function loadingNoty(){
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.load(1, {
            shade: [0.1,'#fff'] //0.1透明度的白色背景
        });
    });
}
function closeLoading(){
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.closeAll('loading'); //关闭加载层
    });
}
/**
 * 解析时间
 * @param unixTime
 * @returns {*}
 */
function getTime(unixTime,type){
    if(unixTime == null){
        return '--';
    }
    if(unixTime.length > 10){
        unixTime = unixTime.substring(0,10);
    }
    var now = new Date(parseInt(unixTime));
    var year = now.getFullYear() + '-';
    var month = (now.getMonth()+1) + '-';
    if(now.getMonth() < 9){
        month = '0'+ (now.getMonth()+1) + '-';
    }
    var date = now.getDate()+' ';
    if(now.getDate() < 10){
        date = '0'+now.getDate()+' ';
    }
    var hours = now.getHours();
    if(hours < 10){
        hours = '0'+hours;
    }
    var mins = now.getMinutes();
    if(mins < 10){
        mins = '0'+mins;
    }
    var sec = now.getSeconds();
    if(sec < 10){
        sec = '0'+sec;
    }
    var time = '';
    if( type == 'date'){
        time = year+month+date;
        return time;
    }
    if(type =='time'){
        time = year+month+date+hours+':'+mins+':'+sec;
        return time;
    }

}



/**
 * 解析params
 **/
var urlParams = new Array();
var urlParamslength = 0;
//解析获取参数
function setParams(){
    var param = SEARCH;
    if(param != null && param.length > 0){
        param = param.substring(1,param.length);
        var allparam = param.split('&');
        if(allparam != null && allparam.length > 0){
            for(var i=0;i<allparam.length;i++){
                var oneparam = allparam[i].split('=');
                if(oneparam != null && oneparam.length > 1){
                    urlParams[oneparam[0]] = oneparam[1];
                    urlParamslength++;
                }
            }
        }
    }
}
//获取参数
function getParam(key){
    if(urlParamslength == 0) {
        setParams();
    }
    return urlParams[key];
}
