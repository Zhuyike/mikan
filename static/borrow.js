$('#borrow-input-search').on('click', function () {
    $.getJSON('/api/search_book', {
        'isbn': $('#borrow-search').val()
    }).done(function (data) {
        if (data['success'] === 1) {
            var text =
                '<tr><td>' + data['book_name'] +
                '</td><td>' + data['author'] + '</td><td>'+data['publish'] +
                '</td><td><button class="btn btn-default" id="borrow-btn" value="' + data['_id']+
                '">选中</button></td></tr>';
            $('#borrow-book-tbody').html(text)
        } else {
            alert('操作失败，失败信息：' + data['msg']);
        }
    })
});
$('.borrow').on('click', 'tbody tr td button', function () {
    alert($(this).val())
});