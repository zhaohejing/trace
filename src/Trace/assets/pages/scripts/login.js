var Login = function () {
    var url = "http://118.89.225.78:8080/api/efan/login";
    var handleLogin = function () {
        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                username: {
                    required: "用户名必填."
                },
                password: {
                    required: "密码必填."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit   
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {
                form.submit(); // form validation success, call ajax form submit
            }
        });

        $('.login-form input').keypress(function (e) {
            if (e.which === 13) {
                if ($('.login-form').validate().form()) {
                    var username = $("#userName").val();
                    var password = $("#pw").val();
                    if (!username || !password) {
                        $('.alert-danger', $('.login-form')).show();
                        return false;
                    }
                    var md5Pw = window.md5(password);
                    var data = { "user_name": username, "pw": md5Pw };
                    $.ajax({
                        type: "Post",
                        url: url,
                        data: data,
                        async: false,
                        dataType: "json",
                        success: function (res) {
                            if (res.code == 200) {
                                var val = { username: res.user_name, orgid: res.org_id, orgName: res.org_name };
                                var temp = JSON.stringify(val);
                                $.cookie("traceResult", temp, {
                                    expires: 1,//有效日期
                                    path: "/",//cookie的路 径
                                    secure: false //true,cookie的传输会要求一个安全协议,否则反之
                                });
                                window.location.href = "layout.html";
                            } else {
                                $('.alert-danger', $('.login-form')).show();
                            }
                        }
                    });
                }
            }
            return false;
        });

        $("#btn")
             .click(function () {
                 if ($('.login-form').validate().form()) {
                     var username = $("#userName").val();
                     var password = $("#pw").val();
                     var md5Pw = md5(password);
                     var data = { "userName": username, "pw": md5Pw };
                     if (!username || !password) {
                         $('.alert-danger', $('.login-form')).show();
                         return false;
                     }
                     var val = { username: 'admin', orgid: '1', orgName: '系统',token:'abcdefg' };
                     var temp = JSON.stringify(val);
                     $.cookie("traceResult",
                         temp,
                         {
                             expires: 1, //有效日期
                             path: "/", //cookie的路 径
                             secure: false //true,cookie的传输会要求一个安全协议,否则反之
                         });
                     window.location.href = "layout.html";
                     return false;

                     $.ajax({
                         type: "Post",
                         url: url,
                         data: data,
                         async: false,
                         dataType: "json",
                         success: function (res) {
                             if (res.code == 200) {
                                 var val = { username: res.user_name, orgid: res.org_id, orgName: res.org_name };
                                 var temp = JSON.stringify(val);
                                 $.cookie("traceResult",
                                     temp,
                                     {
                                         expires: 1, //有效日期
                                         path: "/", //cookie的路 径
                                         secure: false //true,cookie的传输会要求一个安全协议,否则反之
                                     });
                                 window.location.href = "layout.html";
                             } else {
                                 $('.alert-danger', $('.login-form')).show();
                             }
                         }
                     });
                 }
             });
        $('#forget-password').click(function () {
            $('.login-form').hide();
            $('.forget-form').show();
        });

        $('#back-btn').click(function () {
            $('.login-form').show();
            $('.forget-form').hide();
        });
    }
    return {
        //main function to initiate the module
        init: function () {
            var cookie = $.cookie("traceResult");
            if (cookie != "" && cookie != undefined) {
                try {
                    var cook = $.parseJSON(cookie);
                    if (cook.username) {
                        window.location.href = "layout.html";
                    }
                } catch (e) {
                    handleLogin();
                }
            }
            handleLogin();

            // init background slide images
            $('.login-bg').backstretch([
                "../assets/pages/img/bg1.jpg",
                "../assets/pages/img/bg2.jpg",
                "../assets/pages/img/bg3.jpg"
            ], {
                fade: 1000,
                duration: 8000
            }
            );

            $('.forget-form').hide();

        }

    };
}();
jQuery(document).ready(function () {
    Login.init();
});