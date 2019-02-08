#!/usr/bin/env python
# encoding: utf-8

import logging
from bson import ObjectId


def add_record(db, record_data):
    db.record.insert(record_data)


def fetch_record_by_user_id(db, user_id):
    return list(db.record.find({'user_id': user_id}))