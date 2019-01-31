#!/usr/bin/env python
# encoding: utf-8

from sample import BaseHandler
from requests import HTTPError
from tornado.web import authenticated
from worker.tool_common import authenticated_api
from model import item as item_db
from bson import ObjectId
from model import user as user_db
import hashlib
import requests
import json


class MainHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('main.html', default_img_src=self.settings['default_file'])


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
