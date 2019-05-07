/**
 * Created by IDHorse on 2017/7/13.
 */
/**
 * Created by QZJ on 2017/2/19.
 */
/**
 * 表格对象
 */
// var params = {`
//     containerID : 'tableList',
//     bodyData:func
//     keyParam : [
//         {name : '活动名称',key : 'activityName'}
//     ],
//     optParam : {
//          keyID:'uid',
//          opt:[
//              {name:'修改',callback:func},
//          ]
//      },
//     //对应类型操作地址
//     optUrl : {
//         'opt0' : '../activity/getActivityList.do',/*查询*/
//         'opt1' : 'activity_update.html',/*查询*/
//         'opt2' : '../activity/deleteActivity.do'/*删除*/
//     },
//     primaryKey : 'activityid'
function HsTable(params){
    this.bodyData = null;
    //外部容器ID
    this.containerID = params.containerID;
    // console.log(this.containerID)
    this.type = params.type || 'normal';
    this.isFoot = params.isFoot;
    //头部数据
    this.theadData = params.theadData;
    //表格主体数据 获取方式
    this.tbodyData = params.tbodyData;
    this.optParam = params.optParam || null;
    //数据过滤方法
    this.filter = params.filter;
    //基础
    this.total = 0;
    this.totalPage = 0;
    this.primaryKey = params.primaryKey || null;
    this.page = params.page || 1;
    this.rows = params.rows || 10;
    this.requesting = false;
    this.initView();
}

HsTable.prototype = {
    //通过type 判断文本类型
    //optTable --- 带操作表  默认---展示表
    hsTemplate:function () {
        var type = this.type;
    },
    //内部ajax
    hsAjax:function(url,param,method){
        $.ajax({
            type:"POST",
            dataType:"json",
            url:url,
            data:param,
            success:method,
            error:function(error){
                console.log(JSON.stringify(error));
            }
        });
    },
    init(){
        this.initView();
    },
    getCorrectTime : function(unixTime){
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
        // var time = year+month+date+hours+':'+sec;
        var time = year+month+date;
        return time;

    },
    // 初始化主体结构
    initView : function(){
        document.getElementById(this.containerID).innerHTML = " ";
        var containerHTML = `<div class="hsTableContainer" id="${this.containerID}_hsTable">
                <ul class="hsTableHead">
                    <li class="clearfix" id="${this.containerID}_hsTableHead"></li>
                </ul>
                <ul class="hsTableBody" id="${this.containerID}_hsTableBody"></ul>
            </div>`;
        document.getElementById(this.containerID).innerHTML = containerHTML;
        var footHTML = `<div class="hsTableFoot">
                    <a class="hsPrev" id="${this.containerID}_hsPrev">上一页</a>
                    <div>第<input class="hsCurrentPage" id="${this.containerID}_hsCurrentPage"  value="1" >页</div>
                    <div>共<span class="hsTotalPage" id="${this.containerID}_hsTotalPage">-</span>页</div>
                    <a class="hsNext" id="${this.containerID}_hsNext">下一页</a>
                 </div>`;
        if(this.isFoot){

            $('#'+this.containerID+'_hsTable').append(footHTML);
            this.bindPageClick();
        }
        if(this.type == 'opt'){
            var obj = {name : '操作',key : 'opt'};
            this.theadData.push(obj);
        }
        this.initHead();
        this.requesting = false;
    },
    //初始化表头
    initHead:function () {
        var headerHtml = '';
        var len = this.theadData.length;
        for(var i=0;i<len;i++){
            headerHtml += '<div>'+this.theadData[i].name+'</div>';
        }
        document.getElementById(this.containerID+'_hsTableHead').innerHTML = headerHtml
    },
    //初始化表格内容
    initBody : function(){
        var len = this.bodyData.length;
        var keyLen = this.theadData.length;
        var item;
        var itemHtml = '';
        for(var i=0;i<len;i++){
            //维度  多少条
            item = this.bodyData[i];
            itemHtml += '<li>';
            var key = '';
            var value = '';
            for(var j=0;j<keyLen;j++){
                key = this.theadData[j].key;
                if(key == 'opt'){
                    value = '';
                    for(var hk=0;hk<this.optParam.length;hk++){
                        var obj = this.optParam[hk];
                        //console.log(hk);
                        value += `<a href="#" class="${this.containerID}hsOpt"  data-type="${hk}"   data-index="${i}">${obj.name}</a>`
                    }
                }else{
                    value = this.filter(key,item,i);
                }
                itemHtml += '<div>'+value+'</div>';
            }
            itemHtml += '</li>';
        }

        $('#'+this.containerID+'_hsTableBody').html(itemHtml);
        $('#'+this.containerID+'_hsCurrentPage').val(this.page);

        this.totalPage = Math.ceil(this.total/this.rows);
        $('#'+this.containerID+'_hsTotalPage').html(this.totalPage);
        this.bindOptClick();
    },
    setData:function (data) {
        this.bodyData = data;
        this.clearTable();
        this.initBody();
    },
    //绑定操作的方法
    bindOptClick:function () {
        var _that = this;
        //当每个 opt 点击时候  获取他的type 和 绑定
        $('.'+this.containerID+'hsOpt').click(function () {
            var type = $(this).data('type');
            // var id = $(this).data(_that.primaryKey);
            var id = $(this).data('index');
            console.log(id);  //
            _that.optParam[type].callback(_that.bodyData[id]);
        })
    },
    //通过 this.herf 中的 dataHref 获取bodyData
    getData:function () {
        //通过传入的方法  获取bodyData，
        this.tbodyData();
    },
    //重新绘制表格
    refreshTable : function(){
        this.init();
    },
    //清空表格
    clearTable : function(){
       $('#'+this.containerID+'_hsTableBody').html(' ');
    },
    //绑定点击事件
    bindPageClick : function(){
        var thisObj = this;
        $(document).on('keydown',function (e) {
            e = e || window.event;
            if(e.keyCode == 13){
                thisObj.page = $('#'+thisObj.containerID+'_hsCurrentPage').val();
                console.log(thisObj.page)
                thisObj.getData();
            }
        });
        $('#'+thisObj.containerID+'_hsPrev').click(function(){
            console.log('111');
            if(thisObj.requesting){
                return;
            }
            if(thisObj.page - 1 < 1){
                skyNoty("首页");
                return;
            }
            thisObj.page--;
            thisObj.getData();
        });
        $('#'+thisObj.containerID+'_hsNext').click(function(){
            console.log('222');
            if(thisObj.requesting){
                return;
            }
            if(thisObj.page+1 > thisObj.totalPage){
                skyNoty("尾页");
                return;
            }
            thisObj.page++;
            // console.log(thisObj.page)
            thisObj.getData();
        });

    }
};

