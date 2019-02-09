#!/usr/bin/env python
# encoding: utf-8
from apps import sample
from apps import login
from apps import main
from apps import borrow
from apps import data_search

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
    (r'/api/search_vague', borrow.SearchVagueHandler),
    (r'/api/borrow_book', borrow.BorrowBookHandler),
    (r'/api/search_user_record', borrow.SearchUserRecordHandler),
    (r'/api/check_return_code', borrow.CheckReturnCodeHandler),
    (r'/api/get_admin_code', borrow.GetAdminCodeHandler),
    (r'/api/search_user_info', data_search.SearchUserInfoHandler),
    (r'/api/reset_password', data_search.ResetPasswordHandler),
    (r'/api/delete_account', data_search.DeleteAccountHandler),
    (r'/api/search_book_record', data_search.SearchBookRecordHanlder),
]
