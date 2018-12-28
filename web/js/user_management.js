$(document).ready(function(){
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

//添加用户
function addUser() {
    //启用 validator 插件
    $('#add_user_form').data('bootstrapValidator').validate();
    //如果有不符合 validator 插件限制条件的条目，则不能添加
    if(!$('#add_user_form').data('bootstrapValidator').isValid()){
        return;
    }
    //使添加前弹出的 modal 隐藏
    $('#add_modal').modal('hide');
    var user_phone = $('#add_user_phone').val();
    var user_name = $('#add_user_name').val();
    var id = $('#add_id').val();
    var user_pwd = $('#add_user_pwd').val();
    var balance = $('#add_balance').val();
    var deposit = $('#add_deposit').val();
    var score = $('#add_score').val();
    var data = {
        "user_phone": user_phone,
        "user_name": user_name,
        "id": id,
        "user_pwd": user_pwd,
        "balance": balance,
        "deposit": deposit,
        "score": score
    };
    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
    $.ajax({
        type: "post",
        url: "addUserServlet",
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
                $('#user_info').bootstrapTable('refresh');
            }
        }
    });
    resetModal();
}

//查找函数，通过 Ajax 传递表的主键值在后台进行查找，后台再返回 JSON 形式的数据，然后在网页内由 bootstrapTable 加载
function searchUser() {
    var user_phone = $("#search_text").val();
    var data = {
        "user_phone": user_phone
    };
    $.ajax({
        type: "post",
        url: "searchUserServlet",
        data: data,
        dataType: "json",
        success: function(json){
            $('#user_info').bootstrapTable('load', json);
        }
    });
    $('#search_text').val('');
}

//初始化 bootstrapTable
function initTable() {
    $('#user_info').bootstrapTable('destroy');
    $("#user_info").bootstrapTable({
        //使用 post 请求到服务器获取数据
        method: "post",
        //获取数据的 Servlet 地址
        url: "userServlet",
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
            field: 'user_phone',
            title: '用户手机号',
            sortable: true
        }, {
            field: 'user_name',
            title: '用户昵称',
            type: 'text',
            editable: {
                title: '输入用户昵称',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '用户昵称不能为空';
                    }
                }
            }
        }, {
            field: 'id',
            title: '用户身份证号码',
            sortable: true,
            editable: {
                title: '输入用户身份证号码',
                type: 'text',
                validate: function(v) {
                    if (v.length !== 18) {
                        return '用户身份证号码需满18位';
                    }
                }
            }
        }, {
            field: 'user_pwd',
            title: '用户密码',
            editable: {
                title: '输入用户密码',
                type: 'text',
                validate: function(v) {
                    if (!v) {
                        return '用户密码不能为空';
                    }
                    else if (v.length < 10 && v.length > 18) {
                        return '用户密码需在10位与18位之间';
                    }
                }
            }
        }, {
            field: 'deposit',
            title: '用户押金',
            editable: {
                title: '输入用户押金',
                type: 'text',
                validate: function(v) {
                    if (isNaN(v)) {
                        return '用户押金必须是数字';
                    }
                    else if (parseFloat(v) < 0) {
                        return "用户押金不能小于0";
                    }
                }
            }
        }, {
            field: 'balance',
            title: '用户余额',
            editable: {
                title: '输入用户余额',
                type: 'text',
                validate: function(v) {
                    if (isNaN(v)) {
                        return '用户余额必须是数字';
                    }
                    else if (parseFloat(v) < 0) {
                        return "用户余额不能小于0";
                    }
                }
            }
        }, {
            field: 'score',
            title: '用户积分',
            editable: {
                title: '输入用户积分',
                type: 'text',
                validate: function (v) {
                    if (isNaN(v)) {
                        return '用户积分必须是数字';
                    }
                }
            }
        }, {
            field: 'button',
            title: '操作',
            events: operateEvents = {
                'click #delete_button': function (e, value, row) {
                    var data = {
                        "user_phone": row.user_phone
                    };
                    //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
                    $.ajax({
                        type: "post",
                        url: "deleteUserServlet",
                        data: data,
                        dataType: "text",
                        success: function(data) {
                            if(parseInt(data) !== 0) {
                                alert("删除失败！");
                                console.log(data);
                            }
                            else {
                                alert("删除成功！");
                                $('#user_info').bootstrapTable('refresh');
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
                "user_phone": row.user_phone,
                "user_name": row.user_name,
                "user_pwd": row.user_pwd,
                "id": row.id,
                "balance": row.balance,
                "deposit": row.deposit,
                "score": row.score
            };
            //通过 data 变量以 JSON 的形式向后台传递信息，后台再以 text 的形式放回，再通过判断返回的值判断是否操作成功
            $.ajax({
                type: "post",
                url: "updateUserServlet",
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
                        $('#user_info').bootstrapTable('refresh');
                    }
                }
            });
        }
    });
}

//在 Modal 中启用 Validator 插件
function validateModal() {
    $('#add_user_form').bootstrapValidator({
        feedbackIcons: {
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            user_phone: {
                validators: {
                    notEmpty: {
                        message: '用户手机号不能为空'
                    },
                    stringLength: {
                        min: 11,
                        max: 11,
                        message: '用户手机号必须为11位'
                    },
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '用户手机号格式不符'
                    }
                }
            },
            user_name: {
                validators: {
                    notEmpty: {
                        message: '用户昵称不能为空'
                    }
                }
            },
            id: {
                validators: {
                    stringLength: {
                        min: 18,
                        max: 18,
                        message: '身份证号必须为18位'
                    },
                    regexp: {
                        regexp: /^[0-9xX]+$/,
                        message: '身份证格式不符'
                    }
                }
            },
            user_pwd: {
                validators: {
                    notEmpty: {
                        message: '用户密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 18,
                        message: '用户密码必须在6至18位之间'
                    }
                }
            },
            deposit: {
                validators: {
                    notEmpty: {
                        message: '押金不能为空'
                    },
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '押金必须为非负数'
                    }
                }
            },
            balance: {
                validators: {
                    notEmpty: {
                        message: '余额不能为空'
                    }
                }
            },
            score: {
                validators: {
                    notEmpty: {
                        message: '积分不能为空'
                    }
                }
            }
        }
    });
}

//重置 Modal
function resetModal() {
    $('#add_user_form').find('input').val('');
    $('#add_user_form').data('bootstrapValidator').destroy();
    $('#add_user_form').data('bootstrapValidator', null);
    validateModal();
}