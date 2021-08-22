import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
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
  setAccount: Dispatch<SetStateAction<string | undefined>>,
  setWaifuEmotion: Dispatch<SetStateAction<string>>
) => {
  const fetchChat = async () => {
    // try {
    // console.log(process.env);
    const CHAT_API = "http://crmhack-chat.azurewebsites.net/api";
    const fetchedChats = (await (
      await fetch(`${/*process.env.REACT_APP_CHAT_API*/ CHAT_API}/chats/`)
    ).json()) as BackendChats;
    console.log("FETCHED CHATS", fetchedChats);
    const chats = Object.values(fetchedChats.chats);

    if (chats.length === 0) {
      console.error("/chats/ is empty :C");
      return;
    }

    return chats[0];
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const convertWaifuEmotion = ({ NEGATIVE, NEUTRAL, POSITIVE }: BackEmotions) => {
    // return Object.entries(emotions).sort((a, b) => a[1] - b[1])[0];
    // if (POSITIVE > NEGATIVE && POSITIVE > NEUTRAL) return "happy";
    if (POSITIVE > NEGATIVE && POSITIVE > NEUTRAL) return "positive";
    if (NEGATIVE > POSITIVE && NEGATIVE > NEUTRAL) return "negative";
    return "standart";
  };

  const initChat = useCallback(
    (
      chat: BackendChat | undefined,
      setDialog: Dispatch<SetStateAction<DialogMessage[]>>,  setWaifuEmotion: Dispatch<SetStateAction<string>>
    ) => {
      if (!chat) return console.error("Chat is undefined");
      setAccount(chat.account);
      console.log("SET ACCOUNT");

      const message = chat.messages[chat.messages.length - 1]

      convertWaifuEmotion(message.emotions)

      setDialog(() =>
        chat.messages
          .sort(
            (a, b) =>
              new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf()
          )
          .map(({ text, pk }) => {
            return { text, pk, character_name: "Waifu" };
          })
      );
    },
    [setAccount]
  );

  useEffect(() => {
    fetchChat().then(
      (chat) => initChat(chat, setDialog, setWaifuEmotion),
      (reason) => console.error(reason)
    );
  }, [setDialog, initChat,setWaifuEmotion]);
};
