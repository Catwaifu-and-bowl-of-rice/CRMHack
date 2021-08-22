import asyncio
import collections
from dataclasses import asdict
import logging
from typing import Dict
from uuid import uuid4

import falcon
from falcon.asgi.ws import WebSocket
from falcon.errors import WebSocketDisconnected

from .storage import Chat, ChatRepository, Message


logging.basicConfig(level=logging.DEBUG)


subscribers: Dict[str, WebSocket] = {}
chat_subscribers: Dict[str, Dict[str, WebSocket]] = collections.defaultdict(dict)


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
        media = asdict(chat)
        resp.media = media
        resp.status = falcon.HTTP_201
        #await asyncio.gather(
        #    *[subscriber.send_media(media) for subscriber in subscribers.values()]
        #)

    async def on_websocket_list(self, ws):
        try:
            await ws.accept(subprotocol="wamp")
        except WebSocketDisconnected:
            return

        socket_id = str(uuid4())

        subscribers[socket_id] = ws

        messages = collections.deque()

        async def sink():
            while True:
                try:
                    message = await ws.receive_media()
                except falcon.WebSocketDisconnected:
                    del subscribers[socket_id]
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
                del subscribers[socket_id]
                break

        sink_task.cancel()
        try:
            await sink_task
        except asyncio.CancelledError:
            pass

    async def on_get(self, req, resp, account):
        chat = self.repository[account]
        serialized = asdict(chat)
        del serialized["subscribers"]

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
        await asyncio.gather(
            *(subscriber.send_media(media) for subscriber in chat_subscribers[account].values())
        )

    async def on_delete(self, req, resp, account):
        await asyncio.gather(
            *(subscriber.close() for subscriber in chat_subscribers[account].values())
        )
        del chat_subscribers[account]
        del self.repository[account]
        resp.status = falcon.HTTP_204

    async def on_websocket(self, ws: WebSocket, account):
        try:
            await ws.accept(subprotocol="wamp")
        except WebSocketDisconnected:
            return

        chat = self.repository[account]
        socket_id = str(uuid4())

        chat_subscribers[account][socket_id] = ws

        messages = collections.deque()

        async def sink():
            while True:
                try:
                    message = await ws.receive_media()
                except falcon.WebSocketDisconnected:
                    del chat_subscribers[account[socket_id]]
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
                del chat_subscribers[account[socket_id]]
                break

        sink_task.cancel()
        try:
            await sink_task
        except asyncio.CancelledError:
            pass
