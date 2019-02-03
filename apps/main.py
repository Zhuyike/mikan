#!/usr/bin/env python
# encoding: utf-8

from sample import BaseHandler
from requests import HTTPError
from tornado.web import authenticated
from worker.tool_common import *
from model import item as item_db
from bson import ObjectId
from model import user as user_db
import hashlib
import requests
import json


class MainHandler(BaseHandler):
    @authenticated
    def get(self):
        if self.role == '':
            self.get_current_user()
        if self.role == 'admin':
            self.render('main.html', default_img_src=self.settings['default_file'])
        else:
            self.render('main_user.html')


class UpLoadHandler(BaseHandler):
    @authenticated_api
    def post(self):
        file_metas = self.request.files["fff"]
        meta = file_metas[0]
        temp_name = '{}/{}.' + meta['filename'].split('.')[-1]
        file_name = temp_name.format(self.settings['default_file'], ObjectId())
        self.redis.set(meta['filename'], file_name, ex=self.settings['login_ttl'])
        with open(file_name, 'wb') as f:
            f.write(meta['body'])
        self.json_write({'success': 1, 'msg': '../static/img/{}'.format(file_name.split('/')[-1])})


class AddBookHandler(BaseHandler):
    @authenticated_api
    def post(self):
        book_json = json.loads(self.request.body)
        success = 1
        msg = ''
        book_meta = {
            'book_name': book_json.get('book_name', ''),
            'author': book_json.get('author', ''),
            'ISBN10': book_json.get('ISBN10', ''),
            'ISBN13': book_json.get('ISBN13', ''),
            'publish': book_json.get('publish', ''),
            'tag_name': book_json.get('tag_name', '').split(' '),
            'book_src': book_json.get('book_src', ''),
        }
        if len(book_meta['book_name']) == 0:
            success = 0
            msg = u'无效书名'
        elif len(book_meta['ISBN10']) != 10 or len(book_meta['ISBN13']) != 13:
            success = 0
            msg = u'无效ISBN'
        else:
            isbn10_data = item_db.fetch_books_by_ISBN10(self.item_db, book_meta['ISBN10'])
            isbn13_data = item_db.fetch_books_by_ISBN13(self.item_db, book_meta['ISBN13'])
            if len(isbn10_data) == 0 and len(isbn13_data) == 0:
                item_db.add_book(self.item_db, book_meta)
            else:
                success = 0
                msg = u'ISBN已存在'
        self.json_write({'success': success, 'msg': msg})


class CheckIsbnHandler(BaseHandler):
    def get(self):
        isbn = self.get_argument('isbn', '')
        try:
            res = requests.get('https://api.douban.com/v2/book/isbn/{}'.format(isbn))
            data = res.json()
            book_name = data.get('title', '')
            if len(book_name) == 0:
                book_name = '{}-{}'.format(data['series']['title'], data['subtitle'])
            author = ','.join(data['author'])
            publish = data['publisher']
            isbn10 = data['isbn10']
            isbn13 = data['isbn13']
            tag_name = ' '.join([tag['name'] for tag in data['tags']])
            self.json_write({'success': 1,
                             'msg': 'success',
                             'book_name': book_name,
                             'author': author,
                             'publish': publish,
                             'ISBN10': isbn10,
                             'ISBN13': isbn13,
                             'tag_name': tag_name})
        except:
            self.json_write({'success': 0, 'msg': 'failed to check isbn'})


class AddUserHandler(BaseHandler):
    @authenticated_api
    def post(self):
        user_json = json.loads(self.request.body)
        success = 1
        msg = ''
        user_meta = {
            'username': user_json.get('username', ''),
            'name': user_json.get('name', ''),
            'pwd': user_json.get('pwd', ''),
            'phone': user_json.get('phone', ''),
            'role': 'user'
        }
        user_exist = user_db.login_fetch_user(self.user_db, user_json.get('username', ''))
        if len(user_meta['username']) == 0:
            success = 0
            msg = u'无效账户'
        elif user_exist:
            success = 0
            msg = u'该账户已被使用'
        else:
            user_db.add_new_user(self.user_db, user_meta)
        self.json_write({'success': success, 'msg': msg})


class FetchUsernameHandler(BaseHandler):
    @authenticated
    def get(self):
        user_data = user_db.fetch_user_by_id(self.user_db, self.current_user)
        if user_data:
            self.json_write({'success': 1, 'username': user_data.get('username', '-')})
        else:
            self.json_write({'success': 0, 'msg': 'no such user_id'})


class ChangePasswordHandler(BaseHandler):
    @authenticated
    def post(self):
        user_json = json.loads(self.request.body)
        success = 1
        user_data = user_db.login_fetch_user(self.user_db, user_json.get('username', ''))
        if not user_data:
            success = 0
            msg = u'无法找到该账户'
        else:
            pwd = user_json.get('pwd', '')
            pwd = get_md5(pwd+salt)
            if pwd != user_data['pwd']:
                success = 0
                msg = u'密码错误'
            else:
                user_data['pwd'] = get_md5(user_json.get('new_pwd', '')+salt)
                user_db.save_user(self.user_db, user_data)
                msg = user_data['name']
        self.json_write({'success': success, 'msg': msg})


class SearchBookHandler(BaseHandler):
    def get(self):
        isbn = self.get_argument('isbn', '')
        success = 1
        msg = ''
        book_data = dict()
        if len(isbn) != 10 and len(isbn) != 13:
            success = 0
            msg = u'ISBN长度不合法'
        else:
            if len(isbn) == 10:
                book_data = item_db.fetch_book_by_ISBN10(self.item_db, isbn)
            elif len(isbn) == 13:
                book_data = item_db.fetch_book_by_ISBN13(self.item_db, isbn)
            else:
                book_data = None
            if not book_data:
                book_data = dict()
                success = 0
                msg = u'未搜索到该书'
        book_data['success'] = success
        book_data['msg'] = msg
        book_data['_id'] = str(book_data.get('_id', ''))
        book_data['tag_name'] = ' '.join(book_data.get('tag_name', []))
        self.json_write(book_data)


class ModifyBookHandler(BaseHandler):
    @authenticated_api
    def post(self):
        book_json = json.loads(self.request.body)
        success = 1
        msg = ''
        book_data = item_db.fetch_book_by_id(self.item_db, book_json['_id'])
        if not book_data:
            success = 0
            msg = u'id错误，出现此问题请联系开发'
        else:
            book_json['tag_name'] = book_json['tag_name'].split(' ')
            book_json['_id'] = ObjectId(book_json['_id'])
            if len(book_json['ISBN10']) != 10:
                success = 0
                msg = u'10位ISBN长度不合法'
            elif len(book_json['ISBN13']) != 13:
                success = 0
                msg = u'13位ISBN长度不合法'
            else:
                item_db.modify_book(self.item_db, book_json)
        self.json_write({'success': success, 'msg': msg})


class DeleteBookHandler(BaseHandler):
    @authenticated_api
    def get(self):
        _id = self.get_argument('_id', '')
        book_data = item_db.fetch_book_by_id(self.item_db, _id)
        if not book_data:
            success = 0
            msg = u'id错误，出现此问题请联系开发'
        else:
            item_db.delete_book_by_id(self.item_db, _id)
            success = 1
            msg = ''
        self.json_write({'success': success, 'msg': msg})
