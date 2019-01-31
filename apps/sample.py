#!/usr/bin/env python
# encoding: utf-8

from tornado.web import RequestHandler
from model import user as user_db
import logging
import traceback


class BaseHandler(RequestHandler):
    def prepare(self):
        self.user_db = self.settings['db']['user']
        self.item_db = self.settings['db']['item']
        self.record_db = self.settings['db']['record']
        self.redis = self.settings['redis']
        self.allow_plural_login = self.settings['allow_plural_login']
        self.role = ''

    def get_current_user(self):
        ip = self.request.remote_ip
        agent = self.request.headers['User-Agent']
        session_key = self.redis.get('{}:{}'.format(ip, agent))
        if session_key:
            username = self.redis.get(session_key)
            if not self.allow_plural_login:
                if self.redis.get(username) != session_key:
                    username = None
            user_data = user_db.fetch_user_by_id(self.user_db, username)
            if user_data:
                self.role = user_data['role']
            else:
                self.role = ''
            return username
        else:
            return None

    def write_error_response(self, wrong_message):
        resp = {'status': -1, 'wrong_message': wrong_message, 'message': u'内部调用错误，请稍后重试'}
        super(BaseHandler, self).write(resp)

    def json_write(self, resp):
        if isinstance(resp, dict):
            resp['status'] = 0
            resp['message'] = 'success'
            super(BaseHandler, self).write(resp)
        else:
            self.write_error_response(resp)

    def write_error(self, status_code, **kwargs):
        self.write(u"Mikan: 阿喏，一个{}错误哦".format(status_code))

    def wrap_write(self, resp):
        if isinstance(resp, dict):
            resp['status'] = 0
            resp['message'] = 'success'
            super(BaseHandler, self).write(resp)
        else:
            self.write_error_response(resp)


class DemoHandler(BaseHandler):
    def get(self):
        a = self.get_argument('a', 0)
        b = self.get_argument('b', 0)
        try:
            a = int(a)
        except:
            a = 0
        try:
            b = int(b)
        except:
            b = 0
        self.write(str(a+b))
