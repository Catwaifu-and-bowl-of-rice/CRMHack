import os


class Config:

    EMOTICON_API_KEY = os.getenv("EMOTICON_API_KEY")
    EMOTICON_API_URL = os.getenv("EMOTICON_API_URL")
