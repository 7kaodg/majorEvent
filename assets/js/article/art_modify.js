$(function() {
    const layer = layui.layer;
    const form = layui.form;
    const id = localStorage.getItem('Id');
    initCate();
    initEditor();
    renderInfo();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                const htmlStr = template('tpl-cate', res);
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

    //为 选择封面 按钮绑定点击事件
    $('#chooseImage').on('click', function() {
        $('#conceal').click();
    })

    // 监听 conceal 的 change 事件，获取用户选择的文件列表
    $('#conceal').on('change', function(e) {
        const files = e.target.files;
        if (files.length === 0) {
            return;
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0]);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    //填充默认表单值
    function renderInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // form.val('formInfo', res.data);
                $('[name=title]').val(res.data.title);
                $('[name=cate_id]').val(res.data.cate_id);
                tinymce.get('contents').setContent(res.data.content);
                const newImgURL = 'http://www.liulongbin.top:3007' + res.data.cover_img;
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', newImgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
                form.render(); //刷新选择框
            }
        });
    }
    // 定义文章发布状态
    let art_state = '已发布';
    $('#btnSaveCraft').click(function() {
        art_state = '草稿';
    });

    //为 表单 绑定提交事件 更新修改后的数据
    $('#form-update').on('submit', function(e) {
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
                fd.append('Id', id);
                updateArticle(fd);
            });
    });

    //更新文章数据
    function updateArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
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