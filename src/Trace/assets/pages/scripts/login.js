var Login = function () {
    var o = {
        show: function (text) {
            $("#text").text(text);
            $("#show").show();
        },
        hide: function () {
            $("#show").hide();
        }
    };

    var url = "http://tcservice.hijigu.com:8080/sys/login";
 
    $("#loginSubmit")
          .click(function () {
              if ($('.form-horizontal').validate().form()) {
                  var username = $("#userName").val();
                  var password = $("#pw").val();
                  var md5pw = md5(password);
                  var data = { "user_name": username, "password": md5pw };
                  if (!username || !password) {
                      o.show("请输入用户名或密码");
                      return;
                  }
                  $.ajax({
                      type: "Post",
                      url: url,
                      data: JSON.stringify(data),
                      async: false,
                      contentType: 'application/json',
                      success: function (res) {
                          if (res.success) {
                              var val = { username: res.result.nick_name, token: res.result.token };
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
                              o.show(res.error);
                          }
                      }
                  });
              }
          });


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
                   
                }
            }
          
        }
    };
}();

jQuery(document).ready(function () {
    Login.init();
});