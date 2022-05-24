$(function() {
    const layer = layui.layer;
    const form = layui.form;
    var laypage = layui.laypage;
    //定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = parseZero(dt.getMonth() + 1);
        let d = parseZero(dt.getDate());

        let hh = parseZero(dt.getHours());
        let mm = parseZero(dt.getMinutes());
        let ss = parseZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    function parseZero(n) {
        // if (n > 9) {
        //     return n;
        // } else {
        //     return n = n + '0';
        // }
        return n > 9 ? n : '0' + n;
    }

    //定义一个查询的参数对象
    let q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }

    initTable();
    initCate();
    //初始化文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        });
    }

    //初始化文章分类 渲染下拉框
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-cate', res);
                $('select[name=cate_id]').html(htmlStr);
                form.render();
            }
        });
    }
    //筛选的方法
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        initTable();
    });

    //渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //切换分页的回调 
            //1.点击页码 就会调用jump 此时first=undefined
            //2.只要出发 laypage.render()就会调用jump 此时first=true
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    }
    //通过代理 为删除按钮 绑定事件
    $('tbody').on('click', '#btn-delete', function() {
        let pagenum = $(this).length;
        let id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);

                    // 判断当前的页面数据是否有剩余
                    if (pagenum === 1) {
                        // 判断页码值是否小于1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });

            layer.close(index);
        });
    });

    $('tbody').on('click', '#btn-edit', function() {
        localStorage.setItem('Id', $(this).attr('data-id'));
        location.href = '/article/art_modify.html';
    });
});