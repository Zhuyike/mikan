#!/usr/bin/env python
# encoding: utf-8

import logging
from bson import ObjectId
from requests import HTTPError


def fetch_books_by_ISBN10(db, ISBN10):
    return list(db.books.find({'ISBN10': ISBN10}))


def fetch_books_by_ISBN13(db, ISBN13):
    return list(db.books.find({'ISBN13': ISBN13}))


def add_book(db, book_data):
    db.books.insert(book_data)


def fetch_book_by_ISBN10(db, ISBN10):
    return db.books.find_one({'ISBN10': ISBN10})


def fetch_book_by_ISBN13(db, ISBN13):
    return db.books.find_one({'ISBN13': ISBN13})


def fetch_book_by_id(db, _id):
    return db.books.find_one({'_id': ObjectId(_id)})


def modify_book(db, book_data):
    db.books.save(book_data)


def delete_book_by_id(db, _id):
    db.books.remove({'_id': ObjectId(_id)})


def fetch_all_book(db):
    return list(db.books.find({}))
