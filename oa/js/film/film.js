/**
 * Created by ZXL on 2017/4/10.
 * Changed by IDHorse on 2017/8/29
 */

//change val
let hsTable = null,
    form,
    url,
    optState,
    primaryid,
    firstEnter = true,
    isSupport = 'all',
    dateParams = [ ['updateReleaseTime']];  //初始化 时间laydate;
let params = {
    containerID : 'tableContainer',
    type:'opt',
    isFoot:true, //是否展示 搜索
    theadData : [
        {name : '电影名称',key : 'filmname'},
        {name : '主演',key : 'role'},
        {name : '描述',key : 'describe'},
        {name : '上映时间',key : 'releasetime'},
        {name : '评分',key : 'score'},
        {name : '图片',key : 'imgsrc'},
        {name : '状态',key : 'state'}
    ],
    tbodyData:getBodyData,  //
    optParam : [
        {name:'修改',callback:modifier},
        {name:'删除',callback:deleteData}
    ],
    filter:hsFilter,
    page:1,
    rows:1,
    primaryKey:'id'
};

function loadReady(){
    aaa()
    initDate(dateParams);
    //初始化 radio
    layui.use('form', function(){
        form = layui.form();
    });
    //初始化 hsTable
    hsTable = new HsTable(params);
    //绑定点击事件
    bindClick();
    //获取 table 数据
    hsTable.getData();
}



//  获取bodyData
function getBodyData() {
    mAjax('http://localhost:3000/oa/film/getFilmList',{
        page:hsTable.page,
        rows: 5   //获取数据一页多少
    },function (res) {
        hsTable.total = res.totalPage;
        hsTable.setData(res.data);
           
    })
}
function aaa(){
    mAjax("http://localhost:3000/oa/film/sign",{},function(res){
        // console.log(res)
        if(res.length == 0){
            window.location.href = "http://127.0.0.1:5500/1226/oa/login.html";
        }
    })
}
//数据过滤器
function hsFilter(key,item,index){
    var value;
    if (key == 'state'){
        let id = item['_id'];
        // console.log(id)
        switch (item.state)  // '1'
        {
            case '1':
                value=`<a href="#"  onclick="goDown('${id}')" data-id="${id}">正上线</a>`;
                break;
            case '0':
                value=`<a href="#"   onclick="goUp('${id}')" data-id="${id}">已下线</a>`;
                break;
        }
        return value;
    }
    if(key === 'imgsrc'){
        return `<img src="${item.imgsrc}">`
    }
    value = item[key];
    return value;
}

//删除
function deleteData(){
    var id = $(".hsTableBody").find("a").attr("data-id");
    console.log(id)
    mAjax('http://localhost:3000/oa/film/deleteFilm',{"_id":id},function(res){
        if(res.ok){
            hsTable.getData();
             console.log(res) 
        }
    })

}
//操作----修改
function modifier(detail) {
    console.log(detail);
    $('#tableContainer_hsTableBody').on('click','.tableContainerhsOpt',function(){
        let img=$(this).parent().parent().children().eq(5).children()
        params.imgsrc=img.attr('src')
    })
    //赋值
    $('#updateFilmName').val( detail.filmname);
    $('#updateRole').val(detail.role);
    $('#updateDescribe').val(detail.describe);
    $('#updateScore').val(detail.score);
    $('#updateReleaseTime').val(detail.releasetime);
    $("#showimg").attr("src",detail.imgsrc)

    url = 'http://localhost:3000/oa/film/updateFilm';
    optState = '修改';
    primaryid = detail['_id'];
    //弹出修改页
    layer.open({
        type: 1,
        closeBtn:2,
        resize:false,
        title:  ['电影管理', 'border-bottom:1px solid #333337;font-size:18px;background-color: #313236; color: #c0c0c1;'],
        area: ['500px', '600px'], //宽高
        content: $('#updateHtml')
    });
}
function goUp(id) {
   // let id = $(e).data('id');
    // console.log(id);
     // 给后端发送一个请求，告诉他 我当前的这条信息 需要上线 state = "1"
     mAjax("http://localhost:3000/oa/film/up",{"_id":id},function(res){
        console.log(res)
        if(res.ok){
            hsTable.getData()
        } 
    })
}
function goDown(id) {
   // let id = $(this).data('id');
    //console.log(id);
    // 给后端发送一个请求，告诉他 我当前的这条信息 需要上线 state = "1"
    mAjax("http://localhost:3000/oa/film/down",{"_id":id},function(res){
        console.log(res)
        if(res.ok){
            hsTable.getData()
        }  
    })
}

/**
 * 绑定事件
 */
function bindClick(){
    if(!$("#showimg").attr("src")){
        $("#showimg").attr("src",params.imgsrc)
        $("#updateBtn").click(function(){
            $(this).siblings("#updateImgsrc").click();
            var that = this;
            var reader = new FileReader;
            document.getElementById("updateImgsrc").onchange=function(){
                var file=this.files[0]   // 获取input上传的图片数据;
                reader.readAsDataURL(file);
                reader.onload = function(evt){
                    var data = evt.target.result;
                    $("#showimg").attr("src",data)
                }
           }
        })
    }
    //弹出框的  确认按钮
    $('#saveBtn').click(function () {
        if(!checkInput('updateFilmName','请输入电影名称')){
            return;
        }
        if(!checkInput('updateRole','请输入主演')){
            return;
        }
        if(!checkInput('updateRole','请输入评分')){
            return;
        }
        if(!checkInput('updateDescribe','请输入描述')){
            return;
        }
        if(!checkInput('updateReleaseTime','请输入上映时间')){
            return;
        }

        let filmname = $('#updateFilmName').val();
        let role = $('#updateRole').val();
        let describe = $('#updateDescribe').val();
        let score = $('#updateScore').val();
        let releasetime =  $('#updateReleaseTime').val();

        let formData = new FormData();
        formData.append('filmname',filmname)
        formData.append('role',role)
        formData.append('describe',describe)
        formData.append('score',score)
        formData.append('releasetime',releasetime);
        formData.append('imgsrc',document.getElementById('updateImgsrc').files[0] ? 
        document.getElementById('updateImgsrc').files[0] : params.imgsrc);
        // console.log(filmEntity);
        if(optState === '修改'){
            // filmEntity['_id'] = primaryid;
            formData.append('_id',primaryid)
        }
        // console.log(formData);
        formAjax(url,formData,function (res) {
            console.log(res);
            if(res.ok){
                layer.closeAll();
                hsTable.getData();
            }
        })
    });
    //点击添加 电影
    $('#addFilm').click(function () {
        //初始化 updateHtml 重新赋值为空
        $('#updateFilmName').val('');
        $('#updateRole').val('');
        $('#updateDescribe').val('');
        $('#updateScore').val('');
        $('#updateReleaseTime').val('');

        optState = '添加';
        url = 'http://localhost:3000/oa/film/addFilm';
        //调用 layui 弹出 updateHtml
        layer.open({
            type: 1,
            closeBtn:2,
            resize:false,
            title:  ['电影管理', 'border-bottom:1px solid #333337;font-size:18px;background-color: #313236; color: #c0c0c1;'],
            area: ['500px', '600px'], //宽高
            content: $('#updateHtml')
        });
        //确定 按钮点击事件 所需参数


    });
    //模糊查询
   $("#findFilm").click(function(){
    
    //    console.log(params.state)
       let search = $(".seek").val();
    //    console.log(search)
        mAjax("http://localhost:3000/oa/film/mohuFind",{name:search},function(res){
            function data(res){
                return res
            }
            let params2 = {
                containerID : 'tableContainer',
                type:'opt',
                isFoot:true, //是否展示 搜索
                theadData : [
                    {name : '电影名称',key : 'filmname'},{name : '主演',key : 'role'},
                    {name : '描述',key : 'describe'}, {name : '上映时间',key : 'releasetime'},
                    {name : '评分',key : 'score'},
                    {name : '图片',key : 'imgsrc'},
                    {name : '状态',key : 'state'}
                ],
                tbodyData:data,  //
                optParam : [
                    {name:'修改',callback:modifier},
                    {name:'删除',callback:deleteData}
                  
                ],
                filter:hsFilter,
                page:1,
                rows:5,
                primaryKey:'id'
            };
            let hsTable2 = new HsTable(params2)
            hsTable2.getData();
            hsTable2.setData(res.data)
            // this.initBody();
        })

   })



}




