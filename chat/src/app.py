import falcon.asgi
from falcon import media

from .chat import ChatResource
from .storage import ChatRepository
from .handlers import JSONDateHandler

app = falcon.asgi.App()

repository = ChatRepository()

chats = ChatResource(repository)

handlers = media.Handlers({
    falcon.MEDIA_JSON: JSONDateHandler(),
})

app.add_route("/", chats, suffix="list")
app.add_route("/{account}/", chats)

app.resp_options.media_handlers.update(handlers)

