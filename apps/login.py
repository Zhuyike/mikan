#!/usr/bin/env python
# encoding: utf-8

from sample import BaseHandler
from requests import HTTPError
from model import user as user_db
import hashlib
import json
salt = 'mikan_salt'


def get_md5(string):
    md5 = hashlib.md5()
    md5.update(string)
    return md5.hexdigest()


class LoginHandler(BaseHandler):
    def get(self):
        self.render('login.html')


class ApiLoginHandler(BaseHandler):
    def post(self):
        user_json = json.loads(self.request.body)
        username = user_json.get('username', '')
        password = user_json.get('password__', '')
        user = user_db.login_fetch_user(self.user_db, username)
        if user:
            password = get_md5(password + salt)
            if user['pwd'] == password:
                self.write({'login': 'success', 'msg': ''})
            else:
                self.write({'login': 'failed', 'msg': 'failed wrong password'})
        else:
            self.write({'login': 'failed', 'msg': 'failed wrong user'})
