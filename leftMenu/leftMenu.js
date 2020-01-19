
$(function () {
    var menuHtml = template("menuId", { menuList: menuList });
    // var menuHtml = template("menuId", { menuList: controllerList });
    $('.hj_menu_container').html(menuHtml);
    // 展开与隐藏
    $('.hj_menu_container').on('click', '.menu_item', function () {
        var $this = $(this);
        console.log($this.attr('data-bool'), $this.attr('data-level'), $this.attr('data-length'));
        // 当前选项子菜单长度(0=无)
        var currMenuChild = $this.attr('data-length');
        // 获取当前菜单等级
        var currMenuLevel = $this.attr("data-level");
        // 当前菜单是否展开
        var currMenuBool = Number($this.attr("data-bool"));
        // 当前为一级菜单时
        if (currMenuLevel == 1) {
            if (currMenuBool == 1) {
                packTwo($this, currMenuBool);
                // 箭头向下
                arrowsDown($this, currMenuLevel, currMenuChild, currMenuBool);
            } else if (currMenuBool == 0) {
                spreadTwo($this, currMenuBool);
                // 箭头向上
                arrowsUp($this, currMenuLevel, currMenuChild);
            }
        }
        // 当前为二级菜单时
        else if (currMenuLevel == 2) {
            if (currMenuBool == 1) {
                packThree($this, currMenuBool);
                // 箭头向下
                arrowsDown($this, currMenuLevel, currMenuChild);
            } else if (currMenuBool == 0) {
                spreadThree($this, currMenuBool);
                // 箭头向上
                arrowsUp($this, currMenuLevel, currMenuChild);
            }
        } else if (currMenuLevel == 3) {
            $this.addClass("active_three");
            $this.parent().siblings(".menu_three").children(".menu_item").removeClass("active_three");
            arrowsUp($this, currMenuLevel, currMenuChild);
        }
    });
    // 箭头向上动画
    function arrowsUp($this, currMenuLevel, currMenuChild) {
        if (currMenuLevel == 1) {
            // 当前为一级菜单时
            if (currMenuChild > 0) {
                $this.children(".menu_arrows").removeClass("arrows_down").addClass("arrows_up");
            }
            // 其它一级菜单箭头向下
            $this.parent().siblings(".menu_one").children('.menu_item').children(".menu_arrows").removeClass("arrows_up").addClass("arrows_down");
            // 其他二级菜单箭头向下
            $this.parent().siblings(".menu_one").children(".menu_two").children(".menu_item").children(".menu_arrows").removeClass('arrows_up').addClass("arrows_down");
            // 其他二级菜单三级菜单去除样式
            $this.parent().siblings(".menu_one").children(".menu_two").children(".menu_item").removeClass("active_two").removeClass("active_three");
            $this.parent().siblings(".menu_one").children(".menu_two").children(".menu_item").children('.menu_arrows').attr('src', './icon/arrows.png');
            $this.parent().siblings(".menu_one").children(".menu_two").children(".menu_three").children(".menu_item").removeClass("active_three");
        } else if (currMenuLevel == 2) {
            // 当前为二级菜单时
            if (currMenuChild > 0) {
                $this.children(".menu_arrows").removeClass("arrows_down").addClass("arrows_up");
                $this.children(".menu_arrows").attr('src', './icon/arrows-active.png');
                $this.addClass("active_two");
            } else {
                $this.addClass("active_three");
            }
            // 同级其他箭头向下
            $this.parent().siblings(".menu_two").children(".menu_item").children(".menu_arrows").removeClass("arrows_up").addClass("arrows_down");
            $this.parent().siblings(".menu_two").children('.menu_item').removeClass("active_two").removeClass("active_three");
            $this.parent().siblings(".menu_two").children(".menu_item").children(".menu_arrows").attr('src', './icon/arrows.png');
            $this.parent().siblings(".menu_two").children(".menu_three").children(".menu_item").removeClass('active_three');
        }
    }
    // 箭头向下动画
    function arrowsDown($this, currMenuLevel, currMenuChild) {
        if (currMenuLevel == 1) {
            // 当前为一级菜单时
            $this.children(".menu_arrows").removeClass('arrows_up').addClass("arrows_down");
            // 当前一级菜单下箭头向下
            $this.parent().children(".menu_two").children(".menu_item").children('.menu_arrows').removeClass("arrows_up").addClass("arrows_down");
            $this.parent().children(".menu_two").children(".menu_item").removeClass("active_two");
            $this.parent().children(".menu_two").children(".menu_item").children(".menu_arrows").attr('src', './icon/arrows.png');
        } else if (currMenuLevel == 2) {
            // 当前为二级菜单时
            $this.children('.menu_arrows').removeClass("arrows_up").addClass("arrows_down");
        }

    }
    // 展开二级菜单
    function spreadTwo($this, currMenuBool) {
        $this.parent(".menu_two").removeClass("overflow");
        $this.siblings('.menu_two').animate({
            height: '40px'
        }, 'fast', function () {
            $this.attr('data-bool', 1);
        })
        // 先关闭其他三级菜单
        $this.parent().siblings('.menu_one').children(".menu_two").children(".menu_three").animate({
            height: '0px'
        }, 'fast', function () {
            $this.parent().siblings(".menu_one").children(".menu_two").children(".menu_three").addClass("overflow");
            $this.parent().siblings(".menu_one").children(".menu_two").children(".menu_item").attr("data-bool", 0);
        })
        // 关闭同级二级菜单
        $this.parent().siblings(".menu_one").children('.menu_two').animate({
            height: '0px'
        }, 'fast', function () {
            $this.parent().siblings(".menu_one").children('.menu_two').addClass("overflow");
            $this.parent().siblings(".menu_one").children(".menu_item").attr('data-bool', 0);
        })
    }
    // 展开三级菜单
    function spreadThree($this, currMenuBool) {
        // 展开当前三级菜单
        $this.parent(".menu_two").removeClass("overflow");
        $this.siblings(".menu_three").animate({
            height: '40px'
        }, 'fast', function () {
        })
        $this.parent(".menu_two").animate({
            height: ($this.siblings('.menu_three').length + 1) * 40 + 'px'
        }, 'fast', function () {
            // $this.removeClass("overflow");
            $this.attr('data-bool', 1)
        })
        // 关闭同级三级菜单
        $this.parent().siblings(".menu_two").animate({
            height: '40px'
        }, 'fast', function () {
            $this.parent().siblings(".menu_two").addClass("overflow");
            $this.parent().siblings(".menu_two").children("menu_item").attr('data-bool', 0);
        })
        $this.parent().siblings(".menu_two").children(".menu_three").animate({
            height: '0px'
        }, 'fast', function () {
            $this.parent().siblings(".menu_two").children(".menu_three").addClass("overflow")
            $this.parent().siblings(".menu_two").children(".menu_item").attr("data-bool", 0);
        })
        // 关闭其他三级菜单
        $this.parent().parent().siblings(".menu_one").children('.menu_two').children(".menu_three").animate({
            height: '0px',
        }, 'fast', function () {
            $this.parent().parent().siblings(".menu_one").children('.menu_two').children(".menu_three").addClass("overflow");
            $this.parent().parent().siblings(".menu_one").children('.menu_two').children(".menu_item").attr('data-bool', 0);
        })
        // 关闭其他二级菜单
        $this.parent().parent().siblings(".menu_one").children(".menu_two").animate({
            height: '0px'
        }, 'fast', function () {
            $this.parent().parent().siblings(".menu_one").children(".menu_item").attr('data-bool', 0);
            $this.parent().parent().siblings(".menu_one").children(".menu_two").addClass("overflow");
        })
    }
    // 收起二级菜单
    function packTwo($this, currMenuBool) {
        $this.siblings('.menu_two').children(".menu_three").animate({
            height: '0px'
        }, 'fast', function () {
            $this.siblings(".menu_two").children(".menu_three").addClass("overflow");
            $this.siblings(".menu_two").children(".menu_item").attr("data-bool", 0);
        })
        $this.siblings(".menu_two").animate({
            height: '0px'
        }, 'fast', function () {
            $this.siblings(".menu_two").addClass("overflow");
            $this.attr('data-bool', 0);
        });
    }
    // 收起三级菜单
    function packThree($this, currMenuBool) {
        $this.siblings(".menu_three").animate({
            height: '0px'
        }, 'fast', function () {
            $this.siblings(".menu_three").addClass("overflow");
        })
        $this.parent().animate({
            height: '40px'
        }, 'fast', function () {
            $this.parent().addClass("overflow");
            $this.attr('data-bool', 0);
        });
    }
})