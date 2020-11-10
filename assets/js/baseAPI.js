//每次调用$.get()或$.post()或$.ajax()的时候会先调用ajaxPrefilter函数
//在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
  
    // 统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
      options.headers = {
        Authorization: localStorage.getItem('token') || ''
      }
    }
    
    //全局统一挂载complete回调函数
    options.complete=function(){
        //在complete回调函数中可以使用res.response.JSON 拿到服务器响应回来的数据
        if(res.responseJSON.status===1&&res.responseJSON.message==='身份验证失败!'){
            //1.强制清空token
            localStorage.removeItem('token')
           //  2.强制跳转到登录页面
           location.href='/login.html'
        }
    }
})
 