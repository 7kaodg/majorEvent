$(function() {
    getUserinfo();
    layer = layui.layer;
    $('#btnLogout').on('click', function() {
        layer.confirm('Are you sure to log out?', { icon: 3, title: 'Tips' }, function(index) {
            //do something
            //清空本地存储的token
            localStorage.removeItem('token');
            // 跳转到登录页面
            location.href = '/login.html';
            layer.close(index);
        });
    })
})

function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！');
            }
            renderAvatar(res.data);
        },


    })
}

function renderAvatar(user) {
    // 1.获取用户名称
    let name = user.nickname || user.username;
    // 2.设置欢迎文本

    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        $('.text-avatar').html(name[0].toUpperCase()).show();
    }
}