//find-book
$('#find-input-search').on('click', function () {
    $.getJSON('/api/search_book', {
        'isbn': $('#find-search').val()
    }).done(function (data) {
        if (data['success'] === 1) {
            $('#find-book-name').val(data['book_name']);
            $('#find-author').val(data['author']);
            $('#find-isbn10').val(data['ISBN10']);
            $('#find-isbn13').val(data['ISBN13']);
            $('#find-publish').val(data['publish']);
            $('#find-tag-name').val(data['tag-name']);
            $('#find-remain').val(data['remain']);
            $('.find-books-img').attr('src', data['book_src']);
        } else {
            alert('操作失败，失败信息：' + data['msg']);
        }
    })
});
//find-user
$('#find-user-btn').on('click', function () {
    $.getJSON('/api/search_user_info', {
        'user': $('#find-user-input').val()
    }).done(function (data) {
        if (data['success'] === 1) {
            $('#find-username').val(data['username']);
            $('#find-name').val(data['name']);
            $('#find-phone').val(data['phone']);
            $('#find-role').val(data['role']);
            $('#find-borrow-time').val(data['borrow_time']);
            $('#find-borrow-number').val(data['borrow_number']);
            $('#find-borrow-books').val(data['borrow_books']);
            $('#find-borrow-status').val(data['borrow_status']);
            $('#find-delete-btn').removeAttr('disabled');
            $('#find-reset-btn').removeAttr('disabled');
        } else {
            alert('操作失败，失败信息：' + data['msg']);
        }
    })
});
$('#find-reset-btn').on('click', function () {
    if (confirm('确定要重置密码么？')) {
        $.getJSON('/api/reset_password', {
            'user': $('#find-name').val()
        }).done(function (data) {
            if (data['success'] === 1) {
                alert('操作成功，新密码为：' + data['msg'] + '\n请及时修改密码');
            } else {
                alert('操作失败，失败信息：' + data['msg']);
            }
        })
    }
});
$('#find-delete-btn').on('click', function () {
    if (confirm('确定要注销该账户么？')) {
        $.getJSON('/api/delete_account', {
            'user': $('#find-name').val()
        }).done(function (data) {
            if (data['success'] === 1) {
                alert('操作成功');
                $('#find-username').val('');
                $('#find-name').val('');
                $('#find-phone').val('');
                $('#find-role').val('');
                $('#find-borrow-time').val('');
                $('#find-borrow-number').val('');
                $('#find-borrow-books').val('');
                $('#find-borrow-status').val('');
                $('#find-delete-btn').attr('disabled', 'disabled');
                $('#find-reset-btn').attr('disabled', 'disabled');
            } else {
                alert('操作失败，失败信息：' + data['msg']);
            }
        })
    }
});
//user-borrow-record
var user_record_list = [];
var user_record_dict = {};
var user_page_record = 0;
var user_record_max = 0;
$('#user-record-btn').on('click', function () {
    $.getJSON('/api/search_user_record', {
        'user': $('#user-record-input').val()
    }).done(function (data) {
        if (data['success'] === 1) {
            user_page_record = 0;
            var text = '';
            var i, len;
            user_record_list = data['data'];
            for (i in user_record_list) {
                user_record_dict[user_record_list[i]['_id']] = user_record_list[i]
            }
            if (user_record_list.length >= record_len) {
                len = record_len;
                $('#next-user-borrow').removeClass('disabled');
            } else {
                len = user_record_list.length;
                $('#next-user-borrow').addClass('disabled');
            }
            for (i = 0; i < len; i++) {
                text = text +
                    '<tr><td>' + user_record_list[i]['book_name'] +
                    '</td><td>' + user_record_list[i]['start_time'] +
                    '</td><td>' + user_record_list[i]['end_time'] +
                    '</td><td>' + user_record_list[i]['status'] + '</td></tr>';
            }
            $('#user-borrow-tbody').html(text);
            user_record_max = Math.ceil(user_record_list.length / record_len) - 1;
        } else {
            alert('操作失败，失败信息：' + data['msg']);
        }
    })
});
$('#previous-user-borrow-a').on('click', function () {
    if (user_page_record !== 0) {
        user_page_record--;
        var i, text = '';
        var i_max;
        if ((user_page_record + 1) * record_len > user_record_list.length) {
            i_max = user_record_list.length
        } else {
            i_max = (user_page_record + 1) * record_len
        }
        for (i = user_page_record * record_len; i < i_max; i++) {
            text = text +
                '<tr><td>' + user_record_list[i]['book_name'] +
                '</td><td>' + user_record_list[i]['start_time'] +
                '</td><td>' + user_record_list[i]['end_time'] +
                '</td><td>' + user_record_list[i]['status'] + '</td></tr>'
        }
        if (user_page_record === 0) {
            $('#previous-user-borrow').addClass('disabled');
        }
        $('#next-user-borrow').removeClass('disabled');
        $('#user-borrow-tbody').html(text);
    }
});
$('#next-user-borrow-a').on('click', function () {
    if (user_page_record !== user_record_max) {
        user_page_record++;
        var i, text = '';
        var i_max;
        if ((user_page_record + 1) * record_len > user_record_list.length) {
            i_max = user_record_list.length
        } else {
            i_max = (user_page_record + 1) * record_len
        }
        for (i = user_page_record * record_len; i < i_max; i++) {
            text = text +
                '<tr><td>' + user_record_list[i]['book_name'] +
                '</td><td>' + user_record_list[i]['start_time'] +
                '</td><td>' + user_record_list[i]['end_time'] +
                '</td><td>' + user_record_list[i]['status'] + '</td></tr>'
        }
        if (user_page_record === user_record_max) {
            $('#next-user-borrow').addClass('disabled');
        }
        $('#previous-user-borrow').removeClass('disabled');
        $('#user-borrow-tbody').html(text);
    }
});
//book-borrow-record
var book_record_list = [];
var book_record_dict = {};
var book_page_record = 0;
var book_record_max = 0;
$('#book-record-btn').on('click', function () {
    $.getJSON('/api/search_book_record', {
        'isbn': $('#book-record-input').val()
    }).done(function (data) {
        if (data['success'] === 1) {
            book_page_record = 0;
            var text = '';
            var i, len;
            book_record_list = data['data'];
            for (i in book_record_list) {
                book_record_dict[book_record_list[i]['_id']] = book_record_list[i]
            }
            if (book_record_list.length >= record_len) {
                len = record_len;
                $('#next-book-borrow').removeClass('disabled');
            } else {
                len = book_record_list.length;
                $('#next-book-borrow').addClass('disabled');
            }
            for (i = 0; i < len; i++) {
                text = text +
                    '<tr><td>' + book_record_list[i]['name'] +
                    '</td><td>' + book_record_list[i]['start_time'] +
                    '</td><td>' + book_record_list[i]['end_time'] +
                    '</td><td>' + book_record_list[i]['status'] + '</td></tr>';
            }
            $('#book-borrow-tbody').html(text);
            book_record_max = Math.ceil(book_record_list.length / record_len) - 1;
        } else {
            alert('操作失败，失败信息：' + data['msg']);
        }
    })
});
$('#previous-book-borrow-a').on('click', function () {
    if (book_page_record !== 0) {
        book_page_record--;
        var i, text = '';
        var i_max;
        if ((book_page_record + 1) * record_len > book_record_list.length) {
            i_max = book_record_list.length
        } else {
            i_max = (book_page_record + 1) * record_len
        }
        for (i = book_page_record * record_len; i < i_max; i++) {
            text = text +
                '<tr><td>' + book_record_list[i]['name'] +
                '</td><td>' + book_record_list[i]['start_time'] +
                '</td><td>' + book_record_list[i]['end_time'] +
                '</td><td>' + book_record_list[i]['status'] + '</td></tr>'
        }
        if (book_page_record === 0) {
            $('#previous-book-borrow').addClass('disabled');
        }
        $('#next-book-borrow').removeClass('disabled');
        $('#book-borrow-tbody').html(text);
    }
});
$('#next-book-borrow-a').on('click', function () {
    if (book_page_record !== book_record_max) {
        book_page_record++;
        var i, text = '';
        var i_max;
        if ((book_page_record + 1) * record_len > book_record_list.length) {
            i_max = book_record_list.length
        } else {
            i_max = (book_page_record + 1) * record_len
        }
        for (i = book_page_record * record_len; i < i_max; i++) {
            text = text +
                '<tr><td>' + book_record_list[i]['name'] +
                '</td><td>' + book_record_list[i]['start_time'] +
                '</td><td>' + book_record_list[i]['end_time'] +
                '</td><td>' + book_record_list[i]['status'] + '</td></tr>'
        }
        if (book_page_record === book_record_max) {
            $('#next-book-borrow').addClass('disabled');
        }
        $('#previous-book-borrow').removeClass('disabled');
        $('#book-borrow-tbody').html(text);
    }
});