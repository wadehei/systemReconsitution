var dateOption = {
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
};
 
$(function () {
  
    var dateTimeInput = jQuery('.bs-datetime');
    if (dateTimeInput) {
        $.each(dateTimeInput, function () {
            var that = $(this);
            var thatOption = dateOption;
            var dateTimeInputBtn = that.next();
            if (that.attr('format')) {
                var format = that.attr('format');
                thatOption.format = format;
                if (format == 'yyyy-mm-dd hh:ii:ss') {
                    thatOption.minView = 0;
                    thatOption.maxView = 4;
                } else if (format == 'hh:ii:ss') {
                    thatOption.minView = 0;
                    thatOption.startView = 0;
                    thatOption.maxView = 0;
                }
            }
            if (that.attr("data-start-date")) {
                thatOption.startDate = that.data("start-date");
            }
            if (that.attr("data-end-date")) {
                thatOption.startDate = that.data("end-date");
            }
            if (that.attr("data-init-date")) {
                thatOption.initialDate = that.data("init-date");
            }
            that.datetimepicker(thatOption).on('changeDate', function (ev) {
                if (that.hasClass('nosecond'))
                    that.val(moment(ev.date).format('YYYY-MM-DD HH:mm'));
            });
            dateTimeInputBtn.click(function () {
                that.datetimepicker("show");
            });
        });
    }

    var timePickers = $('.timepicker');
    if (timePickers) {
        timePickers.timepicker({ autoclose: !0, minuteStep: 5, showSeconds: !1, showMeridian: !1 });
        timePickers.parent(".input-group").on("click", ".input-group-btn",
            function (t) {
                t.preventDefault();
                $(this).parent(".input-group").find(".timepicker").timepicker("showWidget");
            })
    }
});