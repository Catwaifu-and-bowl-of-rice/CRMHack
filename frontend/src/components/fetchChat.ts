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
    const initChat = (await (await fetch("/chats/")).json()) as BackendChats;
    const chats = Object.values(initChat.chats)[0];
    return chats;
  };

  const initChat = (
    chat: BackendChat,
    setDialog: Dispatch<SetStateAction<DialogMessage[]>>
  ) => {
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
      (chats) => initChat(chats, setDialog),
      (reason) => console.error(reason)
    );
  }, [setDialog]);
};
