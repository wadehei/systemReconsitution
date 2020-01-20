//通过bootstrap-table初始化表格
debugger
var tab = $('#tabList').bootstrapTable({
    url: './static/json/table.json',
    queryParams: function(params) {
        return getQuery(params);
    },
    onLoadSuccess: function(json) {
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
    var copy = '<a  href="javascript:void(0)" onclick="copyAdd(\'' + val + '\')" title="' + L('A155CopyAdd') + '"> ' + L('A155CopyAdd') + '</a>';
    var priceManage = '<a  href="javascript:void(0)" onclick="price(\'' + val + '\',\'' + row.splitManageMode + '\')" title="' + L('A155ProductPrice') + '"> ' + L('A155ProductPrice') + '</a>';
    return edit + split + del + split + copy + split + priceManage;
}