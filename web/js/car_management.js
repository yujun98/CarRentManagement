$(document).ready(function(){
    //初始化 Selectpicker 插件
    initSelectpicker();
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

//添加汽车
function addCar() {
    //启用 validator 插件
    $('#add_car_form').data('bootstrapValidator').validate();
    //如果有不符合 validator 插件限制条件的条目，则不能添加
    if(!$('#add_car_form').data('bootstrapValidator').isValid()){
        return;
    }
    //使添加前弹出的 modal 隐藏
    $('#add_modal').modal('hide');
    var car_number = $('#add_car_number').val();
    var plate_number = $('#add_plate_number').val();
    var car_name = $('#add_car_name').val();
    var car_state = $('#add_car_state').val();
    var shop_number = $('#add_shop_number').val();
    var data = {
        "car_number": car_number,
        "plate_number": plate_number,
        "car_name": car_name,
        "car_state": car_state,
        "shop_number": shop_number
    };
    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
    $.ajax({
        type: "post",
        url: "addCarServlet",
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
                $('#car_info').bootstrapTable('refresh');
            }
        }
    });
    resetModal();
}

//查找函数，通过 Ajax 传递表的主键值在后台进行查找，后台再返回 JSON 形式的数据，然后在网页内由 bootstrapTable 加载
function searchCar() {
    var car_number = $("#search_text").val();
    var data = {
        "car_number": car_number
    };
    $.ajax({
        type: "post",
        url: "searchCarServlet",
        data: data,
        dataType: "json",
        success: function(json){
            $('#car_info').bootstrapTable('load', json);
        }
    });
    $('#search_text').val('');
}

//通过 Ajax 获取选项值，用 selectpicker 插件加载
function initSelectpicker() {
    $.ajax({
        type: "post",
        url: "carTypeServlet",
        dataType: "json",
        async: false,
        success: function (json) {
            var html = '';
            $.each(json, function (key, value) {
                html += '<option value="' + value.car_name + '">' + value.car_name + '</option>';
            });
            $('#add_car_name').html(html);
            $('#add_car_name').selectpicker('refresh');
        }
    });
    $.ajax({
        type: "post",
        url: "shopServlet",
        dataType: "json",
        async: false,
        success: function (json) {
            var html = '';
            $.each(json, function (key, value) {
                html += '<option value="' + value.shop_number + '">' + value.shop_number + '</option>';
            });
            $('#add_shop_number').html(html);
            $('#add_shop_number').selectpicker('refresh');
        }
    });
}

//初始化 bootstrapTable
function initTable() {
    $('#car_info').bootstrapTable('destroy');
    $("#car_info").bootstrapTable({
        //使用 post 请求到服务器获取数据
        method: "post",
        //获取数据的 Servlet 地址
        url: "carServlet",
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
            field: 'car_number',
            title: '车辆编号',
            sortable: true
        }, {
            field: 'plate_number',
            title: '车辆车牌号',
            type: 'text',
            sortable: true,
            editable: {
                title: '输入车辆车牌号',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '车辆车牌号不能为空';
                    }
                }
            }
        }, {
            field: 'car_name',
            title: '车辆名称',
            editable: {
                title: '选择车辆名称',
                type: 'select',
                source: function () {
                    var result = [];
                    $.ajax({
                        type: "post",
                        url: "carTypeServlet",
                        dataType: "json",
                        //这里要设置未同步，否者之后 return 那里在 result 还没完成更改就把 result 对象给返回了
                        async: false,
                        success: function (json) {
                            $.each(json, function (key, value) {
                                result.push({
                                    value: value.car_name,
                                    text: value.car_name
                                });
                            });
                        }
                    });
                    return JSON.stringify(result);
                }
            }
        }, {
            field: 'car_state',
            title: '车辆状态',
            editable: {
                title: '选择车辆状态',
                type: 'select',
                source: [{
                    value: '未租',
                    text: '未租'
                }, {
                    value: '已租',
                    text: '已租'
                }, {
                    value: '报修',
                    text: '报修'
                }]
            }
        }, {
            field: 'shop_number',
            title: '所属服务点编号',
            sortable: true,
            editable: {
                title: '选择所属服务点编号',
                type: 'select',
                source: function () {
                    var result = [];
                    //通过 Ajax 获取数据，在 table 内用 select 元件加载
                    $.ajax({
                        type: "post",
                        url: "shopServlet",
                        dataType: "json",
                        async: false,
                        success: function (json) {
                            $.each(json, function (key, value) {
                                var data = {
                                    value: value.shop_number,
                                    text: value.shop_number
                                };
                                result.push(data);
                            });
                        }
                    });
                    return JSON.stringify(result);
                }
            }
        }, {
            field: 'button',
            title: '操作',
            events: operateEvents = {
                'click #delete_button': function (e, value, row) {
                    var data = {
                        "car_number": row.car_number
                    };
                    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
                    $.ajax({
                        type: "post",
                        url: "deleteCarServlet",
                        data: data,
                        dataType: "text",
                        success: function(data) {
                            if(parseInt(data) !== 0) {
                                alert("删除失败！");
                                console.log(data);
                            }
                            else {
                                alert("删除成功！");
                                $('#car_info').bootstrapTable('refresh');
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
                "car_number": row.car_number,
                "plate_number": row.plate_number,
                "car_name": row.car_name,
                "car_state": row.car_state,
                "shop_number": row.shop_number
            };
            //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
            $.ajax({
                type: "post",
                url: "updateCarServlet",
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
                        $('#car_info').bootstrapTable('refresh');
                    }
                }
            });
        }
    });
}

//在 Modal 中启用 Validator 插件
function validateModal() {
    $('#add_car_form').bootstrapValidator({
        feedbackIcons: {
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            car_number: {
                validators: {
                    notEmpty: {
                        message: '汽车编号不能为空'
                    }
                }
            },
            plate_number: {
                validators: {
                    notEmpty: {
                        message: '汽车车牌号不能为空'
                    }
                }
            }
        }
    });
}

//重置 Modal
function resetModal() {
    $('#add_car_form').find('input').val('');
    $('#add_car_form').data('bootstrapValidator').destroy();
    $('#add_car_form').data('bootstrapValidator', null);
    $('#add_car_name').selectpicker('refresh');
    $('#add_car_state').selectpicker('refresh');
    $('#add_shop_number').selectpicker('refresh');
    validateModal();
}