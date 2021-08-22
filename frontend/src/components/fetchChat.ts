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
      const fetchedChats = (await (
        await fetch(`${process.env.CHAT_API}/chats/`)
      ).json()) as BackendChats;
      const chats = Object.values(fetchedChats.chats);

      if (chats.length === 0) {
        console.error("/chats/ is empty :C");
        return;
      }

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
      chat.messages
        .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
        .map(({ text, pk }) => {
          return { text, pk, character_name: "Waifu" };
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
