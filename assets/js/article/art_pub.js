$(function() {
    const layer = layui.layer;
    const form = layui.form;
    initCate();
    initEditor();
    // 定义文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-search', res);
                $('[name=cate_id]').html(htmlStr);

                form.render();
            }
        });
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    // 为 选择封面 按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#concealFile').click();
    });
    // 监听 concealFile 的 change 事件，获取用户选择的文件列表
    $('#concealFile').on('change', function(e) {
        // 获取到文件的列表数组
        const files = e.target.files;
        // 判断用户选择的了文件
        if (files.length === 0) {
            return;
        }
        // 根据文件,创建对应的URL地址
        let newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    let art_state = '已发布';
    $('#btnSaveCraft').click(function() {
        art_state = '草稿';
    });
    // 为表单绑定 submit 事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        const fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        //将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);

                // fd.forEach(function(v, k) {
                //     console.log(v, k);
                // });
                publishArticle(fd);
            });
    });

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd, //注意：必须添加 contentType 和 processData 两个属性
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                location.href = '/article/art_list.html';
            }
        });
    }
});