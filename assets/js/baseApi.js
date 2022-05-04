//注意：每次调用$.get 或 $.post 或 $.ajax 的时候，
// 会先调用ajaxPrefilter 这个函数
// 在这个函数中，额可以拿到我们给Ajaxt提供的配置对象
$.ajaxPrefilter(function(option) {
    //在发起ajax请求前，拼接字符串
    option.url = 'http://www.liulongbin.top:3007' + option.url;
    if (option.url.indexOf('/my/') !== -1)
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
        // 全局统一挂载complete
    option.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            console.log(res);
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})