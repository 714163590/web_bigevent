$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage


    //定义美化事件过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = dt.padZero(getMonth() + 1)
        var d = dt.padZero(getDate())
        var hh = dt.padZero(getHours())
        var mm = dt.padZero(getMinutes())
        var ss = dt.padZero(getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的数据对象，将来请求参数的时候需要将请求参数对象传给服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页方法
                renderPage(res.total);
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                //调用模板引擎渲染分类
                var htmlstr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlstr);
                //通过layui重新渲染表单区域的ui结构
                form.render();
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //为查询参数对象q中对应属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的筛选条件重新渲染表格数据
        initTable()
    })
    //定义渲染分页的方法
    function renderPage(total) {
        //调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',//分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候，触发的jump回调
            //触发jump回调方式有两种
            //1.点击页码时候会触发
            //2.调用laypage.render方法就会触发jump回调
            jump: function (obj, first) {
                //可以通过first的值判断通过那种方式触发的jump回调函数
                //如果first的值为true，则证明是方式二触发
                //否知则是方式一
                //把最新的页码值复制到q这个查询参数对象中
                q.pagenum = obj.curr
                //把最新的条目数赋值到q这个查询参数对象的pagesize 属性中
                q.pagesize = obj.limit
                //根据最新的q获取对应的数据列表并渲染表格
                if (!first) {
                    initTable();
                }
            }
        })
    }

    //通过代理的方法为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        //询问用户是否删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/:id' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功！')
                    //当数据删除完成后，需判断当前这一页中，是否还有剩余的数据
                    //如果没有则页码值-1之后
                    //再重新调用initTable方法
                    if (len === 1) {
                        //如果len的值等于1，证明删除完毕后页面上就没有任何数据了
                        //页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        })
    })
})