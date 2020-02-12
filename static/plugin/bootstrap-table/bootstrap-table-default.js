(function($) {
    'use strict';
    var hj = hj || {};
    var locale = "zh_CN";
    hj.bootstrapTableDefaults = {
        //height:300,
        locale:locale,
        striped: false,
        classes: 'table table-striped table-advance table-hover',
        pagination: true,
        contentType: 'application/x-www-form-urlencoded',
        cache: false,
        sidePagination: 'server',
        uniqueId: 'id',
        showRefresh: false,
        search: false,
        method: 'get',
        pageSize: 10,
        //stickyHeader: true,
        //stickyHeaderOffsetY: '35px',
        pageList: [10, 15, 20, 50, 100],
        responseHandler: function(data) {
            return {
                "rows": data.data,
                "total": data.page.totalCount // 数据条数, 用来配置分页
            };
        }
    };

    $.extend($.fn.bootstrapTable.defaults, hj.bootstrapTableDefaults);
})(jQuery);