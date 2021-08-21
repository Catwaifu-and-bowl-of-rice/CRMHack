import falcon.asgi
from .chat import ChatResource
from .storage import ChatRepository, Chat as ChatStorage

app = falcon.asgi.App()

repository = ChatRepository()

chats = ChatResource(repository)

app.add_route("/chats/", chats, suffix="list")
app.add_route("/chats/{account}/", chats)
