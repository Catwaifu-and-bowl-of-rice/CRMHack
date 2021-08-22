import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { DialogMessage } from "./dialog/dialog";
import { BackEmotions, BackMessage } from "./fetchChat";

const convertWaifuEmotion = ({ NEGATIVE, NEUTRAL, POSITIVE }: BackEmotions) => {
  // return Object.entries(emotions).sort((a, b) => a[1] - b[1])[0];
  // if (POSITIVE > NEGATIVE && POSITIVE > NEUTRAL) return "happy";
  if (POSITIVE > NEGATIVE && POSITIVE > NEUTRAL) return "positive";
  if (NEGATIVE > POSITIVE && NEGATIVE > NEUTRAL) return "negative";
  return "standart";
};

export const useSocket = (
  setWaifuEmotion: Dispatch<SetStateAction<string>>,
  account: string | undefined,
  addDialogMessage: (message: DialogMessage) => void
) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!account) return console.error("Account is undefined");

    const socket = new WebSocket(`${process.env.WS_CHAT_API}/chats/${account}`);
    socketRef.current = socket;

    socket.onopen = (e) => {
      // socket.send("Hello, server");
      console.log("SOCKET OPENED");
    };

    socket.onmessage = (e) => {
      // console.log(e);
      const newMessage = e.data as BackMessage;
      console.log("Received new message", newMessage);
      const { emotions, pk, text } = newMessage;
      const emotion = convertWaifuEmotion(emotions);

      addDialogMessage({ text, pk, character_name: "Waifu" });
      // const waifuEmotion = String(e.data);
      setWaifuEmotion(emotion);
    };
  }, [account, setWaifuEmotion, addDialogMessage]);

  return [(message: string) => socketRef.current?.send(message)];
};
