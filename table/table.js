

// 提交
function submit() {
    var allChecked = $('.content_box input:checked');
    var idArr = [];
    allChecked.each(function (index, item) {
        idArr.push(item.value);
    })
    console.log(idArr.join(','));
}
$(function () {
    // 点击选中事件
    $('.content_box').on('click', '.ckbox', function () {
        var $t = $(this);
        //当前选中的等级
        var level = $t.attr('data-level');
        // 当前选中input选中状态
        var checkBool = $t.attr('data-bool');
        if ($t.attr('data-bool') == 'true') {
            $t.children('input').removeAttr("checked");
            $t.attr('data-bool', 'false');
        } else {
            $t.children('input').attr('checked', 'true');
            $t.attr('data-bool', 'true');
        }
        if (level == 1) {
            nextLevel($t, level, checkBool);
        } else if (level == 3) {
            upLevel($t, level, checkBool);
        } else {
            nextLevel($t, level, checkBool);
            upLevel($t, level, checkBool);
        }
    });
    // 遍历下一级权限列表进行操作
    function nextLevel($t, level, checkBool) {
        if (level == 1) {
            if (checkBool == "true") {
                $t.parent().siblings('.two_level').children('.two_box').children('.two')
                    .children('.ckbox').attr('data-bool', 'false');
                $t.parent().siblings('.two_level').children('.two_box').children('.two')
                    .children('.ckbox').children('input').removeAttr("checked");
                $t.parent().siblings('.two_level').children('.two_box').children('.two')
                    .siblings('.three_level').children('.ckbox').attr('data-bool', 'true');
                $t.parent().siblings('.two_level').children('.two_box').children('.two')
                    .siblings('.three_level').children('.three').children('.ckbox').children('input').removeAttr("checked");
            } else {
                $t.parent().siblings('.two_level').children('.two_box').children('.two')
                    .children('.ckbox').attr('data-bool', 'true');
                $t.parent().siblings('.two_level').children('.two_box').children('.two')
                    .children('.ckbox').children('input').attr("checked", 'true');
                $t.parent().siblings('.two_level').children('.two_box').children('.two')
                    .siblings('.three_level').children('.ckbox').attr('data-bool', 'false');
                $t.parent().siblings('.two_level').children('.two_box').children('.two')
                    .siblings('.three_level').children('.three').children('.ckbox').children('input').attr("checked", 'true');
            }
        } else if (level == 2) {
            if (checkBool == "true") {
                $t.parent().siblings('.three_level').children('.three')
                    .children('.ckbox').attr('data-bool', 'false');
                $t.parent().siblings('.three_level').children('.three')
                    .children('.ckbox').children('input').removeAttr("checked");
            } else {
                $t.parent().siblings('.three_level').children('.three')
                    .children('.ckbox').attr('data-bool', 'true');
                $t.parent().siblings('.three_level').children('.three')
                    .children('.ckbox').children('input').attr("checked", 'true');
            }
        } else if (level == 3) {
        }
    }
    // 遍历上一级
    function upLevel($t, level, checked) {
        if (level == 3) {
            eachThreeLevel($t, level, checked);
        } else if (level == 2) {
            eachTwoLevel($t, level, checked);
        }
    }
    // 遍历当前级别为2是否为全选
    function eachTwoLevel($t, level, checked) {
        var $nowLevelInput = $t.parents('.two_level').children('.two_box').children('.two').children('.ckbox').children('input');
        var $nowNotChecked = $nowLevelInput.not("input:checked");
        if ($nowLevelInput.length == $nowNotChecked.length) {
            $t.parents('.one_level').children('.one_box').children('.ckbox').attr('data-bool', 'false');
            $t.parents('.one_level').children('.one_box').children('.ckbox').children('input').removeAttr('checked');
        } else {
            $t.parents('.one_level').children('.one_box').children('.ckbox').attr('data-bool', 'true');
            $t.parents('.one_level').children('.one_box').children('.ckbox').children('input').attr('checked', 'true');
        }
    }
    // 遍历当前级别为3是否为全选
    function eachThreeLevel($t, level, checked) {
        // 当前级别所有input
        var $nowLevelInput = $t.parents('.three_level').children('.three').children('.ckbox').children('input');
        var $nowNotChecked = $nowLevelInput.not("input:checked");
        if ($nowLevelInput.length == $nowNotChecked.length) {
            $t.parents('.two_box').children('.two').children('.ckbox').attr('data-bool', 'false');
            $t.parents('.two_box').children('.two').children('.ckbox').children('input').removeAttr('checked');
        } else {
            $t.parents('.two_box').children('.two').children('.ckbox').attr('data-bool', 'true');
            $t.parents('.two_box').children('.two').children('.ckbox').children('input').attr('checked', 'true');
        }
        eachTwoLevel($t, level, checked);
    }
    // 平台列表
    var listOne = [];
    // 某个平台内以及功能列表
    var listArr = [];
    function compare(x, y) {
        if (x.id < y.id) {
            return -1;
        } else if (x.id > y.id) {
            return 1;
        } else {
            return 0;
        }
    }
    // 获取一级
    getOne(jsonData);
    function getOne(list) {
        var listLen = list.length;
        var indexArr = [];
        list.find(function (item, index, arr) {
            if (item.parentId == 0) {
                indexArr.push(index);
                item.children = [];
                listOne.push(item);
            }
        })
        // list = list.compare()
        listOne = listOne.splice(0, 1);
        for (var i = 0; i < indexArr.length; i++) {
            list.splice(0, 1);
        }
        indexArr = [];
        list.find(function (item, index, arr) {
            if (listOne[0].id == item.parentId) {
                item.children = [];
                listArr.push(item);
                indexArr.push(index);
            }
        })
        for (var i = 0; i < listArr.length; i++) {
            list.find(function (item, index, arr) {
                if (item.parentId == listArr[i].id) {
                    item.children = [];
                    listArr[i].children.push(item);
                }
            })
        }
        for (var i = 0; i < listArr.length; i++) {
            for (var j = 0; j < listArr[i].children.length; j++) {
                list.find(function (item, index, arr) {
                    if (listArr[i].children[j].id == item.parentId) {
                        item.children = [];
                        listArr[i].children[j].children.push(item);
                        indexArr.push(index);
                    }
                })
            }
        }
        var html = template("test", { listArr: listArr });
        $('.content_box').html(html);
    }
});