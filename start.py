#!/usr/bin/env python
# encoding: utf-8

import ConfigParser
import os
import time
import route
import redis
import logging
import argparse
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from pymongo import MongoClient
from tornado.web import Application

g_config = None


def load_config(filename):
    global g_config
    cf = ConfigParser.ConfigParser()
    if os.path.isfile(filename):
        cf.read(filename)
        g_config = cf
    else:
        raise IOError(filename + ' does not exist or not file')


def config_update(key, value):
    global g_config
    g_config.set('default', key, str(value))


def config_get(key, default=None):
    global g_config
    try:
        value = g_config.get('default', key)
        if isinstance(value, basestring):
            value = value.strip('\'').strip('"')
        return value
    except ConfigParser.NoOptionError, e:
        if default is None:
            raise e
        else:
            return default


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
        app_settings = {
            'db': self.db,
            'redis': self.redis,
            'debug': True if str(config_get('debug')) == '1' else False,
            'allow_plural_login': True if str(config_get('allow_plural_login')) == '1' else False,
            'login_ttl': int(config_get('login_ttl'))
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