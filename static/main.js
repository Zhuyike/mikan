$.sidebarMenu = function(menu) {
  var animationSpeed = 300;
  $(menu).on('click', 'li a', function(e) {
    var $this = $(this);
    var checkElement = $this.next();
	e.preventDefault();
	if (!(checkElement.is('.treeview-menu'))) {
	    var target = $this.attr('class');
	    console.log($this.attr('class'));
	    $('.docker').hide();
        $('#' + target).show();
    }
    if (checkElement.is('.treeview-menu') && checkElement.is(':visible')) {
      checkElement.slideUp(animationSpeed, function() {
        checkElement.removeClass('menu-open');
      });
      checkElement.parent("li").removeClass("active");
    }
    //If the menu is not visible
    else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
      //Get the parent menu
      var parent = $this.parents('ul').first();
      //Close all open menus within the parent
      var ul = parent.find('ul:visible').slideUp(animationSpeed);
      //Remove the menu-open class from the parent
      ul.removeClass('menu-open');
      //Get the parent li
      var parent_li = $this.parent("li");
      //Open the target menu and add the menu-open class
      checkElement.slideDown(animationSpeed, function() {
        //Add the class active to the parent li
        checkElement.addClass('menu-open');
        parent.find('li.active').removeClass('active');
        parent_li.addClass('active');
      });
    }
  });
};

//add-books
$('#input-file-btn').on('click', function () {
    var fileObj = $(".img-input")[0].files[0];
    var form = new FormData();
    form.append("k1", "v1");
    form.append("fff", fileObj);
    $.ajax('/api/uploadfile', {
        'method': 'POST',
        'contentType': false,
        'data': form,
        'processData': false
    }).done(function (data) {
        if (data['success'] === 1) {
            $('.add-books-img').attr('src', data['msg']);
            $('#input-meta-btn').removeAttr('disabled');
        }else{
            alert('操作失败，失败信息：' + data['msg']);
        }
    });
});
$('#isbn10').on('change', function () {
    var isbn = $(this).val();
    if (isbn.length === 10) {
        $.getJSON('/api/check_isbn', {
            'isbn': isbn
        }).done(function (data) {
            if (data['success'] === 1) {
                $('#book-name').val(data['book_name']);
                $('#author').val(data['author']);
                $('#isbn10').val(data['ISBN10']);
                $('#isbn13').val(data['ISBN13']);
                $('#publish').val(data['publish']);
                $('#tag-name').val(data['tag_name']);
            }
        });
    }
});
$('#isbn13').on('change', function () {
    var isbn = $(this).val();
    if (isbn.length === 13) {
        $.getJSON('/api/check_isbn', {
            'isbn': isbn
        }).done(function (data) {
            if (data['success'] === 1) {
                $('#book-name').val(data['book_name']);
                $('#author').val(data['author']);
                $('#isbn10').val(data['ISBN10']);
                $('#isbn13').val(data['ISBN13']);
                $('#publish').val(data['publish']);
                $('#tag-name').val(data['tag_name']);
            }
        });
    }
});
$('#input-meta-btn').on('click', function () {
    var book_name = $('#book-name').val();
    var author = $('#author').val();
    var ISBN10 = $('#isbn10').val();
    var ISBN13 = $('#isbn13').val();
    var publish = $('#publish').val();
    var tag_name = $('#tag-name').val();
    var book_src = $('.add-books-img').attr('src');
    var data = {
        'book_name': book_name,
        'author': author,
        'ISBN10': ISBN10,
        'ISBN13': ISBN13,
        'publish': publish,
        'tag_name': tag_name,
        'book_src': book_src
    };
    data = JSON.stringify(data);
    $.ajax('/api/add_book', {
        'method': 'POST',
        'contentType': 'application/json',
        'data': data,
        'dataType': 'json'
    }).done(function (data) {
        if (data['success'] === 1){
            if (confirm(data['msg'] + '\n添加图书成功!')){
                $('#book-name').val('');
                $('#author').val('');
                $('#isbn10').val('');
                $('#isbn13').val('');
                $('#publish').val('');
                $('#tag-name').val('');
                $('.add-books-img').attr('src', '');
                $('#input-meta-btn').attr('disabled', 'disabled');
            }
        }else{
            alert('添加图书失败，失败信息：' + data['msg']);
        }
    })
});
//add-user
$('#input-user-btn').on('click', function () {
    var pwd_1 = $('#user-password').val();
    var pwd_2 = $('#user-password-2').val();
    if (pwd_1 === pwd_2) {
        var data = {
            'username': $('#user-username').val(),
            'name': $('#user-name').val(),
            'pwd': $.md5(pwd_1),
            'phone': $('#user-phone').val()
        };
        data = JSON.stringify(data);
        $.ajax('/api/add_user', {
            'method': 'POST',
            'contentType': 'application/json',
            'data': data,
            'dataType': 'json'
        }).done(function (data) {
            if (data['success'] === 1){
                if (confirm(data['msg'] + '\n添加读者成功!')){
                    $('#user-username').val('');
                    $('#user-name').val('');
                    $('#user-phone').val('');
                    $('#user-password').val('');
                    $('#user-password-2').val('');
                }
            }else{
                alert('添加读者失败，失败信息：' + data['msg']);
            }
        })
    } else {
        alert('两次密码不相同，请重新输入');
        $('#user-password').val('');
        $('#user-password-2').val('');
    }
});