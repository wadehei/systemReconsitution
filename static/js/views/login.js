// 按键进行提交
$(document).on("keydown", function(event) {
    var target = $(event.target);
    if (event.which === 13 && !target.hasClass("btns")) {
        jQuery("#loginBtn").trigger("click");
    }
});
// 前端缓存用户名
$(function() {
    var userName = localStorage.getItem('userName');
    if (userName) {
        $('#UserName').val(userName);
        $('#Password').focus();
    }
});
// 前端多语言
// var L = function(key) {
//         var text = abp.localization.values['vNext'][key];
//         return text ? text : key;
//     }
// 登录
$("#loginBtn").click(function(e) {
    var status = verify();
    if (status) {
        if ($(this).hasClass('logging'))
            return;
        $(this).addClass('logging');
        var that = $(this);

        var userName = $("#UserName").val(),
            password = $("#Password").val(); //checkCode = $("#checkCode").val()
        $.ajax({
            url: './static/json/login.json',
            type: 'POST',
            // abpHandleError: false,
            data: JSON.stringify({
                UserName: userName,
                Password: password,
                CheckCode: '',
                RememberMe: $(".memoryPassord i").hasClass('select')
            })
        }).done(function(data) {
            localStorage.setItem('sysUserName', userName);
            if (data && data.code == -1) {
                // $(".errorContent").text(L("A101VerifyError")).show();

            } else if (data && data.code == -2) {
                // $(".errorContent").text(L("A101InvalidUserNameOrPassword")).show();
            }
        }).fail(function(data) {
            $(".errorContent").text(data.message).show();
            changeCodeImg();
        }).always(function() {
            that.removeClass('logging');
        });
    }
});

$('#LoginForm input:eq(0)').focus();

//验证
function verify() {
    var state = true;
    var name = $("#UserName"),
        password = $("#Password"); //, checkCode = $("#checkCode")
    var nameVal = name.val();
    var passwordVal = password.val();
    //var checkCodeVal = checkCode.val();

    if (nameVal.length == 0 && passwordVal.length == 0) {
        //$(".errorContent").text(L("UserNameRequired")).show();
        // $(".errorContent").text(L('A101Input') + L("A101UserNameAndPassword")).show();
        name.focus();
        name.unbind().keyup(function() {
            if (name.val().length > 0 && password.val().length > 0)
                $(".errorContent").hide();
        });

        password.unbind().keyup(function() {
            if (name.val().length > 0 && password.val().length > 0)
                $(".errorContent").hide();
        });

        return state = false;
    }
    if (nameVal.length == 0) {
        // $(".errorContent").text(L('A101Input') + L("A101UserName")).show();
        name.focus();
        name.unbind().keyup(function() {
            if (name.val().length > 0)
                $(".errorContent").hide();
        });
        return state = false;
    }

    if (passwordVal.length == 0) {
        // $(".errorContent").text(L('A101Input') + L("A101Password")).show();
        password.focus();
        password.unbind().keyup(function() {
            if (password.val().length > 0)
                $(".errorContent").hide();
        });
        return state = false;
    }

    //if (checkCodeVal.length == 0) {
    //    $(".errorContent").text(L('A101Input') + L("A101VerifyCode")).show();
    //    checkCode.focus();
    //    checkCode.unbind().keyup(function () {
    //        if (checkCode.val().length > 0)
    //            $(".errorContent").hide();
    //    });
    //    return state = false;
    //}
    return state;
}

//    记住密码
$(".memoryPassord i").click(function() {
    $(this).toggleClass("select");

});
$(".memoryPassord span").click(function() {
    $(this).prev().toggleClass("select");
});

//  更换图片验证码
function changeCodeImg() {
    var newSrc = "/VerifyCode/Index?t=" + (new Date()).getTime();
    $("#checkCodeImg").attr("src", newSrc);
}