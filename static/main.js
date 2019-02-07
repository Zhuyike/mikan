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
    var remain = $('#remain').val();
    var data = {
        'book_name': book_name,
        'author': author,
        'ISBN10': ISBN10,
        'ISBN13': ISBN13,
        'publish': publish,
        'tag_name': tag_name,
        'book_src': book_src,
        'remain': remain
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
                $('#remain').val('');
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
//setting-user
$.getJSON('/api/fetch_username', {}).done(function (data) {
    if (data['success'] === 1){
        $('#setting-username').val(data['username']);
    }
});
$('#input-setting-btn').on('click', function () {
    var pwd_1 = $('#setting-password').val();
    var pwd_2 = $('#setting-password-2').val();
    if (pwd_1 === pwd_2) {
        var data = {
            'username': $('#setting-username').val(),
            'pwd': $.md5($('#setting-re-password').val()),
            'new_pwd': $.md5(pwd_1)
        };
        data = JSON.stringify(data);
        $.ajax('/api/change_password', {
            'method': 'POST',
            'contentType': 'application/json',
            'data': data,
            'dataType': 'json'
        }).done(function (data) {
            if (data['success'] === 1){
                if (confirm(data['msg'] + '亲好\n修改密码成功!')){
                    $('#setting-re-password').val('');
                    $('#setting-password').val('');
                    $('#setting-password-2').val('');
                    $('#user-password-2').val('');
                }
            }else{
                alert('修改密码失败，失败信息：' + data['msg']);
            }
        })
    } else {
        alert('两次密码不相同，请重新输入');
        $('#user-password').val('');
        $('#user-password-2').val('');
    }
});
//modify-book
$('#modify-input-search').on('click', function () {
    var data = {
        'isbn': $('#modify-search').val()
    };
    if (data['isbn'].length > 0) {
        $.getJSON('/api/search_book', data).done(function (data) {
            if (data['success'] === 1) {
                $('.modify-books-img').attr('src', data['book_src']);
                $('#modify-meta-btn').removeAttr('disabled');
                $('#delete-book-btn').removeAttr('disabled');
                $('#modify-book-name').val(data['book_name']);
                $('#modify-author').val(data['author']);
                $('#modify-isbn10').val(data['ISBN10']);
                $('#modify-isbn13').val(data['ISBN13']);
                $('#modify-publish').val(data['publish']);
                $('#modify-tag-name').val(data['tag_name']);
                $('#modify-id').val(data['_id']);
                $('#modify-remain').val(data['remain']);
            } else {
                alert('搜索失败，失败信息：' + data['msg']);
            }
        })
    }
});
$('#modify-meta-btn').on('click', function () {
    var data = {
        'book_src': $('.modify-books-img').attr('src'),
        'ISBN10': $('#modify-isbn10').val(),
        'ISBN13': $('#modify-isbn13').val(),
        'author': $('#modify-author').val(),
        'book_name': $('#modify-book-name').val(),
        '_id': $('#modify-id').val(),
        'tag_name': $('#modify-tag-name').val(),
        'publish': $('#modify-publish').val(),
        'remain': $('#modify-remain').val()
    };
    data = JSON.stringify(data);
    $.ajax('/api/modify_book', {
        'method': 'POST',
        'contentType': 'application/json',
        'data': data,
        'dataType': 'json'
    }).done(function (data) {
        if (data['success'] === 1){
            if (confirm(data['msg'] + '亲好\n修改图书信息成功!')){
                $('.modify-books-img').attr('src', '');
                $('#modify-meta-btn').attr('disabled', 'disabled');
                $('#delete-book-btn').attr('disabled', 'disabled');
                $('#modify-isbn10').val('');
                $('#modify-isbn13').val('');
                $('#modify-author').val('');
                $('#modify-book-name').val('');
                $('#modify-id').val('');
                $('#modify-tag-name').val('');
                $('#modify-publish').val('');
                $('#modify-remain').val('');
            }
        }else{
            alert('修改图书信息失败，失败信息：' + data['msg']);
        }
    })
});
$('#modify-file-btn').on('click', function () {
    var fileObj = $(".img-modify")[0].files[0];
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
            $('.modify-books-img').attr('src', data['msg']);
        }else{
            alert('操作失败，失败信息：' + data['msg']);
        }
    });
});
$('#delete-book-btn').on('click', function () {
    $.getJSON('/api/delete_book', {
        '_id': $('#modify-id').val()
    }).done(function (data) {
        if (data['success'] === 1) {
            if (confirm(data['msg'] + '亲好\n删除图书成功!')) {
                $('.modify-books-img').attr('src', '');
                $('#modify-meta-btn').attr('disabled', 'disabled');
                $('#delete-book-btn').attr('disabled', 'disabled');
                $('#modify-isbn10').val('');
                $('#modify-isbn13').val('');
                $('#modify-author').val('');
                $('#modify-book-name').val('');
                $('#modify-id').val('');
                $('#modify-tag-name').val('');
                $('#modify-publish').val('');
                $('#modify-remain').val('');
            }
        } else {
            alert('修改图书信息失败，失败信息：' + data['msg'])
        }
    })
});
//admin-setting
$('#admin-clear').on('click', function () {
    $.getJSON('/api/clear_img', {}).done(function (data) {
        if (data['success'] === 1) {
            alert(data['msg'] + '亲好\n删除图书成功!');
        } else {
            alert('操作失败，失败信息：' + data['msg']);
        }
    })
});