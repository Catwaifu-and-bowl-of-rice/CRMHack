from falcon.errors import WebSocketDisconnected
import falcon
import collections
import asyncio
from .storage import ChatRepository, Chat, Message
from dataclasses import asdict


class ChatResource:

    def __init__(self, repository: ChatRepository):

        self.repository = repository

    async def on_get_list(self, req, resp):
        """Get all the chats."""
        serialized = asdict(self.repository)

        resp.media = serialized
        resp.status = falcon.HTTP_200

    async def on_post_list(self, req, resp):
        """Create new chat"""
        chat = Chat()
        account = chat.account
        self.repository[account] = chat
        data = {
            "account": chat.account,
            "timestamp": chat.timestamp,
        }
        resp.media = data
        resp.status = falcon.HTTP_201

    async def on_websocket_list(self, ws):
        # create connection to push all the chats created
        pass

    async def on_get(self, req, resp, account):
        chat = self.repository[account]
        serialized = asdict(chat)

        resp.media = serialized
        resp.status = falcon.HTTP_200

    async def on_post(self, req, resp, account):
        media = await req.media
        text = media["text"]
        chat = self.repository[account]
        message = Message(
            text=text,
        )
        await message.get_emotions()
        chat.messages.append(message)
        resp.media = asdict(message)
        resp.status = falcon.HTTP_201

    async def on_websocket(self, ws, account):

        try:
            await ws.accept(subprotocol='wamp')
        except WebSocketDisconnected:
            return

        messages = collections.deque()

        async def sink():
            while True:
                try:
                    message = await ws.receive_text()
                except falcon.WebSocketDisconnected:
                    break

                messages.append(message)

        sink_task = falcon.create_task(sink())

        while not sink_task.done():
            while ws.ready and not messages and not sink_task.done():
                await asyncio.sleep(0)

            try:
                # await ws.send_text(messages.popleft())
                # TODO send messages
                pass
            except falcon.WebSocketDisconnected:
                break

        sink_task.cancel()
        try:
            await sink_task
        except asyncio.CancelledError:
            pass
