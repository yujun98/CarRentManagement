$(document).ready(function(){
    initTable();
    vadidateModal();
    $('#search_text').keydown(function (e) {
        if (e.keyCode === 13) {
            $('#search_btn').click();
        }
    });
});
function addCarType() {
    $('#add_car_type_form').data('bootstrapValidator').validate();
    if(!$('#add_car_type_form').data('bootstrapValidator').isValid()){
        return ;
    }
    $('#add_modal').modal('hide');
    var car_name = $('#add_car_name').val();
    var car_brand = $('#add_car_brand').val();
    var daily_rent = $('#add_daily_rent').val();
    var car_deposit = $('#add_car_deposit').val();
    var car_type = $('#add_car_type').val();
    var data = {
        "car_name": car_name,
        "car_brand": car_brand,
        "daily_rent": daily_rent,
        "car_deposit": car_deposit,
        "car_type": car_type
    };
    $.ajax({
        type: "post",
        url: "addCarTypeServlet",
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
    $('#car_type_info').bootstrapTable('refresh');
    resetModal();
}
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
function initTable() {
    $('#car_type_info').bootstrapTable('destroy');
    $("#car_type_info").bootstrapTable({
        //使用post请求到服务器获取数据
        method: "post",
        //获取数据的Servlet地址
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
                    else if (parseInt(v-1) < 0) {
                        return '日租金不能小于0';
                    }
                }
            }
        }, {
            field: 'car_deposit',
            title: '所需押金',
            editable: {
                title: '输入所需押金',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '所需押金不能为空';
                    }
                    else if (parseInt(v-1) < 0) {
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
            field: 'button',
            title: '操作',
            events: operateEvents = {
                'click #delete_button': function (e, value, row) {
                    var data = {
                        "car_name": row.car_name
                    };
                    $.ajax({
                        type: "post",
                        url: "deleteCarTypeServlet",
                        data: data,
                        dataType: "json",
                        success: function(json){
                            if(parseInt(json.code) === 1) {
                                alert("删除失败！");
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
                "car_type": row.car_type
            };
            $.ajax({
                type: "post",
                url: "updateCarTypeServlet",
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
            }
        }
    });
}
function resetModal() {
    $('#add_car_type_form').find('input').val('');
    $('#add_car_type_form').data('bootstrapValidator').destroy();
    $('#add_car_type_form').data('bootstrapValidator', null);
    $('#add_car_type').selectpicker('refresh');
    vadidateModal();
}