//通过bootstrap-table初始化表格
var pid = '', $table = $('#tabList'), treeObj, node;
//    var $table = $('#tabList')
var tab = $table.bootstrapTable({
    pagination: false,
//        url: '/merchant/list_page',
    url: './static/json/department-list.json',
    queryParams: function (params) {
        return getQuery(params);
    },
    idField: 'id',
    treeShowField: 'menuName',
    parentIdField: 'parentID',
    responseHandler: function(data) {
        return data;
    },
    onLoadSuccess: function (data) {
        debugger
        $table.treegrid({
            treeColumn: 1,
            onChange: function () {
                $(this).bindCheck(false);
            }
        });
    }
});

//查询参数
function getQuery(params) {
    var formObject = $("#queryForm").serializeFormToObject();
    var page = offsetToPage(params);
    return $.extend({
        page:page,
        limit:params.limit
    },formObject);
}
//刷新表格
function reloadTable() {
    tab.bootstrapTable('refresh');
}

//替换联系人信息
function fmtContactInfo(val, row, index) {
    return row.linkName + "<br/>" + row.linkMobile;
}

//替换表格的操作那一列
function fmtOperate(val, row, index) {
    var edit = editButton(row.id);
    var del = delButton(row.id);
    return edit + split + del;
}
//点击添加按钮
function add() {
    var dialog = openDialog2('/department/prepare_save');
    abp.event.off('save');
    abp.event.on('save', function () {
        dialog.close();
        reloadTable();
    });
}
//点击编辑按钮
function edit(id) {
    var dialog = openDialog2('/department/prepare_update?id=' + id);
    abp.event.off('save');
    abp.event.on('save', function () {
        dialog.close();
        reloadTable();
    });
}
//点击删除按钮
function del(id) {
    abp.ajax({
        url: '/department/delete',
        data: JSON.stringify({ id: id })
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
//跳转权限分配页面
function permission(id, name) {
    var url = '/department/prepare_permission';
    location.href = url;
}

function batchDel() {
    var checkNodesId = tab.getCheckNodesId();
    if (checkNodesId.length == 0) {
        warn($.i18n.prop("no.selected.data"))
        return;
    }
    abp.message.confirm($.i18n.prop('A102DeleteMenuConfirm'), $.i18n.prop("message.sys.tip"), function (r) {
        if (r) {
            abp.ajax({
                url: '/Sys/SysMenu/BatchDelete',
                data: JSON.stringify(tab.getCheckNodesId())
            }).done(function (result) {
                success(L(LType.DeleteSuccess));
                bindTree();
                reloadTable();
            });
        }
    });
}