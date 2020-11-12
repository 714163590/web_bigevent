$(function(){
    var form=layui.form;
    var layer=layui.layer;
    form.verify({
        nickname:function(value){
            if(value.length>6){
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })
    initUserInfo();
    // 初始化用户基本信息
    function initUserInfo(){
        console.log(1);
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status==!0){
                    return layer.msg('获取用户信息失败')
                }
                //调用form.val()快速为表单赋值

                form.val('formUserInfo',res.data);
            }
        })
    }

    //重置表单的数据
    $('#btnReset').on('click',function(e){
        e.//阻止默认事件
        //preventDefault()[dom标准写法(ie678不兼容)]
        //ie678用returnValue
        //或者利用return false也能阻止默认行为,没有兼容问题(只限传统注册方式)
        preventDefault();
        initUserInfo();
    })

    //表单数据的提交
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功');
                //调用父页面中的方法，重新渲染用户头像和用户信息
                window.parent.getUserInfo();
            }
        })
    })
})