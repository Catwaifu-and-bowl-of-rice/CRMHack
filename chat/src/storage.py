from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Iterable, List
from uuid import uuid4

import requests

from .config import Config


@dataclass
class Message:
    text: str = field(default="")
    timestamp: datetime = field(default_factory=datetime.now)
    emotions: Dict[str, float] = field(default_factory=dict)
    pk: str = field(default_factory=lambda: str(uuid4()))

    async def get_emotions(self):
        headers = {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": Config.EMOTICON_API_KEY,
        }
        data = {
            "documents": [
                {
                    "countryHint": "RU",
                    "id": self.pk,
                    "text": self.text,
                }
            ]
        }
        response = requests.post(
            Config.EMOTICON_API_URL,
            json=data,
            headers=headers,
        )
        data = response.json()
        documents = data["documents"]
        message = next(item for item in documents if item["id"] == self.pk)
        emotions = message["confidenceScores"]
        self.emotions = emotions


@dataclass
class Chat:
    account: str = field(default_factory=lambda: str(uuid4()))
    timestamp: datetime = field(default_factory=datetime.now)
    messages: List[Message] = field(default_factory=list)


@dataclass
class ChatRepository:
    chats: Dict[str, Chat] = field(default_factory=dict)

    def __getitem__(self, item: str) -> Chat:
        return self.chats[item]

    def __setitem__(self, key: str, value: Chat):
        self.chats[key] = value

    def keys(self) -> Iterable[str]:
        return self.chats.keys()
