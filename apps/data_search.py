#!/usr/bin/env python
# encoding: utf-8

from sample import BaseHandler
from requests import HTTPError
from tornado.web import authenticated
from worker.tool_common import *
from model import item as item_db
from bson import ObjectId
from model import record as record_db
from model import user as user_db
import hashlib
import requests
import json
import time
import random
import os


class SearchUserInfoHandler(BaseHandler):
    @authenticated_api
    def get(self):
        user = self.get_argument('user', '')
        user_data = user_db.login_fetch_user(self.user_db, user)
        data_return = dict()
        if not user_data:
            user_data = user_db.fetch_user_by_name(self.user_db, user)
        if user_data:
            data_return['success'] = 1
            data_return['msg'] = u'success'
            data_return['username'] = user_data['username']
            data_return['name'] = user_data['name']
            data_return['role'] = u'管理员' if user_data['role'] == 'admin' else u'读者'
            data_return['phone'] = user_data['phone']
            record_list = record_db.fetch_record_by_user_id(self.record_db, str(user_data['_id']))
            data_return['borrow_time'] = len(record_list)
            book_ids = [record['book_id'] for record in record_list if not record['finish']]
            data_return['borrow_number'] = len(book_ids)
            borrow_book_list = item_db.fetch_book_by_ids(self.item_db, book_ids)
            data_return['borrow_books'] = ','.join([u'《{}》'.format(book['book_name']) for book in borrow_book_list])
            data_return['borrow_status'] = u'正常借阅'
            for record in record_list:
                if (not record['finish']) and record['end_time'] < time.time():
                    data_return['borrow_status'] = u'异常借阅：有书籍超时未归还'
                    break
        else:
            data_return['success'] = 0
            data_return['msg'] = u'未查询到该用户'
        self.json_write(data_return)


class ResetPasswordHandler(BaseHandler):
    @authenticated_api
    def get(self):
        name = self.get_argument('user', '')
        user_data = user_db.fetch_user_by_name(self.user_db, name)
        if user_data:
            start = random.randint(0, 18)
            temp_pwd = str(ObjectId())[start:start + 6]
            user_data['pwd'] = get_md5(get_md5(temp_pwd) + salt)
            user_db.save_user(self.user_db, user_data)
            success = 1
            msg = temp_pwd
        else:
            success = 0
            msg = u'未查询到该用户'
        self.json_write({'success': success, 'msg': msg})


class DeleteAccountHandler(BaseHandler):
    @authenticated_api
    def get(self):
        name = self.get_argument('user', '')
        user_data = user_db.fetch_user_by_name(self.user_db, name)
        if user_data:
            user_db.delete_user_by_name(self.user_db, name)
            success = 1
            msg = u''
        else:
            success = 0
            msg = u'未查询到该用户'
        self.json_write({'success': success, 'msg': msg})


class SearchBookRecordHanlder(BaseHandler):
    @authenticated_api
    def get(self):
        isbn = self.get_argument('isbn', '')
        pass
