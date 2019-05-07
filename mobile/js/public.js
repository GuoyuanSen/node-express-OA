let title,
iconName,
navID,
barName,
topbarID
let params = {
    title:[
        {name:"电影"},
        {name:"影院"},
        {name:"我的"}
    ],
    iconName:[
        {name:"film"},
        {name:"university"},
        {name:"user-circle-o"}
    ],
    navID:"nav-bar",
    checkbox:changeBar, //callback
    barName:[
        {name:"正在热映"},
        {name:"即将上映"}
    ],
    topbarID:"topbar",
    checktop:changeTop, //callback
}
//初始化页面
function readyView(){
    var navBar = new NavBar(params);
    navBar.initTopbar();
}
readyView();
//改变底部导航栏
function changeBar(){
    $(this).addClass("current").siblings().removeClass("current")
}
function changeTop(){
    $(this).addClass("active").siblings().removeClass("active")
}
//发起请求 get 方式
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
            console.log(JSON.stringify(error));
        }
    });
}
//发起请求 post方式
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
