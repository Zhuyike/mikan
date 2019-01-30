#!/usr/bin/env python
# encoding: utf-8
from apps import sample
from apps import login
from apps import main

route_list = [
    (r'/demo', sample.DemoHandler),
    (r'/login', login.LoginHandler),
    (r'/main', main.MainHandler),

    (r'/api/login', login.ApiLoginHandler),
    (r'/api/uploadfile', main.UpLoadHandler)
]