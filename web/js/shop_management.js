$(document).ready(function(){
    initTable();
    vadidateModal();
    $('#search_text').keydown(function (e) {
        if (e.keyCode === 13) {
            $('#search_btn').click();
        }
    });
});
function addShop() {
    $('#add_shop_form').data('bootstrapValidator').validate();
    if(!$('#add_shop_form').data('bootstrapValidator').isValid()){
        return ;
    }
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
    $.ajax({
        type: "post",
        url: "addShopServlet",
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
    $('#shop_info').bootstrapTable('refresh');
    resetModal();
}
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
function initTable() {
    $('#shop_info').bootstrapTable('destroy');
    $("#shop_info").bootstrapTable({
        //使用post请求到服务器获取数据
        method: "post",
        //获取数据的Servlet地址
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
            sortable: true,
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
                    else if (isNaN(v) || parseInt(v-1) <= 0) {
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
                    $.ajax({
                        type: "post",
                        url: "deleteShopServlet",
                        data: data,
                        dataType: "json",
                        success: function(json){
                            if(parseInt(json.code) === 1) {
                                alert("删除失败！");
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
            $.ajax({
                type: "post",
                url: "updateShopServlet",
                data: data,
                dataType: "json",
                async: false,
                success: function(json) {
                    if(parseInt(json.code) === 1) {
                        alert("更改失败！");
                    }
                    else {
                        alert("更改成功！");
                    }
                }
            });
        }
    });
}
function vadidateModal() {
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
function resetModal() {
    $('#add_shop_form').find('input').val('');
    $('#add_shop_form').data('bootstrapValidator').destroy();
    $('#add_shop_form').data('bootstrapValidator', null);
    vadidateModal();
}