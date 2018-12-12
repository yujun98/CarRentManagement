$(document).ready(function(){
    initTable();
    vadidateModal();
    $('#search_text').keydown(function (e) {
        if (e.keyCode === 13) {
            $('#search_btn').click();
        }
    });
    $('.datetimepicker').datetimepicker({
        autoclose: true,
        clearBtn: true,
        language: 'zh-CN',
        orientation: 'bottom',
        todayHighlight: true
    })
});
function addOrder() {
    $('#add_order_form').data('bootstrapValidator').validate();
    if(!$('#add_order_form').data('bootstrapValidator').isValid()){
        return;
    }
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
    $.ajax({
        type: "post",
        url: "addOrderServlet",
        data: data,
        dataType: "json",
        async: false,
        success: function(json) {
            if(parseInt(json.code) === 1) {
                alert("添加失败！");
            }
            else {
                alert("添加成功！");
            }
        }
    });
    $('#order_info').bootstrapTable('refresh');
    resetModal();
}
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
function initTable() {
    $('#order_info').bootstrapTable('destroy');
    $("#order_info").bootstrapTable({
        //使用post请求到服务器获取数据
        method: "post",
        //获取数据的Servlet地址
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
                        //这里要设置未同步，否者之后 return 那里在 result 还没完成更改就把 result 对象给返回了。
                        async: false,
                        success: function (json) {
                            var html = '';
                            $.each(json, function (key, value) {
                                html += '<option value="' + value.user_phone + '">' + value.user_phone + '</option>';
                                result.push({
                                    value: value.user_phone,
                                    text: value.user_phone
                                });
                            });
                            $('#add_user_phone').html(html);
                            $('#add_user_phone').selectpicker('refresh');
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
            sortable: true,
            editable: {
                title: '选择汽车编号',
                type: 'select',
                source: function () {
                    var result = [];
                    $.ajax({
                        type: "post",
                        url: "carServlet",
                        dataType: "json",
                        //这里要设置未同步，否者之后 return 那里在 result 还没完成更改就把 result 对象给返回了。
                        async: false,
                        success: function (json) {
                            var html = '';
                            $.each(json, function (key, value) {
                                if (value.car_state === "未租") {
                                    html += '<option value="' + value.car_number + '">' + value.car_number + '</option>';
                                    result.push({
                                        value: value.car_number,
                                        text: value.car_number
                                    });
                                }
                            });
                            $('#add_car_number').html(html);
                            $('#add_car_number').selectpicker('refresh');
                        }
                    });
                    return JSON.stringify(result);
                }
            },
            validate: function(v) {
                if (!v) {
                    return '汽车编号不能为空';
                }
            }
        }, {
            field: 'take_shop',
            title: '取车服务点编号',
            sortable: true,
            editable: {
                title: '选择取车服务点编号',
                type: 'select',
                source: function () {
                    var result = [];
                    $.ajax({
                        type: "post",
                        url: "shopServlet",
                        dataType: "json",
                        //这里要设置未同步，否者之后 return 那里在 result 还没完成更改就把 result 对象给返回了。
                        async: false,
                        success: function (json) {
                            var html = '';
                            $.each(json, function (key, value) {
                                html += '<option value="' + value.shop_number + '">' + value.shop_number + '</option>';
                                result.push({
                                    value: value.shop_number,
                                    text: value.shop_number
                                });
                            });
                            $('#add_take_shop').html(html);
                            $('#add_take_shop').selectpicker('refresh');
                        }
                    });
                    return JSON.stringify(result);
                }
            },
            validate: function(v) {
                if (!v) {
                    return '取车服务点编号不能为空';
                }
            }
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
                        //这里要设置未同步，否者之后 return 那里在 result 还没完成更改就把 result 对象给返回了。
                        async: false,
                        success: function (json) {
                            var html = '';
                            $.each(json, function (key, value) {
                                html += '<option value="' + value.shop_number + '">' + value.shop_number + '</option>';
                                result.push({
                                    value: value.shop_number,
                                    text: value.shop_number
                                });
                            });
                            $('#add_return_shop').html(html);
                            $('#add_return_shop').selectpicker('refresh');
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
                    var data = {
                        "order_number": row.order_number
                    };
                    $.ajax({
                        type: "post",
                        url: "deleteOrderServlet",
                        data: data,
                        dataType: "json",
                        success: function(json){
                            if(parseInt(json.code) === 1) {
                                alert("删除失败！");
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
            if (row.order_state === '未取车') {
                row.return_time = null;
            }
            else if (row.order_state === '未还车') {
                row.take_time = getFormatTime();
                row.return_time = null;
            }
            else if (row.order_state === '已还车') {
                row.return_time = getFormatTime();
            }
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
            $.ajax({
                type: "post",
                url: "updateOrderServlet",
                data: data,
                dataType: "json",
                async: false,
                success: function(json) {
                    if(parseInt(json.code) === 1) {
                        alert("更改失败！");
                    }
                    else {
                        alert("更改成功！");
                        $('#order_info').bootstrapTable('refresh');
                    }
                }
            });
        }
    });
}
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
function vadidateModal() {
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
                    }
                }
            },
            take_time: {
                validators: {
                    notEmpty: {
                        message: '取车时间不能为空'
                    }
                }
            },
            order_amount: {
                validators: {
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '订单金额必须为非负数'
                    }
                }
            },
            take_oil: {
                validators: {
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '取车油量必须为非负数'
                    }
                }
            },
            return_oil: {
                validators: {
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '还车油量必须为非负数'
                    }
                }
            },
            oil_amount: {
                validators: {
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '油量花费必须为非负数'
                    }
                }
            }
        }
    });
}
function resetModal() {
    $('#add_order_form').find('input').val('');
    $('#add_order_form').data('bootstrapValidator').destroy();
    $('#add_order_form').data('bootstrapValidator', null);
    $('#add_user_phone').selectpicker('refresh');
    $('#add_car_number').selectpicker('refresh');
    $('#add_take_shop').selectpicker('refresh');
    $('#add_return_shop').selectpicker('refresh');
    vadidateModal();
}