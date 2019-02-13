#!/usr/bin/env python
# encoding: utf-8

import time
import route
import redis
import logging
import argparse
import tornado.httpserver
import tornado.ioloop
import tornado.web
from pymongo import MongoClient
from tornado.web import Application
from config import *

g_config = None


def db_instance():
    mongo_client = MongoClient(host=config_get('mongo_host'), port=int(config_get('mongo_port')))
    dbs = dict()
    dbs['user'] = mongo_client['user']
    dbs['item'] = mongo_client['item']
    dbs['record'] = mongo_client['record']
    logging.info('Mikan: connect to mongodb!')
    return dbs


class RunMikan(Application):
    def __init__(self, args):
        pool = redis.ConnectionPool(host=config_get('redis_host'),
                                    port=config_get('redis_port'),
                                    password=config_get('redis_password'))
        self.db = db_instance()
        self.redis = redis.Redis(connection_pool=pool)
        if not os.path.exists(config_get('default_file')):
            os.makedirs(config_get('default_file'))
        app_settings = {
            'db': self.db,
            'redis': self.redis,
            'debug': True if str(config_get('debug')) == '1' else False,
            'allow_plural_login': True if str(config_get('allow_plural_login')) == '1' else False,
            'login_ttl': int(config_get('login_ttl')),
            'default_file': config_get('default_file'),
            'borrow_max': config_get('borrow_max'),
        }
        super(RunMikan, self).__init__(handlers=route.route_list,
                                       template_path=os.path.join(os.path.dirname(__file__), "templates"),
                                       static_path=os.path.join(os.path.dirname(__file__), "static"),
                                       login_url='/login',
                                       **app_settings)


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG,
                        format='[%(levelname)1.1s %(asctime)s %(module)s:%(lineno)d] %(message)s',
                        datefmt='%y%m%d %H:%M:%S')
    logging.info("Mikan: Hello")
    argp = argparse.ArgumentParser()
    argp.add_argument('--debug', default=1, type=int)
    argp.add_argument('--port', default=8134, type=int)
    args = argp.parse_args()
    load_config('./server.conf')
    config_update('port', args.port)
    app = RunMikan(args)
    http_server = tornado.httpserver.HTTPServer(app, xheaders=True)
    http_server.listen(args.port)
    logging.info("Mikan: start service at " + time.ctime() + "\n")
    tornado.ioloop.IOLoop.instance().start()
