#!/usr/bin/env python
# encoding: utf-8
from apps import sample
from apps import login
from apps import main

route_list = [
    (r'/demo', sample.DemoHandler),
    (r'/login', login.LoginHandler),
    (r'/main', main.MainHandler),

    (r'/api/login', login.ApiLoginHandler),
    (r'/api/uploadfile', main.UpLoadHandler),
    (r'/api/add_book', main.AddBookHandler),
    (r'/api/check_isbn', main.CheckIsbnHandler),
    (r'/api/add_user', main.AddUserHandler),
    (r'/api/fetch_username', main.FetchUsernameHandler),
    (r'/api/change_password', main.ChangePasswordHandler),
    (r'/api/search_book', main.SearchBookHandler),
    (r'/api/modify_book', main.ModifyBookHandler),
    (r'/api/delete_book', main.DeleteBookHandler),
    (r'/api/clear_img', main.ClearImgHandler),
]