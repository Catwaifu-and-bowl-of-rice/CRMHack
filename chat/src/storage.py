from typing import Dict, Deque, Optional, Iterable
from collections import deque


class Chat:

    def __init__(self, messages: Optional[Iterable[str]] = None):
        self.messages: Deque[str] = deque(messages) if messages is not None else deque()


class ChatRepository:

    def __init__(self):
        self.chats: Dict[str, Chat] = {}

    def __getitem__(self, item: str) -> Chat:
        return self.chats[item]

    def __setitem__(self, key: str, value: Chat):
        self.chats[key] = value
