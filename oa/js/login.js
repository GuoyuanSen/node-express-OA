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