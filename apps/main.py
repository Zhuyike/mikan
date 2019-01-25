#!/usr/bin/env python
# encoding: utf-8

from sample import BaseHandler
from requests import HTTPError
from tornado.web import authenticated
from model import user as user_db
import hashlib
import json


class MainHandler(BaseHandler):
    @authenticated
    def get(self):
        print self.request.remote_ip
        print self.request.headers['User-Agent']
        self.write('xxx')
