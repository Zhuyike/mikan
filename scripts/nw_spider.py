#!/usr/bin/env python
# encoding: utf-8

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time


class NwSpider(object):
    def __init__(self):
        self.driver = webdriver.PhantomJS()

    def run(self):
        self.driver.get('http://bbs.newwise.com/member.php?mod=logging&action=login')
        self.driver.find_elements_by_class_name()


if __name__ == '__main__':
    NwSpider = NwSpider()
    NwSpider.run()
