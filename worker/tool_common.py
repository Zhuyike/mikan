#!/usr/bin/env python
# encoding: utf-8


import hashlib


def get_md5(string):
    md5 = hashlib.md5()
    md5.update(string)
    return md5.hexdigest()
