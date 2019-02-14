#!/usr/bin/env python
# encoding: utf-8

from sample import BaseHandler
from tornado.web import authenticated
from worker.tool_common import *
from model import log as log_db
import time


class fetch_logging(BaseHandler):
    @authenticated_api
    def get(self):
        operation = self.get_argument('operation', '')
        target = self.get_argument('target', '')
        start_time = int(self.get_argument('start_time', '0'))
        end_time = int(self.get_argument('end_time', '222223968000'))
        user = self.get_argument('user', '')
        loggings = log_db.fetch_logging_all(self.record_db)
        logging_return = list()
        for logging in loggings:
            if not (operation in logging['operation']):
                continue
            if not (start_time <= logging['time'] <= end_time) :
                continue
            if not (user in logging['user']):
                continue
            if not (target in logging['target']):
                continue
            logging['_id'] = str(logging['_id'])
            logging['time'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(logging['time']))
            logging_return.append(logging)
        self.json_write({'success': 1, 'msg': '', 'data': logging_return})
