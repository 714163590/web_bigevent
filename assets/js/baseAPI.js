//每次调用$.get()或$.post()或$.ajax()的时候会先调用ajaxPrefilter函数
//在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options){
    console.log(options.url);
})