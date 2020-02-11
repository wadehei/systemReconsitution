/**
 * Created by DELL on 2020/2/11.
 */
function upClickImgs() {
    $("#filesImgs").click();
}
function upClickLogo() {
    $("#filesLogo").click();
}
function upLoadClickImgs() {
    var fileUpload = $("#filesImgs").get(0);
    var files = fileUpload.files;
    var fileName = files[0].name;
    var file_typename = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
    if ('.png.jpg.jpeg.'.indexOf(file_typename) >= 0) {
        var fileSize = 0;
        if (files[0].size > 1024 * 1024) {
            fileSize = Math.round(files[0].size * 100 / (1024 * 1024)) / 100;

            if (fileSize > 2) {
                warn(L("A101FileIsBig"));
                return;
            }
        }

    } else {
        warn(L("A101PleaseCheckImg"));
        return;
    }
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
    }
    $.ajax({
        type: "POST",
        url: "/Sys/PlatCompany/UploadFiles",
        contentType: false,
        processData: false,
        data: data,
        success: function (message) {
            if (message.success) {
                $('#img').attr("src", message.result);
                $("#LoginImgs").val(message.result);
            }
        },
        error: function () {
            warn(L("A101Error"));
        }
    });


}
function upLoadClickLogo() {

    var fileUpload = $("#filesLogo").get(0);
    var files = fileUpload.files;
    var fileName = files[0].name;
    var file_typename = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
    if ('.png'.indexOf(file_typename) >= 0) {
        var fileSize = 0;
        if (files[0].size > 1024 * 1024) {
            fileSize = Math.round(files[0].size * 100 / (1024 * 1024)) / 100;

            if (fileSize > 2) {
                warn(L("A101FileIsBig"));
                return;
            }
        }

    } else {
        warn(L("A101PleaseCheckLogo"));
        return;
    }
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
    }
    $.ajax({
        type: "POST",
        url: "/Sys/PlatCompany/UploadFiles",
        contentType: false,
        processData: false,
        data: data,
        success: function (message) {
            if (message.success) {
                $('#logo').attr("src", message.result);
                $("#LoginLogo").val(message.result);
            }
        },
        error: function () {
            warn(L("A101Error"));
        }
    });


}