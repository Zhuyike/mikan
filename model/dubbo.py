import requests
from tornado.gen import coroutine, Return
from config import *

dubbo_user_proxy_server = config_get('klx_dubbo_proxy_server')
dubbo_user_group = config_get('klx_dubbo_group')

@coroutine
def _dubbo_request(method, params, dubbo_user_proxy_server=dubbo_user_proxy_server, dubbo_user_group=dubbo_user_group):
    url = '{}?service={}&version={}&group={}&method={}&mode=legacy'.format(
        dubbo_user_proxy_server,
        'com.voxlearning.utopia.service.user.api.service.kuailexue.DPKuailexueLoader',
        '20161221',
        dubbo_user_group,
        method)
    ret = requests.post(url, json={'paramValues': params})
    raise Return(ret.json()["data"])


@coroutine
def _dubbo_request_type2(method, params, dubbo_user_proxy_server, dubbo_user_group=dubbo_user_group):
    url = '{}?service={}&version={}&group={}&method={}'.format(
        dubbo_user_proxy_server,
        'com.voxlearning.utopia.service.user.api.DPUserService',
        '2016.08.19',
        dubbo_user_group,
        method)
    ret = requests.post(url, json={'paramValues': params})
    raise Return(ret.json())