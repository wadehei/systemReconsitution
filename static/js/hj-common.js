(function () {
    if (typeof window.hjly === 'undefined') {
        var hjly = {
            config: {
                language: undefined
            },
            init: function (language) {
                hjly.config.language = language;
                this.i18n();
            },
            i18n: function (callback) {
                callback = callback ? callback : this.replace;
                jQuery.i18n.properties({
                    name: 'strings', //资源文件名称
                    path: '/i18n/', //资源文件路径
                    mode: 'map', //用Map的方式使用资源文件中的值
                    language: hjly.config.language,
                    callback: callback
                });
            },
            replace:function () {
                $(document).ready(function () {
                    $(".i18n").each(function(i,item){
                        var $item = $(item),name = $item.attr("i18n-name");
                        var i18nName = $.i18n.prop(name);
                        switch ($item.get().tagName) {
                            case 'INPUT':
                                $item.attr({"placeholder":i18nName});
                                break;
                            default:
                                $item.text(i18nName);
                        }
                    });
                });

            }
        };
        window.hjly = hjly;
    }
})();
$(document).ready(function () {
    //下拉搜索
    /**
     * 标准select
     */
    $('.hj-select-picker').not('.hj-ignore').not(".init").each(function (i,data) {
        var $this = $(data);
        $this.not('.hj-ignore').selectpicker();
        $this.addClass("init");
    });



    $('.modal form').find('input[type=text]').not(".init").each(function () {
        var $this = $(this);
        var maxLength = $this.attr('maxLength');
        if (maxLength) {
            $this.maxlength({
                threshold: maxLength > 10 ? 10 : maxLength,
                appendToParent:true
            });
        }
        $this.addClass('init');
    });
    //启用禁用按钮
    // $('input.hj-switch[type=checkbox]').not('.hj-ignore').not(".init").each(function (i,data) {
    //     var $this = $(data);
    //     $this.not('.hj-ignore').bootstrapSwitch();
    //     $this.addClass("init");
    // });
});

/**
 *----表格按钮start
 */
var split = '&nbsp;&nbsp;&nbsp;&nbsp;';
//通用编辑按钮
var editButton = function (id, action, text) {
    return opButton(action ? action : 'edit', id, text ? text : $.i18n.prop('edit'));
};
//通用删除按钮
var delButton = function (id, action, text) {
    return opButton(action ? action : 'del', id, text ? text : $.i18n.prop('delete'));
};
//普通操作列按钮
var opButton = function (actionName, id, text) {
    return '<a href="javascript:void(0)" onclick="' + actionName + '(\'' + id + '\')" title="' + text + '"> ' + text + '</a>';
};
//通用启用/禁用按钮
var enableButton = function (id, val) {
    return '<input type="checkbox" data-id="' + id + '" class="hj-switch make-switch" data-on-text="' + $.i18n.prop('enable') + '"  data-size="mini" data-off-text="' +$.i18n.prop('disable') + '"' + (val == 1 ? 'checked' : '') + '>';
};

//表格选中的行
function getSelect(tab) {
    var rows = tab.bootstrapTable('getAllSelections');
    if (rows.length == 0) {
        var text = $.i18n.prop("modal.no.selected.data");
        warn(text)
        return null;
    }
    return rows;
}
/**
 *
 * @param offset 从第几行开始
 * @param limit  每页多少行数据
 */
function offsetToPage(params){
    if(typeof params == "undefined"){
        return 1;
    }
    return parseInt(params.offset/params.limit) + 1
}

/**
 *---表格按钮end
 */



/**
 *----提示框start
 */

/**
 * 成功提示
 * @param {string} msg
 */
function success(msg, action) {
    abp.notify.success(msg, null, action);
}

/**
 * 错误提示
 * @param {any} msg
 */
function error(msg, action) {
    abp.notify.error(msg, null, action);
}

/**
 * 普通信息提示
 * @param {any} msg
 */
function info(msg, action) {
    abp.notify.info(msg, null, action);
}

/**
 * 警告提示
 * @param {string} msg
 */
function warn(msg, action) {
    abp.notify.warn(msg, null, action);
}

abp.message.info = function (message, title, action) {
    bootbox.dialog({
        title: title,
        message: message,
        buttons: {
            ok: {
                label: $.i18n.prop("modal.ok"),
                className: 'btn-info',
                callback: function () {
                    if (action) action();
                }
            }
        }
    });
};

abp.message.success = function (message, title, action) {
    bootbox.dialog({
        title: title,
        message: message,
        buttons: {
            ok: {
                label: $.i18n.prop("modal.ok"),
                className: 'btn-success',
                callback: function () {
                    if (action) action();
                }
            }
        }
    });
};

abp.message.warn = function (message, title, action) {
    bootbox.dialog({
        title: title,
        message: message,
        buttons: {
            ok: {
                label: $.i18n.prop("modal.ok"),
                className: 'btn-warning',
                callback: function () {
                    if (action) action();
                }
            }
        }
    });
};

abp.message.error = function (message, title, action) {
    bootbox.dialog({
        title: title,
        message: message,
        className: "modal-error",
        buttons: {
            ok: {
                label: $.i18n.prop("modal.ok"),
                className: 'btn-danger',
                callback: function () {
                    if (action) action();
                }
            }
        }
    });
};

function confirm(msg, callback) {
    confirm(msg, $.i18n.prop("modal.sys.tip"), callback);
}

function confirm(msg, title, callback) {
    var labelOK = $.i18n.prop("modal.ok");
    var labelCancel = $.i18n.prop("modal.cancel");
    bootbox.confirm({
        title: title,
        message: msg,
        buttons: {
            confirm: {
                //label: '<i class=\"fa fa-check\"></i>确定',
                label: labelOK,
                className: 'btn-success'
            },
            cancel: {
                //label: '<i class=\"fa fa-reply\"></i>取消',
                label: labelCancel,
                className: 'btn-default'
            }
        },
        callback: function (r) {
            callback(r);
        }
    })
}

abp.message.confirm = function (msg, title, callback) {
    confirm(msg, title, callback);
}

/**
 *----提示框end
 */


/**
 *----弹框start
 */

var currentCallback;//当前弹出框对象的回调
/*
 @param      url：弹出框远程页面地址
 @param    title: 弹出框标题
 @param   action: 弹出框回调
 @param cssClass: 弹出框样式，主要用于控制宽度
 */
function openDialog(url, title, cssClass, callback) {
    var dialog;
    abp.ajax({
        url: url,
        type: 'get',
        async: false,
        dataType: "html"
    }).done(function (res) {
        try {
            var obj = JSON.parse(res);
            if (obj.__abp && obj.unAuthorizedRequest) {
                location.href = obj.targetUrl;
            }
        } catch (e) {

            dialog = new BootstrapDialog({
                title: "菜单",
                closeByBackdrop: false,
                draggable: true,
                animate: true,
                autodestroy: true,
                cssClass: cssClass ? cssClass : 'dialog-800',
                message: $('<div></div>').html(res),
                onshown: function (_dialog) {//Modal限时完成之后再渲染bootstrap-select控件，要不然会不显示
                    // $('.selectpicker').not('.rpt-selectpicker').selectpicker();
                    // if (typeof setModalHeight == "function") {
                    //     if ($(".modal table[id]").length <= 0) {
                    //
                    //     } else {
                    //         $(".modal table[id]").on("load-success.bs.table", function () {
                    //
                    //             setModalHeight();
                    //         })
                    //
                    //     }
                    //
                    // }
                    // if (typeof callback == "function") {
                    //     callback();
                    // }

                }
            });
            dialog.open();
        }

    });
    return dialog;
}
function openDialogBypost(url, title, data, cssClass) {
    var dialog;
    abp.ajax({
        url: url,
        type: 'post',
        async: false,
        data: data,
        dataType: "html",
    }).done(function (res) {
        try {
            // var obj = JSON.parse(res);
            // if (obj.__abp && obj.unAuthorizedRequest) {
            //     location.href = obj.targetUrl;
            // }
        } catch (e) {
            dialog = new BootstrapDialog({
                title: title,
                closeByBackdrop: false,
                draggable: true,
                animate: true,
                autodestroy: true,
                cssClass: cssClass ? cssClass : 'dialog-800',
                message: $('<div></div>').html(res),
                onshown: function (_dialog) {//Modal限时完成之后再渲染bootstrap-select控件，要不然会不显示
                    $('.selectpicker').selectpicker();
                }
            });
            dialog.open();
        }

    });
    return dialog;
}

/*
 @param      url：弹出框远程页面地址
 @param    title: 弹出框标题
 @param   action: 弹出框回调
 @param cssClass: 弹出框样式，主要用于控制宽度
 */
function openDialog1(url, title) {
    return openDialog(url, title, 'dialog-600');
}

/*
 @param      url：弹出框远程页面地址
 @param    title: 弹出框标题
 @param   action: 弹出框回调
 @param cssClass: 弹出框样式，主要用于控制宽度
 */
function openDialog2(url, title) {
    return openDialog(url, title, 'dialog-800');
}

/*
 @param      url：弹出框远程页面地址
 @param    title: 弹出框标题
 @param   action: 弹出框回调
 @param cssClass: 弹出框样式，主要用于控制宽度
 */
function openDialog3(url, title) {
    return openDialog(url, title, 'dialog-1180');
}

/*
 @param      url：弹出框远程页面地址
 @param    title: 弹出框标题
 @param   action: 弹出框回调
 @param cssClass: 弹出框样式，主要用于控制宽度
 */
function openDialog4(url, title) {
    return openDialog(url, title, 'dialog-1100');
}

/*
 @param      url：弹出框远程页面地址
 @param    title: 弹出框标题
 @param   action: 弹出框回调
 @param cssClass: 弹出框样式，主要用于控制宽度
 */
function openDialog5(url, title) {
    return openDialog(url, title, 'dialog-1200');
}


var $form;
function save(that) {
    if ($form == undefined)
        abp.notify.error($.i18n.prop('FormIDNotExist'));
    //去掉必选输入框的空格
    $form.find("r").parents(".form-group").find("input").each(function (i, input) {
        var _input = $(input);
        var value = $.trim(_input.val());
        _input.val(value);
    });
    if (!$form.valid()) return;

    var formData = $form.serializeFormToObject(); //serializeFormToObject is defined in main.js
    abp.ajax({
        url: $form.attr('action'),
        data: JSON.stringify(formData)
    }).done(function (json) {
        success($.i18n.prop("save.success"));
        abp.event.trigger('save');
    }).fail(function (json) {
        abp.notify.error(json.desc);
    }).always(function () {

    });
}

/**
 *----弹框end
 */

/*
 全局按键控制
 */

$("#filterLeft").keypress(function (e) {
    if (e.which == 13) {
        if(typeof reloadTableLeft == "function"){
            reloadTableLeft();
        }
    }
});
$("#filterRight").keypress(function (e) {
    if (e.which == 13) {
        if(typeof reloadTableRight == "function") {
            reloadTableRight();
        }
    }
});

//全局popover控制
$("#identifier").popover({html: true});


$.fn.serializeFormToObject = function () {

    //serialize to array
    var data = $(this).serializeArray();

    //add also disabled items
    $(':disabled[name]', this).each(function () {
        data.push({ name: this.name, value: $(this).val() });
    });
    //map to object
    var obj = {};
    data.map(function (x) {
        obj[x.name] = x.value;
    });
    return obj;
};
