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
    //初始化 datetimepicker 插件
    $('.datetimepicker').datetimepicker({
        autoclose: true,
        clearBtn: true,
        language: 'zh-CN',
        orientation: 'bottom',
        todayHighlight: true
    })
});

//添加订单记录
function addOrder() {
    //启用 validator 插件
    $('#add_order_form').data('bootstrapValidator').validate();
    //如果有不符合 validator 插件限制条件的条目，则不能添加
    if(!$('#add_order_form').data('bootstrapValidator').isValid()){
        return;
    }
    //使添加前弹出的 modal 隐藏
    $('#add_modal').modal('hide');
    var order_number = $('#add_order_number').val();
    var user_phone = $('#add_user_phone').val();
    var car_number = $('#add_car_number').val();
    var take_shop = $('#add_take_shop').val();
    var return_shop = $('#add_return_shop').val();
    var order_time = getFormatTime();
    var take_time = $('#add_take_time').val();
    var return_time = $('#add_return_time').val();
    var order_amount = $('#add_order_amount').val();
    var order_state = $('#add_order_state').val();
    var take_oil = $('#add_take_oil').val();
    var return_oil = $('#add_return_oil').val();
    var oil_amount = $('#add_oil_amount').val();
    if (take_time.length === 0) {
        alert("取车时间不能为空");
        return;
    }
    if (return_time.length === 0) {
        alert("还车时间不能为空");
        return;
    }
    if (take_time.length !== 0 && return_time.length !== 0) {
        if (take_time >= return_time) {
            alert("取车时间不能晚于还车时间");
            return;
        }
    }
    var data = {
        "order_number": order_number,
        "user_phone": user_phone,
        "car_number": car_number,
        "take_shop": take_shop,
        "return_shop": return_shop,
        "order_time": order_time,
        "take_time": take_time,
        "return_time": return_time,
        "order_amount": order_amount,
        "order_state": order_state,
        "take_oil": take_oil,
        "return_oil": return_oil,
        "oil_amount": oil_amount
    };
    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
    $.ajax({
        type: "post",
        url: "addOrderServlet",
        data: data,
        dataType: "text",
        async: false,
        success: function(data) {
            if(parseInt(data) !== 0) {
                alert("添加失败！原因可能为:车辆编号已存在 或 车牌号已存在");
                console.log(data);
            }
            else {
                alert("添加成功！");
                $('#order_info').bootstrapTable('refresh');
            }
        }
    });
    resetModal();
}

//查找订单的函数
function searchOrder() {
    var order_number = $("#search_text").val();
    var data = {
        "order_number": order_number
    };
    $.ajax({
        type: "post",
        url: "searchOrderServlet",
        data: data,
        dataType: "json",
        success: function(json){
            $('#order_info').bootstrapTable('load', json);
        }
    });
    $('#search_text').val('');
}

//通过 Ajax 获取选项值，用 selectpicker 插件加载
function initSelectpicker() {
    $.ajax({
        type: "post",
        url: "userServlet",
        dataType: "json",
        async: false,
        success: function (json) {
            var html = '';
            $.each(json, function (key, value) {
                html += '<option value="' + value.user_phone + '">' + value.user_phone + '</option>';
            });
            $('#add_user_phone').html(html);
            $('#add_user_phone').selectpicker('refresh');
        }
    });
    $.ajax({
        type: "post",
        url: "carServlet",
        dataType: "json",
        async: false,
        success: function (json) {
            var html = '';
            $.each(json, function (key, value) {
                if (value.car_state === "未租") {
                    html += '<option value="' + value.car_number + '">' + value.car_number + '</option>';
                }
            });
            $('#add_car_number').html(html);
            $('#add_car_number').selectpicker('refresh');
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
            $('#add_take_shop').html(html);
            $('#add_take_shop').selectpicker('refresh');
            $('#add_return_shop').html(html);
            $('#add_return_shop').selectpicker('refresh');
        }
    });
}

//初始化 bootstrapTable
function initTable() {
    $('#order_info').bootstrapTable('destroy');
    $("#order_info").bootstrapTable({
        //使用 post 请求到服务器获取数据
        method: "post",
        //获取数据的 Servlet 地址
        url: "orderServlet",
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
            field: 'order_number',
            title: '订单编号',
            sortable: true
        }, {
            field: 'user_phone',
            title: '用户手机号',
            sortable: true,
            editable: {
                title: '选择用户手机号',
                type: 'select',
                source: function () {
                    var result = [];
                    $.ajax({
                        type: "post",
                        url: "userServlet",
                        dataType: "json",
                        //这里要设置未同步，否者之后 return 那里在 result 还没完成更改就把 result 对象给返回了
                        async: false,
                        success: function (json) {
                            $.each(json, function (key, value) {
                                result.push({
                                    value: value.user_phone,
                                    text: value.user_phone
                                });
                            });
                        }
                    });
                    return JSON.stringify(result);
                }
            },
            validate: function(v) {
                if (!v) {
                    return '用户手机号不能为空';
                }
            }
        }, {
            field: 'car_number',
            title: '汽车编号',
            sortable: true
        }, {
            field: 'take_shop',
            title: '取车服务点编号',
            sortable: true
        }, {
            field: 'return_shop',
            title: '还车服务点编号',
            sortable: true,
            editable: {
                title: '选择还车服务点编号',
                type: 'select',
                source: function () {
                    var result = [];
                    $.ajax({
                        type: "post",
                        url: "shopServlet",
                        dataType: "json",
                        //这里要设置未同步，否者之后 return 那里在 result 还没完成更改就把 result 对象给返回了
                        async: false,
                        success: function (json) {
                            $.each(json, function (key, value) {
                                result.push({
                                    value: value.shop_number,
                                    text: value.shop_number
                                });
                            });
                        }
                    });
                    return JSON.stringify(result);
                }
            }
        }, {
            field: 'order_time',
            title: '订单生成时间',
            sortable: true
        }, {
            field: 'take_time',
            title: '取车时间',
            sortable: true
        }, {
            field: 'return_time',
            title: '还车时间',
            sortable: true
        }, {
            field: 'order_state',
            title: '订单状态',
            editable: {
                title: '选择订单状态',
                type: 'select',
                source: [{
                    value: '未取车',
                    text: '未取车'
                }, {
                    value: '未还车',
                    text: '未还车'
                }, {
                    value: '已还车',
                    text: '已还车'
                }, {
                    value: '已完成',
                    text: '已完成'
                }, {
                    value: '已取消',
                    text: '已取消'
                }, {
                    value: '已延长',
                    text: '已延长'
                }]
            }
        }, {
            field: 'order_amount',
            title: '订单金额',
            editable: {
                title: '输入订单金额',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '订单金额不能为空';
                    }
                    else if (isNaN(v)) {
                        return '订单金额必须是数字';
                    }
                    else if (parseFloat(v) < 0) {
                        return "订单金额不能小于0";
                    }
                }
            }
        }, {
            field: 'take_oil',
            title: '取车油量',
            editable: {
                title: '输入取车油量',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '取车油量不能为空';
                    }
                    else if (isNaN(v)) {
                        return '取车油量必须是数字';
                    }
                    else if (parseFloat(v) < 0) {
                        return "取车油量不能小于0";
                    }
                }
            }
        }, {
            field: 'return_oil',
            title: '还车油量',
            editable: {
                title: '输入还车油量',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '还车油量不能为空';
                    }
                    else if (isNaN(v)) {
                        return '还车油量必须是数字';
                    }
                    else if (parseFloat(v) < 0) {
                        return "还车油量不能小于0";
                    }
                }
            }
        }, {
            field: 'oil_amount',
            title: '油量花费',
            editable: {
                title: '输入油量花费',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '油量花费不能为空';
                    }
                    else if (isNaN(v)) {
                        return '油量花费必须是数字';
                    }
                    else if (parseFloat(v) < 0) {
                        return "油量花费不能小于0";
                    }
                }
            }
        }, {
            field: 'button',
            title: '操作',
            events: operateEvents = {
                'click #delete_button': function (e, value, row) {
                    var msg = "您确定要删除吗？\n\n请确认！";
                    if (confirm(msg) === false)
                        return;
                    var data = {
                        "order_number": row.order_number
                    };
                    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
                    $.ajax({
                        type: "post",
                        url: "deleteOrderServlet",
                        data: data,
                        dataType: "text",
                        success: function(data) {
                            if(parseInt(data) !== 0) {
                                alert("删除失败！");
                                console.log(data);
                            }
                            else {
                                alert("删除成功！");
                                $('#order_info').bootstrapTable('refresh');
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
                "order_number": row.order_number,
                "user_phone": row.user_phone,
                "car_number": row.car_number,
                "take_shop": row.take_shop,
                "return_shop": row.return_shop,
                "order_time": row.order_time,
                "take_time": row.take_time,
                "return_time": row.return_time,
                "order_amount": row.order_amount,
                "order_state": row.order_state,
                "take_oil": row.take_oil,
                "return_oil": row.return_oil,
                "oil_amount": row.oil_amount
            };
            //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
            $.ajax({
                type: "post",
                url: "updateOrderServlet",
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
                    }
                    $('#order_info').bootstrapTable('refresh');
                }
            });
        }
    });
}

//获取指定格式的时间：yy-MM-dd hh:mm:ss
function getFormatTime() {
    var tmp = new Date();
    var year = tmp.getFullYear();
    var month = tmp.getMonth() + 1;
    var date = tmp.getDate();
    var hours = tmp.getHours();
    var minutes = tmp.getMinutes();
    var seconds = tmp.getSeconds();
    return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
}

//在 Modal 中启用 Validator 插件
function validateModal() {
    $('#add_order_form').bootstrapValidator({
        feedbackIcons: {
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            order_number: {
                validators: {
                    notEmpty: {
                        message: '订单编号不能为空'
                    },
                    stringLength: {
                        min: 16,
                        max: 16,
                        message: '订单编号必须为16位'
                    },
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '订单编号必须为数字'
                    }
                }
            },
            order_amount: {
                validators: {
                    regexp: {
                        regexp: /^[+]?(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                        message: '订单金额必须为正数'
                    }
                }
            },
            take_oil: {
                validators: {
                    regexp: {
                        regexp: /^[+]?(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                        message: '取车油量必须为正数'
                    }
                }
            },
            return_oil: {
                validators: {
                    regexp: {
                        regexp: /^[+]?(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                        message: '还车油量必须为正数'
                    }
                }
            },
            oil_amount: {
                validators: {
                    regexp: {
                        regexp: /^[+]?(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                        message: '油量花费必须为正数'
                    }
                }
            }
        }
    });
}

//重置 Modal
function resetModal() {
    $('#add_order_form').find('input').val('');
    $('#add_order_form').data('bootstrapValidator').destroy();
    $('#add_order_form').data('bootstrapValidator', null);
    $('#add_user_phone').selectpicker('refresh');
    $('#add_car_number').selectpicker('refresh');
    $('#add_take_shop').selectpicker('refresh');
    $('#add_return_shop').selectpicker('refresh');
    validateModal();
}