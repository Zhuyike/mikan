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
                if book['remain'] == 0:
                    continue
                tag_value = False
                for tag in book['tag_name']:
                    if tag_name in tag:
                        tag_value = True
                if book_name in book['book_name'] and author in book['author'] \
                        and publish in book['publish'] and tag_value:
                    book['_id'] = str(book['_id'])
                    book['tag_name'] = ' '.join(book['tag_name'])
                    book_return.append(book)
        except:
            msg = u'BUG，出现此问题请联系开发'
            success = 0
        self.json_write({'success': success, 'msg': msg, 'data': book_return})


class BorrowBookHandler(BaseHandler):
    @authenticated
    def get(self):
        _id = self.get_argument('_id', '')
        book = item_db.fetch_book_by_id(self.item_db, _id)
        time_point = self.get_argument('time', '1')
        start_time = int(time.time())
        end_time = start_time + 60*60*24*7
        if time_point == '2':
            end_time = start_time + 60*60*24*14
        if time_point == '3':
            end_time = start_time + 60*60*24*30
        if book:
            if book['remain'] > 0:
                book['remain'] -= 1
                item_db.modify_book(self.item_db, book)
                success = 1
                msg = u'借阅成功, 借阅时间从{}到{}'.format(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time)),
                                                       time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time)))
                record_data = {'user_id': self.get_current_user(),
                               'start_time': start_time,
                               'end_time': end_time,
                               'book_id': _id,
                               'finish': False}
                record_db.add_record(self.record_db, record_data)
            else:
                success = 0
                msg = u'该书库存不足'
        else:
            success = 0
            msg = u'无法查找到该书'
        self.json_write({'success': success, 'msg': msg})


class SearchUserRecordHandler(BaseHandler):
    @authenticated
    def get(self):
        record_list_return = list()
        try:
            record_list = record_db.fetch_record_by_user_id(self.record_db, self.get_current_user())
            ids = [record['book_id'] for record in record_list]
            book_list = item_db.fetch_book_by_ids(self.item_db, ids)
            book_dict = {str(book['_id']): book['book_name'] for book in book_list}
            for record in record_list:
                if record['finish']:
                    status = u'已归还'
                elif time.time() > record['end_time']:
                    status = u'超时未还'
                else:
                    status = u'正常借阅'
                record_temp = {
                    'start_time': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(record['start_time'])),
                    'end_time': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(record['end_time'])),
                    'book_name': book_dict[record['book_id']],
                    'finish': record['finish'],
                    '_id': str(record['_id']),
                    'status': status,
                }
                record_list_return.append(record_temp)
            success = 1
            msg = ''
        except:
            success = 0
            msg = u'BUG，出现此问题请联系开发'
        self.json_write({'success': success, 'msg': msg, 'data': record_list_return})


class CheckReturnCodeHandler(BaseHandler):
    @authenticated
    def get(self):
        pass
