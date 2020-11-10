$(function(){
    //点击去注册账号的链接
    $('#link_reg').on('click',function(){
        $('.login-box').hide();
        $('.reg-box').show();
    })
    //点击去登陆的链接
    $('#link_login').on('click',function(){
        $('.login-box').show();
        $('.reg-box').hide();
    })
    //从layui中获取form对象
    var form = layui.form;
    var layer= layui.layer;
    //通过form.verify()函数自定义校验对象
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
         repass:function(value){
            //通过形参拿到的是确认密码框中的内容
            //还需要拿到密码框的内容
            //然后进行一次比较
            //如果判断失败则return一个提示消息即可
            var pass=$('.reg-box [name=password]').val() ;
            console.log(1);
            if(pass!==value){
                return '两次密码不一致！'
            }
         } 
    })
    //监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        e.//阻止默认事件
        //preventDefault()[dom标准写法(ie678不兼容)]
        //ie678用returnValue
        //或者利用return false也能阻止默认行为,没有兼容问题(只限传统注册方式)
        preventDefault()
        var data={username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()};
        $.post('http://ajax.frontend.itheima.net/api/reguser',data,function(res){
            if(res.status!==0){
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录');
            //模拟人的点击行为
            $('#link_login').click();
        })
    })
    //监听登录表单的提交事件
    $('#form_login').submit(function(e){
        e.preventDefault();
        $.ajax({
            url:'http://ajax.frontend.itheima.net/api/login',
            method:'POST',
            //快速获取表单中的数据
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('登陆失败')
                }
                layer.msg('登录成功')
                console.log(res.token);
                //将登录成功得到的token字符串保存到localStorage中
                localStorage.setItem('token',res.token)
                //跳转主页
                location.href='/index.html'
            }
        })
    })
})
    
