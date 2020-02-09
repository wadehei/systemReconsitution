var abp = abp || {};
(function () {

    if (!toastr) {
        return;
    }

    /* DEFAULTS *************************************************/

    toastr.options.positionClass = 'toast-top-center';
    toastr.options.extendedTimeOut = 0;
    toastr.options.timeOut = 1000;

    /* NOTIFICATION *********************************************/

    var showNotification = function (type, message, title, options) {
        top.toastr[type](message, title, options);
    };

    abp.notify.success = function (message, title, options) {
        showNotification('success', message, title, options);
    };

    abp.notify.info = function (message, title, options) {
        showNotification('info', message, title, options);
    };

    abp.notify.warn = function (message, title, options) {
        showNotification('warning', message, title, options);
    };

    abp.notify.error = function (message, title, options) {
        showNotification('error', message, title, options);
    };

})();