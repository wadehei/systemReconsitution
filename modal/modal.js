; (function ($, window, document, undefined) {
    $.hj_Modal = function (ele, ID, type, size) {
        if (type == 'open') {
            if (size == 'lg') {
                modalSize = 'modal-lg';
            } else if (size == 'sm') {
                modalSize = 'modal-sm';
            } else {
                modalSize = '';
            }
            var modalHtml = '<div class="modal fade" id="' + ID + '" tabindex="-1" role="dialog" data-show="false" aria-labelledby="exampleModalLabel" aria-hidden="true">' +
                '<div class="modal-dialog ' + modalSize + '" role="document">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h5 class="modal-title" id="exampleModalLabel">Modal title</h5>' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div>content</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
                '<button type="button" class="btn btn-primary">Save changes</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $('body').append(modalHtml);
            $('#' + ID).modal('show');
        } else if (type == 'close') {
            $('#' + ID).modal('dispose');
        }
    }
    $.fn.hj_Modal = function (ID, type, size) {
        new $.hj_Modal(this, ID, type, size)
        return this
    }
})(jQuery, window, document)