import falcon.asgi
from .chat import ChatList, Chat
from .storage import ChatRepository

app = falcon.asgi.App()

repository = ChatRepository()

app.add_route("/chats", ChatList(repository))
app.add_route("/chats/{account}", Chat(repository))
