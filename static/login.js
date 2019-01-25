$(function () {
   $('.pwd_login').on('change', function () {
       var pwd = $(this).val();
       $('.pwd_login__').val($.md5(pwd));
   });
   $('.input_login').on('click', function () {
       var pwd = $('.pwd_login__').val();
       var username = $('.username_login').val();
       var next_ = $('.next_login__').val();
       var user = {
           'username': username,
           'password__': pwd
       };
       user = JSON.stringify(user);
       $.ajax('/api/login', {
           'method': 'POST',
           'contentType': 'application/json',
           'data': user,
           'dataType': 'json'
       }).done(function (data) {
           console.log(data);
           if (data['login'] === 'success'){
               if (confirm('登录成功，点击确定后跳转')){
                   window.location = next_;
               }
           }else{
               alert('登录失败，失败信息：' + data['msg']);
           }
       }).fail(function (xhr, status) {
           console.log('失败: ' + xhr.status + ', 原因: ' + status);
       })
   })
});