
function NavBar(params){
    this.title = params.title;
    this.iconName = params.iconName;
    this.navID = params.navID;
    this.checkbox = params.checkbox;
    this.barName = params.barName;
    this.topbarID = params.topbarID;
    this.checktop = params.checktop;
    this.initVeiw()
}
$.extend(NavBar.prototype,{
    init(){
    },
    initVeiw(){
        var navHtml="";
        for(var i = 0;i<this.title.length ; i++){
            navHtml +=`
            <div class="nav-icon-wrapper">
                <span class="nav-icons fa fa-${this.iconName[i].name}"></span>
                <span class="nav-text">${this.title[i].name}</span>
            </div>`
        }
        $("#" + this.navID).html(navHtml);
        $("#" + this.navID).children().eq(0).addClass("current");
        $("#" + this.navID).children().on("click",this.checkbox)
    },
    initTopbar(){
        var topBarHtml = '';
        this.barName.map(function(item){
            return  topBarHtml =` <div class="topbar-bg">
                <div class="switch-hot">
                <div class="hot-item " >${item.name}</div>
                <div class="hot-item ">即将上映</div>
                </div>
                <div class="search-entry search-icon fa fa-search">
            </div>
            </div>`
        }).join("");
        $("#"+this.topbarID).html(topBarHtml)
        $("#" + this.topbarID).find(".hot-item").eq(0).addClass("active");
        $("#" + this.topbarID).find(".hot-item").on("click",this.checktop)

    }
})
