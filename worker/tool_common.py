#!/usr/bin/env python
# encoding: utf-8


import hashlib
import functools


def get_md5(string):
    md5 = hashlib.md5()
    md5.update(string)
    return md5.hexdigest()


def authenticated_api(method):
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        if not self.current_user:
            self.json_write({'success': 0, 'msg': '登录信息已失效'})
            return
        return method(self, *args, **kwargs)
    return wrapper
