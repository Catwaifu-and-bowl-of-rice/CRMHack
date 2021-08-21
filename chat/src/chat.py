import asyncio
import collections
from dataclasses import asdict
from uuid import uuid4

import falcon
from falcon.asgi.ws import WebSocket
from falcon.errors import WebSocketDisconnected

from .storage import Chat, ChatRepository, Message


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
        media = {
            "account": chat.account,
            "timestamp": chat.timestamp,
        }
        resp.media = media
        resp.status = falcon.HTTP_201
        subscribers = self.repository.subscribers
        await asyncio.gather(
            *[subscriber.send_media(media) for subscriber in subscribers.values()]
        )

    async def on_websocket_list(self, ws):
        try:
            await ws.accept(subprotocol="wamp")
        except WebSocketDisconnected:
            return

        socket_id = str(uuid4())

        self.repository.subscribers[socket_id] = ws

        messages = collections.deque()

        async def sink():
            while True:
                try:
                    message = await ws.receive_media()
                except falcon.WebSocketDisconnected:
                    del self.repository.subscribers[socket_id]
                    break
                messages.append(message)
                # TODO process the message

        sink_task = falcon.create_task(sink())

        while not sink_task.done():
            while ws.ready and not messages and not sink_task.done():
                await asyncio.sleep(0)
            try:
                message = messages.popleft()
                pass
            except falcon.WebSocketDisconnected:
                del self.repository.subscribers[socket_id]
                break

        sink_task.cancel()
        try:
            await sink_task
        except asyncio.CancelledError:
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
        media = asdict(message)
        resp.media = media
        resp.status = falcon.HTTP_201
        subscribers = chat.subscribers
        await asyncio.gather(
            *[subscriber.send_media(media) for subscriber in subscribers.values()]
        )

    async def on_websocket(self, ws: WebSocket, account):
        try:
            await ws.accept(subprotocol="wamp")
        except WebSocketDisconnected:
            return

        chat = self.repository[account]
        socket_id = str(uuid4())

        chat.subscribers[socket_id] = ws

        messages = collections.deque()

        async def sink():
            while True:
                try:
                    message = await ws.receive_media()
                except falcon.WebSocketDisconnected:
                    del chat.subscribers[socket_id]
                    break
                messages.append(message)
                # TODO process the message

        sink_task = falcon.create_task(sink())

        while not sink_task.done():
            while ws.ready and not messages and not sink_task.done():
                await asyncio.sleep(0)
            try:
                message = messages.popleft()
                pass
            except falcon.WebSocketDisconnected:
                del chat.subscribers[socket_id]
                break

        sink_task.cancel()
        try:
            await sink_task
        except asyncio.CancelledError:
            pass
