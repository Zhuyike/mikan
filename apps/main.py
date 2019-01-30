#!/usr/bin/env python
# encoding: utf-8

from sample import BaseHandler
from requests import HTTPError
from tornado.web import authenticated
from bson import ObjectId
from model import user as user_db
import hashlib
import json


class MainHandler(BaseHandler):
    @authenticated
    def get(self):
        self.render('main.html')


class UpLoadHandler(BaseHandler):
    def post(self):
        file_metas = self.request.files["fff"]
        meta = file_metas[0]
        temp_name = '{}/{}.' + meta['filename'].split('.')[-1]
        file_name = temp_name.format(self.settings., ObjectId())
        self.redis.set(meta['filename'], file_name, ex=self.settings['login_ttl'])
        with open(file_name, 'wb') as f:
            f.write(meta['body'])
        self.json_write({'success': 1, 'msg': file_name})
