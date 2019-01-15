#!/usr/bin/env python
# encoding: utf-8

from tornado.web import RequestHandler
import logging
import traceback


class BaseHandler(RequestHandler):

    NO_AUTH_URL = ['/api/student/pdf_callback']

    def prepare(self):
        self.scan = self.settings['mongodb']['scanservice']
        self.analysisdb = self.settings['mongodb']['subject_analysis']
        self.klx_analysis = self.settings['mongodb']['klx_analysis']
        self.examdb = self.settings['mongodb']['exam']
        self.roomsdb = self.settings['mongodb']['exam_rooms']
        self.union_exam_db = self.settings['mongodb']['klx_analysis']
        self.union_students_db = self.settings['mongodb']['union_exam_students']
        self.redis = self.settings['redis']

    def write_error_response(self, wrong_message):
        resp = {'status': -1, 'wrong_message': wrong_message, 'message': u'内部调用错误，请稍后重试'}
        super(BaseHandler, self).write(resp)

    def wrap_write(self, resp):
        if isinstance(resp, dict):
            resp['status'] = 0
            resp['message'] = 'success'
            super(BaseHandler, self).write(resp)
        else:
            self.write_error_response(resp)


class DemoHandler(RequestHandler):
    def get(self):
        a = self.get_argument('a', 0)
        b = self.get_argument('b', 0)
        self.write(a+b)

