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

//添加事故记录
function addAccident() {
    //启用 validator 插件
    $('#add_accident_form').data('bootstrapValidator').validate();
    //如果有不符合 validator 插件限制条件的条目，则不能添加
    if(!$('#add_accident_form').data('bootstrapValidator').isValid()){
        return;
    }
    //使添加前弹出的 modal 隐藏
    $('#add_modal').modal('hide');
    var order_number = $('#add_order_number').val();
    var time = $('#add_time').val();
    var place = $('#add_place').val();
    var type = $('#add_type').val();
    var data = {
        "order_number": order_number,
        "time": time,
        "place": place,
        "type": type
    };
    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
    $.ajax({
        type: "post",
        url: "addAccidentServlet",
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
                $('#accident_info').bootstrapTable('refresh');
            }
        }
    });
    resetModal();
}

//查找函数，通过 Ajax 传递表的主键值在后台进行查找，后台再返回 JSON 形式的数据，然后在网页内由 bootstrapTable 加载
function searchAccident() {
    var order_number = $("#search_text").val();
    var data = {
        "order_number": order_number
    };
    $.ajax({
        type: "post",
        url: "searchAccidentServlet",
        data: data,
        dataType: "json",
        success: function(json){
            $('#accident_info').bootstrapTable('load', json);
        }
    });
    $('#search_text').val('');
}

//通过 Ajax 获取选项值，用 selectpicker 插件加载
function initSelectpicker() {
    $.ajax({
        type: "post",
        url: "orderServlet",
        dataType: "json",
        async: false,
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

//初始化 bootstrapTable
function initTable() {
    $('#accident_info').bootstrapTable('destroy');
    $("#accident_info").bootstrapTable({
        //使用 post 请求到服务器获取数据
        method: "post",
        //获取数据的 Servlet 地址
        url: "accidentServlet",
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
            field: 'time',
            title: '事故时间',
            sortable: true
        }, {
            field: 'place',
            title: '事故地点',
            editable: {
                title: '输入事故地点',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '事故地点不能为空';
                    }
                }
            }
        },{
            field: 'type',
            title: '事故说明',
            type: 'text',
            editable: {
                title: '输入事故说明',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '事故说明不能为空';
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
                        "order_number": row.order_number,
                        "time": row.time
                    };
                    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
                    $.ajax({
                        type: "post",
                        url: "deleteAccidentServlet",
                        data: data,
                        dataType: "text",
                        success: function(data) {
                            if(parseInt(data) !== 0) {
                                alert("删除失败！");
                                console.log(data);
                            }
                            else {
                                alert("删除成功！");
                                $('#accident_info').bootstrapTable('refresh');
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
                "time": row.time,
                "place": row.place,
                "type": row.type
            };
            //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
            $.ajax({
                type: "post",
                url: "updateAccidentServlet",
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
                    $('#accident_info').bootstrapTable('refresh');
                }
            });
        }
    });
}

//在 Modal 中启用 Validator 插件
function validateModal() {
    $('#add_accident_form').bootstrapValidator({
        feedbackIcons: {
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            place: {
                validators: {
                    notEmpty: {
                        message: '事故地点不能为空'
                    }
                }
            },
            type: {
                validators: {
                    notEmpty: {
                        message: '事故说明不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 100,
                        message: '事故说明字数不能超过100个'
                    }
                }
            }
        }
    });
}

//重置 Modal
function resetModal() {
    $('#add_accident_form').find('input').val('');
    $('#add_accident_form').data('bootstrapValidator').destroy();
    $('#add_accident_form').data('bootstrapValidator', null);
    $('#add_order_number').selectpicker('refresh');
    validateModal();
}