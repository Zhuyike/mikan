from tornado.web import RequestHandler


class DemoHandler(RequestHandler):
    def get(self):
        a = self.get_argument('a', 0)
        b = self.get_argument('b', 0)
        self.write(a+b)

