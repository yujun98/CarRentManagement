$(document).ready(function(){
    //初始化表格
    initTable();
    //初始化 validator 插件
    validateModal();
    //设置搜索框的回车监听
    $('#search_text').keydown(function (e) {
        if (e.keyCode === 13) {
            $('#search_btn').click();
        }
    });
});

//添加服务点
function addShop() {
    //启用 validator 插件
    $('#add_shop_form').data('bootstrapValidator').validate();
    //如果有不符合 validator 插件限制条件的条目，则不能添加
    if(!$('#add_shop_form').data('bootstrapValidator').isValid()){
        return;
    }
    //使添加前弹出的 modal 隐藏
    $('#add_modal').modal('hide');
    var shop_number = $('#add_shop_number').val();
    var shop_name = $('#add_shop_name').val();
    var shop_city = $('#add_shop_city').val();
    var shop_area = $('#add_shop_area').val();
    var shop_address = $('#add_shop_address').val();
    var shop_phone = $('#add_shop_phone').val();
    var shop_hours = $('#add_shop_hours').val();
    var data = {
        "shop_number": shop_number,
        "shop_name": shop_name,
        "shop_city": shop_city,
        "shop_area": shop_area,
        "shop_address": shop_address,
        "shop_phone": shop_phone,
        "shop_hours": shop_hours
    };
    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
    $.ajax({
        type: "post",
        url: "addShopServlet",
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
                $('#shop_info').bootstrapTable('refresh');
            }
        }
    });
    resetModal();
}

//查找函数，通过 Ajax 传递表的主键值在后台进行查找，后台再返回 JSON 形式的数据，然后在网页内由 bootstrapTable 加载
function searchShop() {
    var shop_number = $("#search_text").val();
    var data = {
        "shop_number": shop_number
    };
    $.ajax({
        type: "post",
        url: "searchShopServlet",
        data: data,
        dataType: "json",
        success: function(json){
            $('#shop_info').bootstrapTable('load', json);
        }
    });
    $('#search_text').val('');
}

//初始化 bootstrapTable
function initTable() {
    $('#shop_info').bootstrapTable('destroy');
    $("#shop_info").bootstrapTable({
        //使用 post 请求到服务器获取数据
        method: "post",
        //获取数据的 Servlet 地址
        url: "shopServlet",
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
            field: 'shop_number',
            title: '服务点编号',
            sortable: true
        }, {
            field: 'shop_name',
            title: '服务点名称',
            sortable: true,
            type: 'text',
            editable: {
                title: '输入服务点名称',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '服务点名称不能为空';
                    }
                }
            }
        }, {
            field: 'shop_city',
            title: '所在城市',
            editable: {
                title: '输入所在城市',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '所在城市不能为空';
                    }
                }
            }
        }, {
            field: 'shop_area',
            title: '所在区域',
            editable: {
                title: '输入所在区域',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '所在区域不能为空';
                    }
                }
            }
        }, {
            field: 'shop_address',
            title: '详细地址',
            editable: {
                title: '输入详细地址',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '详细地址不能为空';
                    }
                }
            }
        }, {
            field: 'shop_phone',
            title: '联系电话',
            editable: {
                title: '输入联系电话',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '联系电话不能为空';
                    }
                    else if (isNaN(v) || parseFloat(v) < 0) {
                        return '联系电话格式不符';
                    }
                    else if (v.length !== 11) {
                        return "联系电话需满11位";
                    }
                }
            }
        }, {
            field: 'shop_hours',
            title: '营业时间',
            editable: {
                title: '输入营业时间',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '营业时间不能为空';
                    }
                }
            }
        }, {
            field: 'button',
            title: '操作',
            events: operateEvents = {
                'click #delete_button': function (e, value, row) {
                    var data = {
                        "shop_number": row.shop_number
                    };
                    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
                    $.ajax({
                        type: "post",
                        url: "deleteShopServlet",
                        data: data,
                        dataType: "text",
                        success: function(data) {
                            if(parseInt(data) !== 0) {
                                alert("删除失败！");
                                console.log(data);
                            }
                            else {
                                alert("删除成功！");
                                $('#shop_info').bootstrapTable('refresh');
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
                "shop_number": row.shop_number,
                "shop_name": row.shop_name,
                "shop_city": row.shop_city,
                "shop_area": row.shop_area,
                "shop_address": row.shop_address,
                "shop_phone": row.shop_phone,
                "shop_hours": row.shop_hours
            };
            //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
            $.ajax({
                type: "post",
                url: "updateShopServlet",
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
                        $('#shop_info').bootstrapTable('refresh');
                    }
                }
            });
        }
    });
}

//在 Modal 中启用 Validator 插件
function validateModal() {
    $('#add_shop_form').bootstrapValidator({
        feedbackIcons: {
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            shop_number: {
                validators: {
                    notEmpty: {
                        message: '服务点编号不能为空'
                    }
                }
            },
            shop_name: {
                validators: {
                    notEmpty: {
                        message: '服务点名称不能为空'
                    }
                }
            },
            shop_city: {
                validators: {
                    notEmpty: {
                        message: '所在城市不能为空'
                    }
                }
            },
            shop_area: {
                validators: {
                    notEmpty: {
                        message: '所在区域不能为空'
                    }
                }
            },
            shop_address: {
                validators: {
                    notEmpty: {
                        message: '详细地址不能为空'
                    }
                }
            },
            shop_phone: {
                validators: {
                    notEmpty: {
                        message: '联系电话不能为空'
                    },
                    stringLength: {
                        min: 11,
                        max: 11,
                        message: '联系电话必须为11位'
                    },
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '联系电话格式不符'
                    }
                }
            },
            shop_hours: {
                validators: {
                    notEmpty: {
                        message: '营业时间不能为空'
                    }
                }
            }
        }
    });
}

//重置 Modal
function resetModal() {
    $('#add_shop_form').find('input').val('');
    $('#add_shop_form').data('bootstrapValidator').destroy();
    $('#add_shop_form').data('bootstrapValidator', null);
    validateModal();
}