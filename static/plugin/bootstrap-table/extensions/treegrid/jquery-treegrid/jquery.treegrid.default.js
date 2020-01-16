(function ($) {
    //Onchange事件
    $.fn.bindCheck = function (autoCheckParentNode) {
        bindCheckboxEvent.init(this, autoCheckParentNode)
    };
    //选中单个节点，用于赋值
    $.fn.checkNode = function () {
        $(this).closest('tr').addClass('selected').find('input[type=checkbox]').prop('checked', 'checked');
    };
    //获取节点的id值
    $.fn.getNodeId = function () {
        return $(this).treegrid('getNodeId');
    };
    //获取所有已选择的节点
    $.fn.getCheckNodesId = function () {
        var nodes = $(this).treegrid('getAllNodes');
        var arr = new Array();
        $.each(nodes, function (i) {
            if ($(this).closest('tr').hasClass('selected'))
                arr.push({ Id: $(this).getNodeId() });
        });
        return arr;
    };

    var bindCheckboxEvent = {
        init: function (node, autoCheckParentNode) {
            var container = bindCheckboxEvent.getContainer(node);//容器 table，
            var id = $(node).treegrid('getNodeId');//节点ID
            var nodes = bindCheckboxEvent.getNodes(node, id, container);//子节点
            var ck = $(node).closest('tr').hasClass('selected');//当前节点是否选中
            var parentNode = bindCheckboxEvent.getParentNode(node);//父级节点

            if (ck) {
                //选中时，选中所有子节点
                $.each(nodes, function (i) {
                    bindCheckboxEvent.selectNode(nodes[i], container);
                });
                if (autoCheckParentNode != false)
                    //选中父级节点
                    bindCheckboxEvent.checkParentNode(parentNode, container, true);
            } else {
                $.each(nodes, function (i) {
                    bindCheckboxEvent.unSelectNode(nodes[i], container);
                });
                if (autoCheckParentNode != false)
                    bindCheckboxEvent.checkParentNode(parentNode, container, false);
            }
            container.bootstrapTable('resetWidth');
        },

        getContainer: function (node) {
            return $(node).treegrid('getTreeContainer');
        },
        getNodes: function (obj, id, container) {
            return $(obj).treegrid('getChildNodes', id, container);
        },

        getParentNode: function (obj) {
            return $(obj).treegrid('getParentNode');
        },

        checkParentNode: function (node, container, ckFlag) {
            if (ckFlag) {
                if (!$(node).closest('tr').hasClass('selected')) {
                    $(node).closest('tr').addClass('selected').find('input[type=checkbox]').prop('checked', 'checked');
                }
            } else {
                if ($(node).closest('tr').hasClass('selected')) {
                    var id = $(node).treegrid('getNodeId');
                    var childNodes = bindCheckboxEvent.getNodes(node, id, container);
                    var unSelectFlag = true;
                    $.each(childNodes, function (i) {
                        if ($(childNodes[i]).closest('tr').hasClass('selected')) {
                            unSelectFlag = false;
                            return;
                        }
                    });
                    if (unSelectFlag)
                        $(node).closest('tr').removeClass('selected').find('input[type=checkbox]').removeAttr('checked');
                }
            }
        },
        //选中节点和所有子节点。
        selectNode: function (node, container) {
            var tr = $(node).closest('tr');
            tr.addClass('selected').find('input[type=checkbox]').prop('checked', 'checked');
            var id = $(node).treegrid('getNodeId');
            var nodes = bindCheckboxEvent.getNodes(node, id, container);
            $.each(nodes, function (i) {
                bindCheckboxEvent.selectNode(nodes[i], container);
            });

            var parentNode = bindCheckboxEvent.getParentNode(node);
            if (parentNode) {
                var pTr = $(parentNode).closest('tr');
                if (!pTr.hasClass('selected')) {
                    pTr.addClass('selected').find('input[type=checkbox]').prop('checked', 'checked');
                }
            }
        },
        //取消选中节点及所有子节点。
        unSelectNode: function (node, container) {
            var tr = $(node).closest('tr');
            tr.removeClass('selected').find('input[type=checkbox]').removeAttr('checked');
            var id = $(node).treegrid('getNodeId');
            var nodes = bindCheckboxEvent.getNodes(node, id, container);
            $.each(nodes, function (i) {
                bindCheckboxEvent.unSelectNode(nodes[i], container);
            });
        }
    };


})(jQuery);
