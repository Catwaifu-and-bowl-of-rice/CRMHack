import requests
import click
import json

URL = "http://crmhack-chat.azurewebsites.net/api/chats/"


@click.group("chats")
def chats():
    pass


@chats.command("list")
def list_chats():
    response = requests.get(URL)
    data = response.json()
    print(json.dumps(data, indent=4, ensure_ascii=False))


@chats.command("create")
def create_chat():
    response = requests.post(URL)
    data = response.json()
    print(json.dumps(data, indent=4, ensure_ascii=False))


@chats.command("message")
@click.option('-m', '--message', 'message')
@click.option('-a', '--account', 'account')
def create_message(message, account):
    response = requests.post(f"{URL}{account}/", json={"text": message})
    data = response.json()
    print(json.dumps(data, indent=4, ensure_ascii=False))


cli = click.CommandCollection(sources=[chats])

if __name__ == '__main__':
    cli()
