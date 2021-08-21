import { Dispatch, SetStateAction, useEffect } from "react";
import { DialogMessage } from "./dialog/dialog";

type BackEmotions = Record<"POSITIVE" | "NEGATIVE" | "NEUTRAL", number>;

type BackMessage = {
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
  setDialog: Dispatch<SetStateAction<DialogMessage[]>>
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
    setDialog(() =>
      chat.messages.map((backMessage) => {
        return { text: backMessage.text, character_name: "Waifu" };
      })
    );
  };

  useEffect(() => {
    fetchChat().then((chats) => initChat(chats, setDialog));
  }, [setDialog]);
};
