$(function(){
    var form=layui.form;
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
        samePwd:function(value){
            if(value===$('[name=oldPwd]').val())
            {
                return '新旧密码不能相同！'
            }
        },
        rePwd:function(value){
            if(value!==$('[name=newPwd]').val()){
                return '两次密码不一致'
            }
        }
    })
    $('.layui-form').on('submit',function(e){
        e.//阻止默认事件
        //preventDefault()[dom标准写法(ie678不兼容)]
        //ie678用returnValue
        //或者利用return false也能阻止默认行为,没有兼容问题(只限传统注册方式)
        preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')
                //重置表单(原生js的方法所以要转成原生)
                $('.layui-form')[0].reset();
            }
        })
    })
})