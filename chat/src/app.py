import falcon.asgi
from .chat import ChatList, Chat

app = falcon.asgi.App()

app.add_route("/chats", ChatList())
app.add_route("/chats/{account}", Chat())
