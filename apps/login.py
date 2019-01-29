#!/usr/bin/env python
# encoding: utf-8

from sample import BaseHandler
from requests import HTTPError
from worker.tool_common import get_md5
from model import user as user_db
from bson import ObjectId
import json
salt = 'mikan_salt'


class LoginHandler(BaseHandler):
    def get(self):
        next_ = self.get_argument('next', '/main')
        self.render('login.html', next_=next_)


class ApiLoginHandler(BaseHandler):
    def post(self):
        user_json = json.loads(self.request.body)
        username = user_json.get('username', '')
        password = user_json.get('password__', '')
        user = user_db.login_fetch_user(self.user_db, username)
        if user:
            password = get_md5(password + salt)
            if user['pwd'] == password:
                ip = self.request.remote_ip
                agent = self.request.headers['User-Agent']
                redis_pipe = self.redis.pipeline(transaction=True)
                session_key = str(ObjectId())
                self.redis.set('{}:{}'.format(ip, agent), session_key, ex=self.settings['login_ttl'])
                self.redis.set(session_key, str(user['_id']), ex=self.settings['login_ttl'])
                self.redis.set(str(user['_id']), session_key, ex=self.settings['login_ttl'])
                redis_pipe.execute()
                self.write({'login': 'success', 'msg': u'欢迎回来：{}'.format(user['name'])})
            else:
                self.write({'login': 'failed', 'msg': 'failed wrong password'})
        else:
            self.write({'login': 'failed', 'msg': 'failed wrong user'})
