import ConfigParser
import os


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