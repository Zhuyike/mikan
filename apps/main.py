#!/usr/bin/env python
# encoding: utf-8

from sample import BaseHandler
from requests import HTTPError
from model import user as user_db
import hashlib
import json


class MainHandler(BaseHandler):
    def get(self):
        self.write('xxx')
