//borrow-book
var book_list = [];
var book_dict = {};
var page = 0;
var page_max = 0;
var page_len = 8;
var book_info;
$('#borrow-input-search').on('click', function () {
    $.getJSON('/api/search_book', {
        'isbn': $('#borrow-search').val()
    }).done(function (data) {
        if ((data['success'] === 1) && (data['remain'] !== 0)){
            book_dict[data['_id']] = data;
            var text =
                '<tr><td>' + data['book_name'] +
                '</td><td>' + data['author'] +
                '</td><td>' + data['publish'] +
                '</td><td><button class="btn btn-default" id="borrow-btn" value="' + data['_id']+
                '">选中</button></td></tr>';
            $('#borrow-book-tbody').html(text)
        } else {
            alert('操作失败，失败信息：' + data['msg']);
        }
    })
});
$('.borrow').on('click', 'tbody tr td button', function () {
    book_info = book_dict[$(this).val()];
    $('.docker').hide();
    $('#borrow-book-info').show();
    $('.info-books-img').attr('src', book_info['book_src']);
    $('#info-book-name').val(book_info['book_name']);
    $('#info-author').val(book_info['author']);
    $('#info-publish').val(book_info['publish']);
    $('#info-isbn10').val(book_info['ISBN10']);
    $('#info-isbn13').val(book_info['ISBN13']);
    $('#info-tag-name').val(book_info['tag_name']);
});
$('#borrow-vague-search').on('click', function () {
    $.getJSON('/api/search_vague', {
        'book_name': $('#borrow-book-name').val(),
        'author': $('#borrow-author').val(),
        'publish': $('#borrow-publish').val(),
        'tag_name': $('#borrow-tag-name').val()
    }).done(function (data) {
        $('#previous-page').addClass('disabled');
        if (data['success'] === 1) {
            page = 0;
            var text = '';
            var i, len;
            book_list = data['data'];
            for (i in book_list) {
                book_dict[book_list[i]['_id']] = book_list[i]
            }
            if (book_list.length >= page_len) {
                len = page_len;
                $('#next-page').removeClass('disabled');
            } else {
                len = book_list.length;
                $('#next-page').addClass('disabled');
            }
            for (i = 0; i < len; i++) {
                text = text +
                    '<tr><td>' + book_list[i]['book_name'] +
                    '</td><td>' + book_list[i]['author'] +
                    '</td><td>' + book_list[i]['publish'] +
                    '</td><td><button class="btn btn-default" id="borrow-btn" value="' + book_list[i]['_id']+
                    '">选中</button></td></tr>';
            }
            $('#borrow-book-tbody').html(text);
            page_max = Math.ceil(book_list.length / page_len) - 1;
        } else {
            alert('操作失败，失败信息：' + data['msg']);
        }
    })
});
$('#previous-page-a').on('click', function () {
    if (page !== 0) {
        page--;
        var i, text = '';
        var i_max;
        if ((page + 1) * page_len > book_list.length) {
            i_max = book_list.length
        } else {
            i_max = (page + 1) * page_len
        }
        for (i = page * page_len; i < i_max; i++) {
            text = text +
                '<tr><td>' + book_list[i]['book_name'] +
                '</td><td>' + book_list[i]['author'] +
                '</td><td>' + book_list[i]['publish'] +
                '</td><td><button class="btn btn-default" id="borrow-btn" value="' + book_list[i]['_id']+
                '">选中</button></td></tr>';
        }
        if (page === 0) {
            $('#previous-page').addClass('disabled');
        }
        $('#next-page').removeClass('disabled');
        $('#borrow-book-tbody').html(text);
    }
});
$('#next-page-a').on('click', function () {
    if (page !== page_max) {
        page++;
        var i, text = '';
        var i_max;
        if ((page + 1) * page_len > book_list.length) {
            i_max = book_list.length
        } else {
            i_max = (page + 1) * page_len
        }
        for (i = page * page_len; i < i_max; i++) {
            text = text +
                '<tr><td>' + book_list[i]['book_name'] +
                '</td><td>' + book_list[i]['author'] +
                '</td><td>' + book_list[i]['publish'] +
                '</td><td><button class="btn btn-default" id="borrow-btn" value="' + book_list[i]['_id']+
                '">选中</button></td></tr>';
        }
        if (page === page_max) {
            $('#next-page').addClass('disabled');
        }
        $('#previous-page').removeClass('disabled');
        $('#borrow-book-tbody').html(text);
    }
});
$('#info-back-btn').on('click', function() {
    $('.docker').hide();
    $('#borrow-book').show();
});
$('#info-confirm-btn').on('click', function () {
    $.getJSON('/api/borrow_book', {
        '_id': book_info['_id'],
        'time': $('.borrow_time input[name="borrow_time"]:checked ').val()
    }).done(function (data) {
        if (data['success'] === 1){
            alert('操作成功：' + data['msg']);
            $('.docker').hide();
            $('#borrow-book').show();
        } else {
            alert('操作失败，失败信息：' + data['msg']);
        }
    })
});
//return
var record_list = [];
var record_dict = {};
var page_record = 0;
var record_max = 0;
var record_len = 13;
$('#return-search').on('click', function () {
    $.getJSON('/api/search_user_record', {}).done(function (data) {
        $('#previous-page-return').addClass('disabled');
        if (data['success'] === 1) {
            page_record = 0;
            var text = '';
            var i, len;
            record_list = data['data'];
            for (i in record_list) {
                record_dict[record_list[i]['_id']] = record_list[i]
            }
            if (record_list.length >= record_len) {
                len = record_len;
                $('#next-page-return').removeClass('disabled');
            } else {
                len = record_list.length;
                $('#next-page-return').addClass('disabled');
            }
            for (i = 0; i < len; i++) {
                text = text +
                    '<tr><td>' + record_list[i]['book_name'] +
                    '</td><td>' + record_list[i]['start_time'] +
                    '</td><td>' + record_list[i]['end_time'] +
                    '</td><td>' + record_list[i]['status'] +
                    '</td><td><button class="btn btn-default" id="return-btn" value="' + record_list[i]['_id'];
                if (record_list[i]['finish']) {
                    text = text + '" disabled="disabled">选择归还</button></td></tr>';
                } else {
                    text = text + '">选择归还</button></td></tr>';
                }
            }
            $('#return-book-tbody').html(text);
            record_max = Math.ceil(record_list.length / record_len) - 1;
        } else {
            alert('操作失败，失败信息：' + data['msg']);
        }
    })
});
$('.return').on('click', 'tbody tr td button', function () {
    var return_code = prompt("请输入归还码，可在归还图书之后从图书管理员处获取","请在这里输入归还码");
    var this_ = $(this);
    if (!(!return_code && typeof(return_code)!="undefined" && return_code != 0)){
        $.getJSON('/api/check_return_code', {
            'return_code': return_code,
            'record_id': this_.val()
        }).done(function (data) {
            if (data['success']) {
                alert('归还成功');
                this_.parent('td').prev('td').html('已归还')
            } else {
                alert('操作失败，失败信息：' + data['msg'])
            }
        });
    }
});
$('#previous-page-a-return').on('click', function () {
    if (page_record !== 0) {
        page_record--;
        var i, text = '';
        var i_max;
        if ((page_record + 1) * record_len > record_list.length) {
            i_max = record_list.length
        } else {
            i_max = (page_record + 1) * record_len
        }
        for (i = page_record * record_len; i < i_max; i++) {
            text = text +
                '<tr><td>' + record_list[i]['book_name'] +
                '</td><td>' + record_list[i]['start_time'] +
                '</td><td>' + record_list[i]['end_time'] +
                '</td><td id="return-status">' + record_list[i]['status'] +
                '</td><td><button class="btn btn-default" id="return-btn" value="' + record_list[i]['_id'];
            if (record_list[i]['finish']) {
                text = text + '" disabled="disabled">选择归还</button></td></tr>';
            } else {
                text = text + '">选择归还</button></td></tr>';
            }
        }
        if (page_record === 0) {
            $('#previous-page-return').addClass('disabled');
        }
        $('#next-page-return').removeClass('disabled');
        $('#return-book-tbody').html(text);
    }
});
$('#next-page-a-return').on('click', function () {
    if (page_record !== record_max) {
        page_record++;
        var i, text = '';
        var i_max;
        if ((page_record + 1) * record_len > record_list.length) {
            i_max = record_list.length
        } else {
            i_max = (page_record + 1) * record_len
        }
        for (i = page_record * record_len; i < i_max; i++) {
            text = text +
                '<tr><td>' + record_list[i]['book_name'] +
                '</td><td>' + record_list[i]['start_time'] +
                '</td><td>' + record_list[i]['end_time'] +
                '</td><td id="return-status">' + record_list[i]['status'] +
                '</td><td><button class="btn btn-default" id="return-btn" value="' + record_list[i]['_id'];
            if (record_list[i]['finish']) {
                text = text + '" disabled="disabled">选择归还</button></td></tr>';
            } else {
                text = text + '">选择归还</button></td></tr>';
            }
        }
        if (page_record === record_max) {
            $('#next-page-return').addClass('disabled');
        }
        $('#previous-page-return').removeClass('disabled');
        $('#return-book-tbody').html(text);
    }
});
$('#admin-code').on('click', function () {
    $.getJSON('/api/get_admin_code', {
        'isbn': $('#admin-isbn').val()
    }).done(function (data) {
        if (data['success'] === 1) {
            confirm('归还码为：' + data['msg'] + '\n10分钟内有效')
        } else {
            alert('操作失败，失败信息：' + data['msg'])
        }
    })
});
//prompt("你今年多大了?","请在这里输入年龄")