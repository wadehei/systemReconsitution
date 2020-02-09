//增加小计、合并单元格
function buildReportV2(tab, groupSize, issummations) {
    //迭代列索引，增加小计（不含单一行）
    for (var i = 0; i < groupSize; i++) {
        addSubTotalV2(tab, i, issummations);
    }
    //迭代列索引，合并分组单元格
    //  if (customerFooter != 1 ){

    for (var i = 0; i < groupSize; i++) {
        megerCellsV2(tab, i);
    }
    //}
    jQuery("td[name='del']").remove();
    //	jQuery("#show_report").show();
}

//对每个分组增加小计   参数：分组列索引
function addSubTotalV2(tab, columnIndex, issummations, customerFooter) {
    var tab = document.getElementById(tab);
    var rowCount = tab.rows.length;
    var pv = null;  //上一行Cell内容
    var row = null;  //上一行ROW
    var gCount = 0;  //分组数量
    var gSubCount = 0;  //基于大分类下的小分组数量
    var clsNext = null;  //大类上一行标志
    var total = new Array();  //总计
    var subtotal = new Array();  //小计
    var isSumArrs = issummations.split(',');

    if (rowCount < 2) {
        return;
    }
    var thAlign;
    //迭代每行数据
    for (var i = 1; i < tab.rows.length; i++) {
        if (isSumArrs.length > 0)
        //去除动态增加的小计或总计行
            if (jQuery(tab.rows[i]).attr("istotal")) {
                if (gSubCount > 0) {
                    //处理各分组最后一行小计显示
                    var jQuerycloneTR = jQuery(row).clone();
                    // jQuerycloneTR.attr("istotal", "true");
                    jQuerycloneTR.find("td").attr("style", "-");
                    jQuerycloneTR.attr("istotal", "true");
                    jQuerycloneTR.addClass('subtotal');
                    var align = jQuery(jQuery(jQuery(tab.rows[i])).find('td')[columnIndex]).css('text-align');
                    jQuery(jQuerycloneTR.find("td").get(columnIndex)).html('小计').css('text-align', align);
                    console.log('1---------' + gCount);
                    jQuery(jQuerycloneTR.find("td").get(columnIndex)).removeClass().addClass("c" + columnIndex + "-g" + gCount);
                    for (var j = columnIndex + 1; j < jQuerycloneTR.find("td").length; j++) {
                        jQuery(jQuerycloneTR.find("td").get(j)).html(subtotal[j] == undefined ? "--" : subtotal[j]);

                        // if (subtotal[j] == undefined)
                        jQuery(jQuerycloneTR.find("td").get(j)).css('text-align', align);
                        // else
                        //     jQuery(jQuerycloneTR.find("td").get(j)).css('text-align', 'right');

                        //jQuery(jQuerycloneTR.find("td").get(j)).html(subtotal[j] == undefined ? "--" : subtotal[j]).css('text-align', align);
                    }
                    jQuerycloneTR.insertAfter(jQuery(row));
                    i++;
                    gSubCount = 0;
                    subtotal = [];
                }
                continue;
            }

        var currCell = tab.rows[i].cells[columnIndex];  //获取当前Cell
        if (!currCell) {
            continue;
        }

        var cv = jQuery.trim(currCell.innerHTML);  //获取当前Cell内容
        if (columnIndex > 0) {
            //处理不是第一列分组的情况，要考虑前一分组作为大类的区间
            var cls = jQuery(tab.rows[i].cells[columnIndex - 1]).attr("class");
            if (null != pv && pv != cv || null != clsNext && cls != clsNext) {
                gCount++;
            }
            if (null != pv && pv != cv && null != clsNext && cls == clsNext && isSumArrs.length > 0) {
                gSubCount++;
            }

            if (null != clsNext && cls != clsNext && gSubCount > 0) {
                var jQuerycloneTR = jQuery(row).clone();
                var sa = 0;
                jQuerycloneTR.attr("istotal", "true");
                jQuerycloneTR.addClass('subtotal');
                var align = jQuery(jQuery(jQuery(tab.rows[1])).find('td')[columnIndex]).css('text-align');
                jQuery(jQuerycloneTR.find("td").get(columnIndex)).html('小计');
                console.log('2---------' + gCount);
                jQuery(jQuerycloneTR.find("td").get(columnIndex)).removeClass().addClass("c" + columnIndex + "-g" + gCount);
                for (var j = columnIndex + 1; j < jQuerycloneTR.find("td").length; j++) {
                    sa = parseFloat(subtotal[j]);
                    jQuery(jQuerycloneTR.find("td").get(j)).html(subtotal[j] == undefined ? "--" : sa)
                    // if (subtotal[j] == undefined)
                    jQuery(jQuerycloneTR.find("td").get(j)).css('text-align', align);
                    // else
                    //     jQuery(jQuerycloneTR.find("td").get(j)).css('text-align', 'right');
                    //jQuery(jQuerycloneTR.find("td").get(j)).css('text-align',subtotal[j] == undefined ? "left" : 'right');
                }
                jQuerycloneTR.insertAfter(jQuery(row));
                i++;
                gSubCount = 0;
                subtotal = [];
            }
            if (null != clsNext && cls != clsNext) {
                subtotal = [];
            }
        } else {
            //处理是第一列分组的情况。
            if (null != pv && pv != cv) {
                gCount++;
            }
        }

        pv = cv;
        clsNext = cls;
        jQuery(currCell).addClass("c" + columnIndex + "-g" + gCount);
        row = tab.rows[i];

        //总计&&小计
        for (var m = 0; m < tab.rows[i].cells.length; m++) {
            for (var z = 0; z < isSumArrs.length; z++) {
                if (isSumArrs[z] == m) {
                    var tv = parseFloat(jQuery.trim(tab.rows[i].cells[m].innerHTML));
                    if (!isNaN(tv)) {
                        if (total[m]) {
                            // total[m] = parseFloat(total[m]) + tv;
                            total[m] = accAdd(total[m], tv);
                        } else {
                            total[m] = tv;
                        }
                        if (subtotal[m]) {
                            // subtotal[m] = parseFloat(subtotal[m]) + tv;
                            subtotal[m] = accAdd(subtotal[m], tv);
                        } else {
                            subtotal[m] = tv;
                        }
                    }
                    break;
                }
            }
        }
    }  //for end

    //处理总计

    /*if (columnIndex == '0' && rowCount > 2) {
     var jQuerycloneTR = jQuery(row).clone();
     //jQuerycloneTR.css("background", "#E0E0E0");
     jQuerycloneTR.attr("istotal", "true");
     jQuerycloneTR.addClass('total');//添加样式
     jQuery(jQuerycloneTR.find("td").get(columnIndex)).html('总计');
     for (var z = columnIndex + 1; z < jQuerycloneTR.find("td").length; z++) {
     var _total = total[z];
     if (_total) {
     if (isfloat(_total) && !isNumber(_total)) {
     _total = _total.toFixed(2);
     }
     }
     jQuery(jQuerycloneTR.find("td").get(z)).html(total[z] == undefined ? "--" : _total);
     }
     jQuerycloneTR.insertAfter(jQuery(row));
     if (issummations.length == 0)
     jQuerycloneTR.hide();
     }*/

}
function isfloat(oNum) {
    if (!oNum) return false;
    var strP = /^\d+(\.\d+)?jQuery/;
    if (!strP.test(oNum)) return false;
    try {
        if (parseFloat(oNum) != oNum) return false;
    } catch (ex) {
        return false;
    }
    return true;
}
function isNumber(oNum) {
    if (!oNum) return false;
    var strP = /^\d+jQuery/; //正整数
    if (!strP.test(oNum)) return false;
    return true;
}
//合并单元格V2 参数：列索引   begin
function megerCellsV2(tab, columnIndex) {
    var tab = document.getElementById(tab);
    var rowNum = tab.rows.length;//得到行数
    var v = null;
    var cell = null;
    var rowspan = 1;
    var clsNext = null;  //大类上一行标志

    for (var i = 1; i < rowNum; i++) {
        if (!tab.rows[i].cells[columnIndex]) {
            continue;
        }
        var vv = jQuery.trim(tab.rows[i].cells[columnIndex].innerHTML);//单元格内容
        if (columnIndex > 0) {
            var cls = jQuery(tab.rows[i].cells[columnIndex - 1]).attr("class");//左侧单元格样式类
            if (null != v && v == vv && null != clsNext && clsNext == cls) {
                rowspan++;
                if (i < ( rowNum - 1)) {
                    tab.rows[i].cells[columnIndex].style.display = "none";
                    tab.rows[i].cells[columnIndex].setAttribute('name', 'del');
                }
            } else {
                if (null != cell) {
                    cell.setAttribute("rowspan", rowspan);
                }
                v = vv;//单元格内容复制给v
                clsNext = cls;//左侧单元格样式类复制给clsNext
                rowspan = 1;
                cell = tab.rows[i].cells[columnIndex];
            }
        } else {//处理第一列
            if (null != v && v == vv && vv != '-') {
                rowspan++;
                tab.rows[i].cells[columnIndex].style.display = "none";
                tab.rows[i].cells[columnIndex].setAttribute('name', 'del');
            } else {
                if (null != cell) {
                    cell.setAttribute("rowspan", rowspan);
                }
                v = vv;
                rowspan = 1;
                cell = tab.rows[i].cells[columnIndex];
            }
        }
    }//for end
}
//合并单元格V2 end