$(function() {
    // 点击左侧的菜单，生成多标签和生成对应的iframe页面
    var nthTabs;
    //基于bootstrap tab的自定义多标签的jquery实用插件，滚动条依赖jquery.scrollbar，图标依赖font-awesome
    nthTabs = $("#editor-tabs").nthTabs();
    var li = $('.nav-item').filter('[data-url]');
    li.click(function() {
        var $this = $(this);
        var id = $this.attr('data-id');
        var text = $this.attr('data-text');
        var url = $this.attr('data-url');
        if (url) {
            // 默认打开首页，并且不生成标签
            if (url.toLowerCase() == 'home') {
                window.open(url);
            } else {
                var tabs = nthTabs.getTabList();
                var unExist = true;
                if (tabs) {
                    $.each(tabs, function(i, item) {
                        if (item.id == ('#' + id)) {
                            nthTabs.setActTab('#' + id).locationTab();
                            unExist = false;
                            return;
                        }
                    });
                }
                //EasyBootstrapTabs.addTab(id, text, url);
                if (unExist) {
                    nthTabs.addTab({
                        id: id,
                        title: text,
                        content: loadIframe(id, url)
                    }).setActTab("#" + id);
                }

                li.removeClass('li-active');
                $(this).addClass('li-active');
                /*
                生成路由
                 */
                concatRouter($this);

                // countFormQuery() //js控制css样式,函数在~/js/common.js内部设置
                // countCustomDetail() //js控制css样式,函数在~/js/common.js内部设置
            }
        }
    });

    // 根据页面找寻菜单的路径并在面包屑中显示
    function concatRouter(nav){
        var $nav = nav;
        var array = [];
        var title = nav.data("text");
        array.push(title);
        var parents = $nav.parents("li");
        while(parents.length > 0){
            parents = parents.parents("li");
            var text = parents.data("text");
            array.push(text)
        }
        var arReverse = array.reverse();
        var html = '<li class="li-before-content"><span class="prePage">参数选项管理</span></li> <li class="li-before-content"><span class="currentPage">平台配置类型</span></li>'
        for(var i = 0; i < arReverse.length;i++){
            var routerText = arReverse[i];
            if(i == (arReverse.length - 1)){
                html += '<li class="li-before-content"><span class="currentPage">'+routerText+'</span></li>'
            }else{
                html += '<li class="li-before-content"><span class="prePage">'+routerText+'</span></li>'
            }

        }
        $(".breadcrumb").html(html);
    }

    // 根据路径和id加载对应的iframe页面
    function loadIframe(id, url) {
        if (url.indexOf('?') > 0)
            url += '&menuId=' + id;
        else
            url += '?menuId=' + id;
        return '<iframe  scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:100%;padding:0px;overflow-y:auto;overflow-x:hidden;"></iframe>';
    };

});