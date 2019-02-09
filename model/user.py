#!/usr/bin/env python
# encoding: utf-8

import logging
from bson import ObjectId


def login_fetch_user(db, username):
    return db.user.find_one({'username': username})


def fetch_user_by_id(db, _id):
    return db.user.find_one({'_id': ObjectId(_id)})


def fetch_user_by_name(db, name):
    return db.user.find_one({'name': name})


def add_new_user(db, data):
    db.user.insert(data)


def save_user(db, data):
    db.user.save(data)


def delete_user_by_name(db, name):
    db.user.delete_one({'name': name})
