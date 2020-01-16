(function ($) {
    'use strict';
    var hj=hj||{};
    hj.bootstrapTableDefaults = {
        //height:300,
        striped: false,
        classes: 'table table-striped table-advance table-hover',
        pagination: true,
        contentType:'application/x-www-form-urlencoded',
        cache: false,
        sidePagination: 'server',
        uniqueId: 'id',
        showRefresh: false,
        search: false,
        method: 'post',
        pageSize: 15,
        //stickyHeader: true,
    //stickyHeaderOffsetY: '35px',
        pageList:[10,15,20,50,100],
        responseHandler: function (data) {
            if (data.__abp && data.unAuthorizedRequest) {
                if (data.targetUrl) {
                    location.href = data.targetUrl;
                }
            }
            return data;
        } 
    };

    $.extend($.fn.bootstrapTable.defaults, hj.bootstrapTableDefaults);
})(jQuery);