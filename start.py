#!/usr/bin/env python
# encoding: utf-8

import ConfigParser
import os
import logging
import route
import argparse
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from apps import sample
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
    logging.info('connect to mongodb!')
    return dbs


class RunMikan(Application):
    def __init__(self, args):
        self.db = db_instance()
        self.redis = ''
        app_settings = {
            'mongodb': self.db,
            'redis': self.redis,
        }
        super(RunMikan, self).__init__(handler=route.route_list, **app_settings)


if __name__ == "__main__":
    argp = argparse.ArgumentParser()
    argp.add_argument('--debug', default=1, type=int)
    argp.add_argument('--port', default=8134, type=int)
    args = argp.parse_args()
    load_config('./server.conf')
    config_update('port', args.port)
    tornado.options.parse_command_line()
    app = RunMikan(args)
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(args.port)
    tornado.ioloop.IOLoop.instance().start()