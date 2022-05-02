//注意：每次调用$.get 或 $.post 或 $.ajax 的时候，
// 会先调用ajaxPrefilter 这个函数
// 在这个函数中，额可以拿到我们给Ajaxt提供的配置对象
$.ajaxPrefilter(function(option) {
    //在发起ajax请求前，拼接字符串
    option.url = 'http://www.liulongbin.top:3007' + option.url;
})