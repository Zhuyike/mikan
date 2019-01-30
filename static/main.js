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
        alert(data)
    });
});
//add-book
// $(function () {
//
//         // $.ajax({
//         //     type:'POST',
//         //     url: '/api/uploadfile',
//         //     data: form,
//         //     processData: false,  // tell jQuery not to process the data
//         //     contentType: false,  // tell jQuery not to set contentType
//         //     success: function (data) {
//         //         alert(data)
//         //     }
//         // }).done()
//     // });
// })();