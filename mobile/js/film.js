
let page=1;
function getData(){
    mAjax("http://localhost:3000/mobile/film/getList",{'page':page},function(res){
        var html = '';
        res.map(function(item){
            return html +=`
            <div class="item">
            <div class="main-block">
                <div class="avatar">
                    <img src="${item.imgsrc}" alt="">
                </div>
                <div class="main-content">
                    <div class="detail-box">
                        <div class="detail-title">
                            <div class="title line-ellipsis">${item.filmname}</div>
                            <span class="version v3d"></span>
                        </div>
                        <div class="detail column">
                            <p  class="score">${item.score}</p>
                            <p class="actor line-ellipsis">${item.role}</p>
                            <p class="show-info line-ellipsis">${item.describe}</p>
                        </div>
                    </div>
                    <div class="button-block">
                        <span class="btn">购票</span>
                    </div>
                </div>
            </div>
        </div>
            `
        }).join("");
        $(".page-wrap").html($(".page-wrap").html()+html)
    })
}
getData();
let flag = false;
$(".page-wrap").scroll(function (evt) {
    if(flag) return;
    //文档高度
    let dHeight = document.documentElement.offsetHeight;
    //可见高度
    let bHeight = document.documentElement.clientHeight;
    //滚出高度
    let s = document.documentElement.scrollTop;
    if((s+bHeight+54)>= dHeight){
        console.log('到底了');
        flag = true;
        ++page;
        getData();
    }
})