//通过bootstrap-table初始化表格
var tab = $('#tabList').bootstrapTable({
    url: './data.json',
    queryParams: function(params) {
        return getQuery(params);
    },
    onLoadSuccess: function(json) {
        debugger
        // if(json.success){
        //
        // }
        // return json.data.rows;

    }
});


//查询参数
function getQuery(params) {
    return {
        filter: $('#filter').val(),
        TicketMakeType: $("#TicketMakeType").val(),
        PackFlag: "0",
        CheckSchemeName: $("#CheckSchemeName").val(),
        ScenicName: $("#ScenicName").val(),
        MakeCodeKind: $("#MakeCodeKind").val(),
        UseCtrlKind: $("#IsYesOrNo").val(),
        TaxInvoiceCompany: $("#TaxInvoiceName").val(),
        sort: params.sort,
        order: params.order,
        skipCount: params.offset,
        maxResultCount: params.limit
    };
}
//刷新表格
function reloadTable() {
    tab.bootstrapTable('refresh');
}

//替换表格的操作那一列
function fmtOperate(val, row, index) {
    var edit = editButton(val);
    var del = delButton(val);
    return edit + split + del;
}


function add() {
    var dialog = openDialog2('./demo.html?id=' + "","添加商家");
    abp.event.off('save');
    abp.event.on('save', function () {
        dialog.close();
        reloadTable();
    });
}

function edit(id) {
    var dialog = openDialog2('./data.json?id=' + "","编辑商家");
    abp.event.off('save');
    abp.event.on('save', function () {
        dialog.close();
        reloadTable();
    });
}

function del(id) {
    abp.ajax({
        url: '/Member/Members/CheckDelete',
        data: JSON.stringify({ Id: id })
    }).done(function () {
        confirm($.i18n.prop("modal.delete.confirm"),$.i18n.prop("modal.sys.tip"), function (r) {
            if (r) {
                abp.ajax({
                    url: '/Member/Members/Delete',
                    data: JSON.stringify({ Id: id })
                }).done(function (result) {
                    success($.i18n.prop("modal.delete.success"));
                    reloadTable();
                });
            }
        });
    })
}

///确定要重置密码
function restPassword(id) {
    var rows = getSelect(tab);
    if (rows == null) return;

    confirm($.i18n.prop("modal.sys.edit.password.confirm"), $.i18n.prop("modal.sys.tip"), function (r) {
        if (r) {
            var arr = new Array();
            $.each(rows, function (i, item) {
                arr.push({
                    Id: item.id
                });
            });
            abp.ajax({
                url: '/Member/Members/RestPassword',
                data: JSON.stringify(arr)
            }).done(function (result) {
                success($.i18n.prop("modal.edit.success"));
                reloadTable();
            });
        }
    });
}
