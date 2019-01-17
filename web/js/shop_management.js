$(document).ready(function(){
    //初始化表格
    initTable();
    //初始化 validator 插件
    validateModal();
    //显示省份
    showProv();
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
    var shop_prov = document.getElementById("add_shop_prov").options[document.getElementById("add_shop_prov").selectedIndex].innerText;
    var shop_city = document.getElementById("add_shop_city").options[document.getElementById("add_shop_city").selectedIndex].innerText;
    var shop_area = document.getElementById("add_shop_area").options[document.getElementById("add_shop_area").selectedIndex].innerText;
    var shop_address = $('#add_shop_address').val();
    var shop_phone = $('#add_shop_phone').val();
    var shop_hours = $('#add_shop_hours').val();
    if (shop_area == null || shop_area.length === 0) {
        alert("未选定城市！");
        return;
    }
    var data = {
        "shop_number": shop_number,
        "shop_name": shop_name,
        "shop_prov": shop_prov,
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
                alert("添加失败！原因可能为:服务点编号已存在");
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
            title: '所在城市'
        }, {
            field: 'shop_area',
            title: '所在区域'
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
                    if (!v)
                        return '营业时间不能为空';
                    if (v.charAt(0) === '2' && v.charAt(1) >= '5' && v.charAt(1) <= '9')
                        return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                    if (v.charAt(0) > '2' && v.charAt(1) >= '0' && v.charAt(1) <= '9')
                        return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                    var time1;
                    if (v.charAt(1) >= '0' && v.charAt(1) <= '9')
                        time1 = v.substring(0, 2);
                    else
                        time1 = v.charAt(0);
                    for (var i = 0; i < v.length;) {
                        if (i === 3)
                            return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                        if (v.charAt(i) === ':') {
                            for (var j = i + 1; j < v.length;) {
                                if (j === i + 4)
                                    return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                                if (v.charAt(j) === '-') {
                                    if (v.charAt(j + 1) === '2' && v.charAt(j + 2) >= '5' && v.charAt(j + 2) <= '9')
                                        return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                                    if (v.charAt(j + 1) > '2' && v.charAt(j + 2) >= '0' && v.charAt(j + 2) <= '9')
                                        return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                                    var time2;
                                    if (v.charAt(j + 2) >= '0' && v.charAt(j + 2) <= '9')
                                        time2 = v.substring(j + 1, j + 3);
                                    else
                                        time2 = v.charAt(j + 1);
                                    if ((time1 >= time2 && time1.length >= time2.length) || time1.length > time2.length)
                                        return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                                    for (var k = j + 1; k < v.length;) {
                                        if (k === j + 4)
                                            return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                                        if (v.charAt(k) === ':') {
                                            for (var l = k + 1; l < v.length;) {
                                                if (l === k + 4)
                                                    return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                                                if (v.charAt(l) >= '0' && v.charAt(l) <= '9')
                                                    l++;
                                                else return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                                                if (k + 3 === v.length)
                                                    return;
                                            }
                                        }
                                        if (v.charAt(k) >= '0' && v.charAt(k) <= '9')
                                            k++;
                                        else return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                                    }
                                }
                                if (v.charAt(j) >= '0' && v.charAt(j) <= '9')
                                    j++;
                                else return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
                            }
                        }
                        if (v.charAt(i) >= '0' && v.charAt(i) <= '9')
                            i++;
                        else return '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"';
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
                    }
                    $('#shop_info').bootstrapTable('refresh');
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
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9]+$/,
                        message: '服务点编号需为英文字母或数字'
                    },
                    stringLength: {
                        min: 4,
                        max: 4,
                        message: '服务点编号必须为4位'
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
            shop_address: {
                validators: {
                    notEmpty: {
                        message: '详细地址不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 20,
                        message: '详细地址字数不能超过20个'
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
                    },
                    callback: {
                        callback: function (value, validator, $field) {
                            if (value.charAt(0) === '2' && value.charAt(1) >= '5' && value.charAt(1) <= '9')
                                return {
                                    valid: false,
                                    message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                };
                            if (value.charAt(0) > '2' && value.charAt(1) >= '0' && value.charAt(1) <= '9')
                                return {
                                    valid: false,
                                    message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                };
                            var time1;
                            if (value.charAt(1) >= '0' && value.charAt(1) <= '9')
                                time1 = value.substring(0, 2);
                            else
                                time1 = value.charAt(0);
                            for (var i = 0; i < value.length;) {
                                if (i === 3)
                                    return {
                                        valid: false,
                                        message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                    };
                                if (value.charAt(i) === ':') {
                                    for (var j = i + 1; j < value.length;) {
                                        if (j === i + 4)
                                            return {
                                                valid: false,
                                                message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                            };
                                        if (value.charAt(j) === '-') {
                                            if (value.charAt(j + 1) === '2' && value.charAt(j + 2) >= '5' && value.charAt(j + 2) <= '9')
                                                return {
                                                    valid: false,
                                                    message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                                };
                                            if (value.charAt(j + 1) > '2' && value.charAt(j + 2) >= '0' && value.charAt(j + 2) <= '9')
                                                return {
                                                    valid: false,
                                                    message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                                };
                                            var time2;
                                            if (value.charAt(j + 2) >= '0' && value.charAt(j + 2) <= '9')
                                                time2 = value.substring(j + 1, j + 3);
                                            else
                                                time2 = value.charAt(j + 1);
                                            if ((time1 >= time2 && time1.length >= time2.length) || time1.length > time2.length)
                                                return {
                                                    valid: false,
                                                    message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                                };
                                            for (var k = j + 1; k < value.length;) {
                                                if (k === j + 4)
                                                    return {
                                                        valid: false,
                                                        message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                                    };
                                                if (value.charAt(k) === ':') {
                                                    for (var l = k + 1; l < value.length;) {
                                                        if (l === k + 4)
                                                            return {
                                                                valid: false,
                                                                message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                                            };
                                                        if (value.charAt(l) >= '0' && value.charAt(l) <= '9')
                                                            l++;
                                                        else
                                                            return {
                                                                valid: false,
                                                                message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                                            };
                                                        if (k + 3 === value.length)
                                                            return true;
                                                    }
                                                }
                                                if (value.charAt(k) >= '0' && value.charAt(k) <= '9')
                                                    k++;
                                                else
                                                    return {
                                                        valid: false,
                                                        message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                                    };
                                            }
                                        }
                                        if (value.charAt(j) >= '0' && value.charAt(j) <= '9')
                                            j++;
                                        else
                                            return {
                                                valid: false,
                                                message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                            };
                                    }
                                }
                                if (value.charAt(i) >= '0' && value.charAt(i) <= '9')
                                    i++;
                                else
                                    return {
                                        valid: false,
                                        message: '营业时间格式不正确,营业时间至少为1小时,格式应如"9:00-18:00"'
                                    };
                            }
                        }
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

var prov = document.getElementById('add_shop_prov');
var city = document.getElementById('add_shop_city');
var country = document.getElementById('add_shop_area');

/*用于保存当前所选的省市区*/
var current = {
    prov: '',
    city: '',
    country: ''
};

/*自动加载省份列表*/
function showProv() {
    var len = provice.length;
    for (var i = 0; i < len; i++) {
        var provOpt = document.createElement('option');
        provOpt.innerText = provice[i]['name'];
        provOpt.value = i;
        prov.appendChild(provOpt);
    }
}

/*根据所选的省份来显示城市列表*/
function showCity(obj) {
    var val = obj.options[obj.selectedIndex].value;
    if (val !== current.prov) {
        current.prov = val;
    }
    //console.log(val);
    if (val != null) {
        city.length = 1;
        var cityLen = provice[val]["city"].length;
        for (var j = 0; j < cityLen; j++) {
            var cityOpt = document.createElement('option');
            cityOpt.innerText = provice[val]["city"][j].name;
            cityOpt.value = j;
            city.appendChild(cityOpt);
        }
    }
}

/*根据所选的城市来显示县区列表*/
function showCountry(obj) {
    var val = obj.options[obj.selectedIndex].value;
    current.city = val;
    if (val != null) {
        country.length = 1; //清空之前的内容只留第一个默认选项
        var countryLen = provice[current.prov]["city"][val].districtAndCounty.length;
        for (var n = 0; n < countryLen; n++) {
            var countryOpt = document.createElement('option');
            countryOpt.innerText = provice[current.prov]["city"][val].districtAndCounty[n];
            countryOpt.value = n;
            country.appendChild(countryOpt);
        }
    }
}