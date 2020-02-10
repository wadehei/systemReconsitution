/**
 * Created by DELL on 2020/2/10.
 */
var tabLeft = $('#tabListLeft').bootstrapTable({
    pagination: false,
    url: './data.json',
    queryParams: function (params) {
        return getQueryLeft(params);
    },
    onDblClickRow: function (row) {
        var arr = new Array();
        arr.push(row.companyID);
        doAddEmp({
            FaceServerID: $('#hdFaceServerID').val(),
            ListCompanyID: arr
        });
    },
    onLoadSuccess: function (data) {
        // $('#leftTotal').text(data.length);
        // paginationHeightClick('#tabListLeft', setTableObj);
    }
});

function getQueryLeft(params) {
    return {
        filter: $('#filterLeft').val(),
        FaceServerID: $('#hdFaceServerID').val()
    }
}

function reloadTableLeft() {
    tabLeft.bootstrapTable('refresh');
}

var tabRight = $('#tabListRight').bootstrapTable({
    pagination: false,
    url: './data.json',
    queryParams: function (params) {
        return getQueryRight(params);
    },
    onLoadSuccess: function (data) {
        $('#lbTotal').text(data.length);
        // paginationHeightClick('#tabListRight', setTableObjRight);
    },
    onDblClickRow: function (row) {
        var arr = new Array();
        arr.push(row.companyID);
        doRemoveEmp({
            FaceServerID: $('#hdFaceServerID').val(),
            ListCompanyID: arr
        });
    }
});

function getQueryRight(params) {
    return {
        filter: $('#filterRight').val(),
        FaceServerID: $('#hdFaceServerID').val()
    }
}
function reloadTableRight() {
    tabRight.bootstrapTable('refresh');
}

function addEmp() {
    var rows = getSelect(tabLeft);
    if (rows == null) return;

    var arr = new Array();
    $.each(rows, function (i, item) {
        arr.push(item.companyID);
    });

    var data = {
        FaceServerID: $('#hdFaceServerID').val(),
        ListCompanyID: arr
    };

    doAddEmp(data);
}

function doAddEmp(data) {
    abp.ajax({
        url: '/Sys/FaceServer/AlloCompany',
        data: JSON.stringify(data)
    }).done(function (result) {
        success(L(LType.SaveSuccess));
        reloadTableLeft();
        reloadTableRight();
    });
}

function removeEmp() {
    var rows = getSelect(tabRight);
    if (rows == null) return;

    var arr = new Array();
    $.each(rows, function (i, item) {
        arr.push(item.companyID);
    });

    var data = {
        FaceServerID: $('#hdFaceServerID').val(),
        ListCompanyID: arr
    };

    doRemoveEmp(data);
}

function doRemoveEmp(data) {
    abp.ajax({
        url: '/Sys/FaceServer/RemoveCompany',
        data: JSON.stringify(data)
    }).done(function (result) {
        // success(LType.SaveSuccess));
        reloadTableLeft();
        reloadTableRight();
    });
}
//添加的内容
$("#identifier").popover({html: true})

$("#filterLeft").keypress(function (e) {

    if (e.which == 13) {
        reloadTableLeft();
    }
});
$("#filterRight").keypress(function (e) {
    if (e.which == 13) {
        reloadTableRight();
    }
});
