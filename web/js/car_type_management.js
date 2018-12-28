$(document).ready(function(){
    //初始化 Cropper 插件
    initCropperInModal($('#photo'),$('#photoInput'),$('#changeModal'));
    //初始化表格
    initTable();
    //初始化 Validator 插件
    validateModal();
    //设置搜索框的回车监听
    $('#search_text').keydown(function (e) {
        if (e.keyCode === 13) {
            $('#search_btn').click();
        }
    });
});

//添加汽车类型
function addCarType() {
    //启用 validator 插件
    $('#add_car_type_form').data('bootstrapValidator').validate();
    //如果有不符合 validator 插件限制条件的条目，则不能添加
    if(!$('#add_car_type_form').data('bootstrapValidator').isValid()){
        return;
    }
    //使添加前弹出的 modal 隐藏
    $('#add_modal').modal('hide');
    var car_name = $('#add_car_name').val();
    var car_brand = $('#add_car_brand').val();
    var daily_rent = $('#add_daily_rent').val();
    var car_deposit = $('#add_car_deposit').val();
    var car_type = $('#add_car_type').val();
    if(document.getElementById('user-photo').src === "") {
        alert('请输入图片');
        return;
    }
    var car_picture = getBase64Image(document.getElementById('user-photo'));
    var data = {
        "car_name": car_name,
        "car_brand": car_brand,
        "daily_rent": daily_rent,
        "car_deposit": car_deposit,
        "car_type": car_type,
        "car_picture": car_picture
    };
    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
    $.ajax({
        type: "post",
        url: "addCarTypeServlet",
        data: data,
        dataType: "text",
        async: false,
        success: function(data) {
            if(parseInt(data) !== 0) {
                alert("添加失败！");
                console.log(data);
            }
            else {
                alert("添加成功！");
                $('#car_type_info').bootstrapTable('refresh');
            }
        }
    });
    resetModal();
}

//查找函数，通过 Ajax 传递表的主键值在后台进行查找，后台再返回 JSON 形式的数据，然后在网页内由 bootstrapTable 加载
function searchCarType() {
    var car_name = $("#search_text").val();
    var data = {
        "car_name": car_name
    };
    $.ajax({
        type: "post",
        url: "searchCarTypeServlet",
        data: data,
        dataType: "json",
        success: function(json){
            $('#car_info').bootstrapTable('load', json);
        }
    });
    $('#search_text').val('');
}

//初始化 bootstrapTable
function initTable() {
    $('#car_type_info').bootstrapTable('destroy');
    $("#car_type_info").bootstrapTable({
        //使用 post 请求到服务器获取数据
        method: "post",
        //获取数据的 Servlet 地址
        url: "carTypeServlet",
        //表格显示条纹
        striped: true,
        //启动分页
        pagination: true,
        //每页显示的记录数
        pageSize: 20,
        //记录数可选列表
        pageList: [10, 15, 20, 25, 30],
        //是否启用查询
        search: false,
        //显示下拉框勾选要显示的列
        showColumns: true,
        //显示刷新按钮
        showRefresh: true,
        //设置是由客户端分页还是由服务端分页
        sidePagination: "client",
        columns: [{
            field: 'car_name',
            title: '车辆名称',
            sortable: true
        }, {
            field: 'car_brand',
            title: '品牌名称',
            type: 'text',
            editable: {
                title: '输入品牌名称',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '品牌名称不能为空';
                    }
                }
            }
        }, {
            field: 'daily_rent',
            title: '日租金',
            sortable: true,
            editable: {
                title: '输入日租金',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '日租金不能为空';
                    }
                    else if (parseFloat(v) < 0) {
                        return '日租金不能小于0';
                    }
                }
            }
        }, {
            field: 'car_deposit',
            title: '所需押金',
            sortable: true,
            editable: {
                title: '输入所需押金',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '所需押金不能为空';
                    }
                    else if (parseFloat(v) < 0) {
                        return '所需押金不能小于0';
                    }
                }
            }
        }, {
            field: 'car_type',
            title: '车类',
            editable: {
                title: '选择车类',
                type: 'select',
                source: [{
                    value: '经济型',
                    text: '经济型'
                }, {
                    value: '商务型',
                    text: '商务型'
                }, {
                    value: '豪华型',
                    text: '豪华型'
                }]
            }
        }, {
            field: 'car_picture',
            title: '车辆图片',
            sortable: true,
            align: 'center',
            formatter: function(value,row,index){
                if (value!=null)
                    return '<img  src="'+  value +'" class="img-rounded" >';
                else
                    return null;
            }

        },{
            field: 'button',
            title: '操作',
            events: operateEvents = {
                'click #delete_button': function (e, value, row) {
                    var data = {
                        "car_name": row.car_name
                    };
                    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
                    $.ajax({
                        type: "post",
                        url: "deleteCarTypeServlet",
                        data: data,
                        dataType: "text",
                        success: function(data) {
                            if(parseInt(data) !== 0) {
                                alert("删除失败！");
                                console.log(data);
                            }
                            else {
                                alert("删除成功！");
                                $('#car_type_info').bootstrapTable('refresh');
                            }
                        }
                    });
                }
            },
            formatter: function () {
                return ['<button id="delete_button" class="btn btn-default">删除</button>'].join('');
            }
        }],
        onEditableSave: function(field, row) {
            var data = {
                "car_name": row.car_name,
                "car_brand": row.car_brand,
                "daily_rent": row.daily_rent,
                "car_deposit": row.car_deposit,
                "car_type": row.car_type,
                "car_picture": row.car_picture
            };
            //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
            $.ajax({
                type: "post",
                url: "updateCarTypeServlet",
                data: data,
                dataType: "text",
                async: false,
                success: function(data) {
                    if(parseInt(data) !== 0) {
                        alert("更改失败！");
                        console.log(data);
                    }
                    else {
                        alert("更改成功！");
                        $('#car_type_info').bootstrapTable('refresh');
                    }
                }
            });
        }
    });
}

//在 Modal 中启用 Validator 插件
function validateModal() {
    $('#add_car_type_form').bootstrapValidator({
        feedbackIcons: {
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            car_name: {
                validators: {
                    notEmpty: {
                        message: '车辆名称不能为空'
                    }
                }
            },
            car_brand: {
                validators: {
                    notEmpty: {
                        message: '品牌名称不能为空'
                    }
                }
            },
            daily_rent: {
                validators: {
                    notEmpty: {
                        message: '日租金不能为空'
                    },
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '日租金必须为非负数'
                    }
                }
            },
            car_deposit: {
                validators: {
                    notEmpty: {
                        message: '所需押金不能为空'
                    },
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '所需押金必须为非负数'
                    }
                }
            },
            car_picture:{
                validators: {
                    notEmpty: {
                        message: '车辆图片不能为空'
                    }
                }
            }
        }
    });
}

function initCropperInModal(img, input, modal){
    var $image = img;
    var $inputImage = input;
    var $modal = modal;
    var options = {
        aspectRatio: 16/9, // 纵横比
        viewMode: 2,
        preview: '.img-preview' // 预览图的class名
    };
    //模态框隐藏后需要保存的数据对象
    var saveData = {};
    var URL = window.URL || window.webkitURL;
    var blobURL;
    $modal.on('show.bs.modal',function () {
        //如果打开模态框时没有选择文件就点击“打开图片”按钮
        if(!$inputImage.val()){
            $inputImage.click();
        }
    }).on('shown.bs.modal', function () {
        //重新创建
        $image.cropper( $.extend(options, {
            ready: function () {
                //当剪切界面就绪后，恢复数据
                if(saveData.canvasData){
                    $image.cropper('setCanvasData', saveData.canvasData);
                    $image.cropper('setCropBoxData', saveData.cropBoxData);
                }
            }
        }));
    }).on('hidden.bs.modal', function () {
        //保存相关数据
        saveData.cropBoxData = $image.cropper('getCropBoxData');
        saveData.canvasData = $image.cropper('getCanvasData');
        //销毁并将图片保存在 img 标签
        $image.cropper('destroy').attr('src',blobURL);
    });
    if (URL) {
        $inputImage.change(function() {
            var files = this.files;
            var file;
            if (!$image.data('cropper')) {
                return;
            }
            if (files && files.length) {
                file = files[0];
                if (/^image\/\w+$/.test(file.type)) {
                    if(blobURL) {
                        URL.revokeObjectURL(blobURL);
                    }
                    blobURL = URL.createObjectURL(file);

                    //重置 cropper，将图像替换
                    $image.cropper('reset').cropper('replace', blobURL);

                    //选择文件后，显示和隐藏相关内容
                    $('.img-container').removeClass('hidden');
                    $('.img-preview-box').removeClass('hidden');
                    $('#changeModal .disabled').removeAttr('disabled').removeClass('disabled');
                    $('#changeModal .tip-info').addClass('hidden');
                } else {
                    window.alert('请选择一个图像文件！');
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).addClass('disabled');
    }
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    return canvas.toDataURL("image/png");
}

function sendPhoto() {
    //得到 PNG 格式的 dataURL
    $('#photo').cropper('getCroppedCanvas',{
        width:320,
        height:180
    }).toBlob(function(blob){
        //转化为 blob 后更改 src 属性，隐藏模态框
        $('#user-photo').attr('src',URL.createObjectURL(blob));
        $('#changeModal').modal('hide');
    });
    $('#changeModal').modal('hide');
}

//重置 Modal
function resetModal() {
    $('#add_car_type_form').find('input').val('');
    $('#add_car_type_form').data('bootstrapValidator').destroy();
    $('#add_car_type_form').data('bootstrapValidator', null);
    $('#add_car_type').selectpicker('refresh');
    validateModal();
}