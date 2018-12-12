$(document).ready(function(){
    initTable();
    vadidateModal();
    initSelect();
    $('#search_text').keydown(function (e) {
        if (e.keyCode === 13) {
            $('#search_btn').click();
        }
    });
});
function addBac() {
    $('#add_bac_form').data('bootstrapValidator').validate();
    if(!$('#add_bac_form').data('bootstrapValidator').isValid()){
        return ;
    }
    $('#add_modal').modal('hide');
    var order_number = $('#add_order_number').val();
    var amount = $('#add_amount').val();
    var type = $('#add_type').val();
    var data = {
        "order_number": order_number,
        "amount": amount,
        "type": type
    };
    $.ajax({
        type: "post",
        url: "addBacServlet",
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
    $('#bac_info').bootstrapTable('refresh');
    resetModal();
}
function searchBac() {
    var order_number = $("#search_text").val();
    var data = {
        "order_number": order_number
    };
    $.ajax({
        type: "post",
        url: "searchBacServlet",
        data: data,
        dataType: "json",
        success: function(json){
            $('#bac_info').bootstrapTable('load', json);
        }
    });
    $('#search_text').val('');
}
function initTable() {
    $('#bac_info').bootstrapTable('destroy');
    $("#bac_info").bootstrapTable({
        //使用post请求到服务器获取数据
        method: "post",
        //获取数据的Servlet地址
        url: "bacServlet",
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
            field: 'amount',
            title: '罚款金额',
            type: 'text',
            editable: {
                title: '输入罚款金额',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '罚款金额不能为空';
                    }
                    else if (parseFloat(v) < 0) {
                        return '罚款金额不能小于0';
                    }
                }
            }
        }, {
            field: 'type',
            title: '违约类型',
            type: 'text',
            editable: {
                title: '输入违约类型',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '违约类型不能为空';
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
                        url: "deleteBacServlet",
                        data: data,
                        dataType: "json",
                        success: function(json){
                            if(parseInt(json.code) === 1) {
                                alert("删除失败！");
                            }
                            else {
                                alert("删除成功！");
                                $('#bac_info').bootstrapTable('refresh');
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
                "amount": row.amount,
                "type": row.type
            };
            $.ajax({
                type: "post",
                url: "updateBacServlet",
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
function initSelect() {
    $.ajax({
        type: "post",
        url: "orderServlet",
        dataType: "json",
        success: function (json) {
            var html = '';
            $.each(json, function (key, value) {
                html += '<option value="' + value.order_number + '">' + value.order_number + '</option>';
            });
            $('#add_order_number').html(html);
            $('#add_order_number').selectpicker('refresh');
        }
    });
}
function vadidateModal() {
    $('#add_bac_form').bootstrapValidator({
        feedbackIcons: {
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            amount: {
                validators: {
                    notEmpty: {
                        message: '罚款金额不能为空'
                    },
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '罚款金额必须为非负数'
                    }
                }
            },
            type: {
                validators: {
                    notEmpty: {
                        message: '违约类型不能为空'
                    }
                }
            }
        }
    });
}
function resetModal() {
    $('#add_bac_form').find('input').val('');
    $('#add_bac_form').data('bootstrapValidator').destroy();
    $('#add_bac_form').data('bootstrapValidator', null);
    $('#add_order_number').selectpicker('refresh');
    vadidateModal();
}