$(function() {
    // 点击“去注册账号按钮”
    $('#link_reg').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        // 点击“去注册登录按钮”
    $('#link_login').on('click', function() {
            $('.login-box').show();
            $('.reg-box').hide();
        })
        //从layui中获取form对象
    let form = layui.form;
    let layer = layui.layer;
    //通过form.verify函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            //通过形参按拿到的是确认密码框中的内容
            //还需要拿到密码框中的内容
            //判断

            let pwd = $('.reg-box [name = password]').val()
            if (pwd !== value)
                return '两次密码不一致！'
        }
    })

    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        let data = { username: $('.reg-box [name=username]').val(), password: $('.reg-box [name=password]').val() };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }

            layer.msg('注册成功！');
            $('#link_login').click();
        })
    })

    $('#form_login').submit(function(e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                localStorage.setItem('token', res.token);
                //跳转到后台主页
                location.href = '/index.html';
            }
        })
    })
})