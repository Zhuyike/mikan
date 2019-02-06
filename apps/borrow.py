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
import os


class SearchVagueHandler(BaseHandler):
    def get(self):
        book_name = self.get_argument('book_name', '')
        author = self.get_argument('author', '')
        publish = self.get_argument('publish', '')
        tag_name = self.get_argument('tag_name', '')
        books = item_db.fetch_all_book(self.item_db)
        book_return = list()
        success = 1
        msg = ''
        try:
            for book in books:
                tag_value = False
                for tag in book['tag_name']:
                    if tag_name in tag:
                        tag_value = True
                if book_name in book['book_name'] and author in book['author'] \
                        and publish in book['publish'] and tag_value:
                    book['_id'] = str(book['_id'])
                    book_return.append(book)
        except:
            msg = u'BUG，出现此问题请联系开发'
            success = 0
        self.json_write({'success': success, 'msg': msg, 'data': book_return})
