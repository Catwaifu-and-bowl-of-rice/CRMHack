from typing import Dict, Deque, Optional, Iterable, List
from collections import deque
from falcon.asgi.ws import WebSocket


class Chat:

    def __init__(self, messages: Optional[Iterable[str]] = None, websockets: Iterable[WebSocket] = None):
        self.messages: Deque[str] = deque(messages) if messages is not None else deque()
        self.websockets: List[WebSocket] = list(websockets) if websockets is not None else []


class ChatRepository:

    def __init__(self):
        self.chats: Dict[str, Chat] = {}

    def __getitem__(self, item: str) -> Chat:
        return self.chats[item]

    def __setitem__(self, key: str, value: Chat):
        self.chats[key] = value

    def keys(self):
        return self.chats.keys()
