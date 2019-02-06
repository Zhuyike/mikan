//borrow-book
$('#borrow-input-search').on('click', function () {
    $.getJSON('/api/search_book', {
        'isbn': $('#borrow-search').val()
    }).done(function (data) {
        if (data['success'] === 1) {
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
    alert($(this).val());
});
var book_list = [];
var page = 0;
var page_max = 0;
var page_len = 8;
$('#borrow-vague-search').on('click', function () {
    $.getJSON('/api/search_vague', {
        'book_name': $('#borrow-book-name').val(),
        'author': $('#borrow-author').val(),
        'publish': $('#borrow-publish').val(),
        'tag_name': $('#borrow-tag-name').val()
    }).done(function (data) {
        if (data['success'] === 1) {
            page = 0;
            var text = '';
            var i, len;
            book_list = data['data'];
            if (book_list.length >= page_len) {
                len = page_len;
                $('#next-page').removeClass('disabled')
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
            $('#previous-page-page').addClass('disabled');
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
            $('#next-page-page').addClass('disabled');
        }
        $('#previous-page').removeClass('disabled');
        $('#borrow-book-tbody').html(text);
    }
});