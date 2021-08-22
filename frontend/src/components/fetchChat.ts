import { Dispatch, SetStateAction, useEffect } from "react";
import { DialogMessage } from "./dialog/dialog";

export type BackEmotions = Record<"POSITIVE" | "NEGATIVE" | "NEUTRAL", number>;

export type BackMessage = {
  text: string;
  timestamp: string;
  emotions: BackEmotions;
  pk: string;
};

type BackendChat = {
  account: string;
  timestamp: string;
  messages: BackMessage[];
};

type BackendChats = {
  chats: Record<string, BackendChat>;
};

export const useInitChat = (
  setDialog: Dispatch<SetStateAction<DialogMessage[]>>,
  setAccount: Dispatch<SetStateAction<string | undefined>>
) => {
  const fetchChat = async () => {
    try {
      const initChat = (await (
        await fetch(`${process.env.CHAT_API}/chats/`)
      ).json()) as BackendChats;
      const chats = Object.values(initChat.chats);
      if (chats.length === 0) throw Error("No chats found");
      return chats[0];
    } catch (err) {
      console.error(err);
    }
  };

  const initChat = (
    chat: BackendChat | undefined,
    setDialog: Dispatch<SetStateAction<DialogMessage[]>>
  ) => {
    if (!chat) return console.error("Chat is undefined");
    setAccount(chat.account);
    console.log("SET ACCOUNT");
    setDialog(() =>
      chat.messages.map((backMessage) => {
        return { text: backMessage.text, character_name: "Waifu" };
      })
    );
  };

  useEffect(() => {
    fetchChat().then(
      (chat) => initChat(chat, setDialog),
      (reason) => console.error(reason)
    );
  }, [setDialog]);
};
