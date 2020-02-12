//treeName为树div名称，url为数据源地址，checkbox为是否显示复选框，loadedfunction为加载完毕的回调函数
function bindJsTree(treeName, url, checkbox, loadedfunction) {
    var control = $('#' + treeName)
    control.data('jstree', false); //清空数据，必须

    var isCheck = arguments[2] || false; //设置checkbox默认值为false
    if (isCheck) {
        //复选框树的初始化
        $.post(url, function(data) {
            control.jstree({
                'plugins': ["checkbox"], //出现选择框
                'checkbox': { cascade: "", three_state: false }, //不级联
                'core': {
                    'data': data,
                    "themes": {
                        "responsive": false
                    }
                }
            }).bind('loaded.jstree', loadedfunction).bind("open_node.jstree", function() {

            });
            control.on("open_node.jstree", function(e, data) {
                //此处如何获取ID
            });
        });
    } else {
        //普通树列表的初始化
        $.post(url, function(data) {
            control.jstree({
                'core': {
                    'data': data,
                    "themes": {
                        "responsive": false
                    }
                }
            }).bind('loaded.jstree', loadedfunction).bind("open_node.jstree", function() {

            });

            control.on("open_node.jstree", function(e, data) {
                //此处如何获取ID
            });
        });
    }
}

/*
id          : 树的id，自己定义
buttonID    : 选择按钮的id,用于绑定下拉框显示事件
inputID     : 输入文本框的id,用于绑定下拉框显示事件
data        : json格式的数据源
onCheck     ：Radiobox/CheckBox选中事件
beforeClick : 单击节点之前事件，如果返回 false，zTree 将不会选中节点，也无法触发 onClick 事件回调函数。
group       ：Readio分组，默认level,在每一级节点范围内单选。all 则在整棵树范围内当单选
CheckBox    ：是否是CheckBox，默认为false
注意：节点选中和Radio和CheckBox选中是两个事件。
*/
function bindZtreeMultiSelect(data, buttonID, inputID, hiddenID, CheckBox) {
    var id = createGUID();
    var _t = null;
    var menuContentID = id + "menuContent";
    var ulid = id + "dropDownListRadio";
    var isCheckBox = CheckBox || false;
    console.log(isCheckBox);
    var dropDownList = '<div id="' + menuContentID + '" class="menuContent" style="display:none; position: absolute;left:0px;top:0px">' +
        '<ul id= "' + ulid + '" class="ztree" style= "margin-top:0; width:220px; height: 300px; border: 1px solid #617775; background: #f0f6e4; overflow-y: scroll; overflow-x: auto;"></ul></div>';
    $('#' + inputID).parent().after(dropDownList);

    //点击空白地方隐藏下拉列表
    var onBodyDown = function(event) {
        if (!(event.target.id == buttonID || event.target.id == inputID || event.target.id == menuContentID || $(event.target).parents("#" + menuContentID).length > 0)) {
            hideDropDownRedio();
            //console.log("bodydownevent");
        }
    }

    //隐藏div 
    var hideDropDownRedio = function() {
        $("#" + menuContentID).fadeOut("fast");
        $("body").unbind("mousedown");
    }

    var showDropDownList = function() {
        var cityObj = $("#" + inputID);
        var cityOffset = cityObj.offset();
        $("#" + menuContentID).css({ width: cityObj.outerWidth(), left: "15px", top: cityObj.outerHeight() + "px" }).slideDown("fast");
        //selectParentDept();
        $("body").bind("mousedown", onBodyDown);
    };

    $("#" + buttonID).bind("click", showDropDownList);
    $("#" + inputID).bind("click", showDropDownList);

    var beforeClick = function(treeId, treeNode) {
        if (treeNode.level < 4) {
            //点击节点选中RadioBox
            _t.checkNode(treeNode, true, null, true);
            return true;
        } else {
            return false;
        }

    }
    var beforeCheck = function(treeId, treeNode) {
        var radio = $(event.target);
        if (radio.attr("class").indexOf("radio_true") >= 0) {
            return false; //禁止点同一个按钮
        } else if (treeNode.level >= 3) {
            error("最多添加三级");
            return false;
        }
        return true;
    }

    var onCheck = function(e, treeId, treeNode) {
        var zTree = _t,
            nodes = zTree.getCheckedNodes(true),
            v = "",
            k = "";
        for (var i = 0, l = nodes.length; i < l; i++) {
            v += nodes[i].name + ",";
            k += nodes[i].id + ",";
        }
        if (v.length > 0) v = v.substring(0, v.length - 1);
        if (k.length > 0) k = k.substring(0, k.length - 1);
        $("#" + inputID).val(v);
        $("#" + hiddenID).val(k);
    }

    var setting = {
        check: {
            enable: true,
            chkStyle: "radio",
        },
        view: {
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeClick: beforeClick,
            beforeCheck: beforeCheck,
            onCheck: onCheck
        }
    };

    if (isCheckBox) {
        setting.check.chkStyle = "checkbox";
    }

    _t = $.fn.zTree.init($("#" + ulid), setting, data);
    return _t;
}


/* 适用有上下级关系的单选列表

data        : json格式的数据源
buttonID    : 选择按钮的id,用于绑定下拉框显示事件
inputID     : 输入文本框的id,用于绑定下拉框显示事件
hiddenID    : 隐藏input的id，用于保存选中节点的value
group       : Readio分组，level,在每一级节点范围内单选。默认 all 则在整棵树范围内当单选
chickHide   : 是否单击选择后隐藏列表，默认ture,
注意：节点选中和Radio和CheckBox选中是两个事件。
*/
function bindZtree(data, buttonID, inputID, hiddenID, group) {

    var _t = null;
    var id = createGUID();

    //绑定下拉列表内容
    var selectParent = function() {
        //选中上级，编辑时选中已分配的
        var selectId = $("#" + hiddenID).val();
        var node = _t.getNodeByParam("id", selectId, null);
        if (node) {
            _t.checkNode(node, true, false);
            $("#" + inputID).val(node.name);
        }
    };

    var beforeClick = function(treeId, treeNode) {
        if (treeNode.level < 4) {
            //点击节点选中RadioBox
            _t.checkNode(treeNode, true, null, true);
            return true;
        } else {
            return false;
        }
    }
    var beforeCheck = function(treeId, treeNode) {
        var radio = $(event.target);
        if (radio.attr("class").indexOf("radio_true") >= 0) {
            return false; //禁止点同一个按钮
        } else if (treeNode.level >= 3) {
            error("最多添加三级");
            return false;
        }
        return true;
    }

    var afterInit = function(treeId) {
        var modal = $("#" + treeId).parents(".modal");
        if (modal.length > 0) {
            $("#" + ulid).attr("require", true).parents(".form-group").find("label").prepend("<r>*</r>");
        }
    }

    var onCheck = function(e, treeId, treeNode) {
        var zTree = _t,
            nodes = zTree.getCheckedNodes(true),
            v = "",
            k = "";
        for (var i = 0, l = nodes.length; i < l; i++) {
            v += nodes[i].name + ",";
            k += nodes[i].id + ",";
        }
        if (v.length > 0) v = v.substring(0, v.length - 1);
        if (k.length > 0) k = k.substring(0, k.length - 1);
        $("#" + inputID).val(v);
        $("#" + hiddenID).val(k);
        //隐藏下拉列表
        hideDropDownRedio();
    }

    var menuContentID = id + "menuContent";
    var radioType = (group == null ? "all" : group)

    //隐藏div 
    var hideDropDownRedio = function() {
        $("#" + menuContentID).fadeOut("fast");
        $("body").unbind("mousedown");
    }

    var ulid = id + "dropDownListRadio";
    var dropDownList = '<div id="' + menuContentID + '" class="menuContent" style="display:none; position: absolute;left:0px;top:0px;">' +
        '<ul id= "' + ulid + '" class="ztree" style= "margin-top:0; width:auto; height: 300px; border: 1px solid #617775; background: #f0f6e4; overflow-y: scroll; overflow-x: auto;"></ul></div>';
    $('#' + inputID).parent().after(dropDownList);

    //点击空白地方隐藏下拉列表
    var onBodyDown = function(event) {
        if (!(event.target.id == buttonID || event.target.id == inputID || event.target.id == menuContentID || $(event.target).parents("#" + menuContentID).length > 0)) {
            hideDropDownRedio();
            //console.log("bodydownevent");
        }
    }

    var showDropDownList = function() {
        var cityObj = $("#" + inputID);
        var cityOffset = cityObj.offset();
        $("#" + menuContentID).css({ width: cityObj.outerWidth(), left: "15px", top: cityObj.outerHeight() + "px" }).slideDown("fast");
        //selectParentDept();
        $("body").bind("mousedown", onBodyDown);
    };




    $("#" + buttonID).bind("click", showDropDownList);
    $("#" + inputID).bind("click", showDropDownList);

    var setting = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: radioType
        },
        view: {
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeClick: beforeClick,
            beforeCheck: beforeCheck,
            onCheck: onCheck
        }
    };
    _t = $.fn.zTree.init($("#" + ulid), setting, data);
    afterInit(ulid);
    selectParent();
}


/*
treeId  ul标签id
data    数据源 {"id": "AA05","name": "参数选项管理", "pId": "","open": false,"isParent": false,"checked": false,"isHidden": false},
onClick 单击事件  onClick(vent, treeId, treeNode, clickFlag)
*/
function bindLeftTree(treeId, data, onClick) {
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClick,
            // onExpand: countDisPlayFlex,
            // onCollapse: countDisPlayFlex
        },
        async: {
            enable: true
        }
    };
    return $.fn.zTree.init($("#" + treeId), setting, data);
}

// 初始化ztree
$(function() {
    initTree();
});


function initTree() {
    var id = "";
    $.ajax({
        url: './static/json/ztree.json',
        type: "GET",
        // data: JSON.stringify({ id: id })
    }).done(function(data) {
        var newNode = { name: "菜单管理", id: "", open: true };
        data.data.push(newNode);
        bindLeftTree("divTree", data.data, onClick);
    });
}

function onClick() {

}