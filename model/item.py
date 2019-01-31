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