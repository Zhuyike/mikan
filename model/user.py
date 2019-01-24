#!/usr/bin/env python
# encoding: utf-8

import logging
from bson import ObjectId
from requests import HTTPError


def login_fetch_user(db, username):
    return db.owner.find_one({'username': username})
