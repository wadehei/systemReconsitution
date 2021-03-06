; (function ($, window, document, undefined) {
    $.hj_controller = function () {
        if ($('.controller_content .menu_one').length > 0) {
            $('.controller_content').removeClass('controller_open').addClass('controller_close');
            setTimeout(() => {
                $('.controller_content').empty();
            $('.controller_bg').removeClass('controller_bg_shade');
            }, 500);
        } else {
            var controllerHtml = template("menuIdOne", { controllerList: controllerList.data })
            $('.controller_content').html(controllerHtml);
            $('.controller_content').removeClass('controller_close').addClass('controller_open');
            $('.controller_bg').addClass('controller_bg_shade');
        }
    }
    $.fn.hj_controller = function () {
        new $.hj_controller(this);
        return this
    }
})(jQuery, window, document)