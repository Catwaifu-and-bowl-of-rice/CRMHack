import { Dispatch, SetStateAction, useEffect } from "react";
import { BackEmotions, BackMessage } from "./fetchChat";

const convertWaifuEmotion = ({ NEGATIVE, NEUTRAL, POSITIVE }: BackEmotions) => {
  // if (POSITIVE > NEGATIVE && POSITIVE > NEUTRAL) return "happy";
  if (POSITIVE > NEGATIVE && POSITIVE > NEUTRAL) return "positive";
  if (NEGATIVE > POSITIVE && NEGATIVE > NEUTRAL) return "negative";
  return "standart";
};

export const useSocket = (
  setWaifuEmotion: Dispatch<SetStateAction<string>>,
  account: string | undefined
) => {
  useEffect(() => {
    if (!account) return console.error("Account is undefined");

    const socket = new WebSocket(`${process.env.WS_CHAT_API}/chats/${account}`);

    socket.onopen = (e) => {
      // socket.send("Hello, server");
      console.log("SOCKET OPENED");
    };

    socket.onmessage = (e) => {
      // console.log(e);
      const newMessage = e.data as BackMessage;
      console.log("Received new message", newMessage);
      const emotion = convertWaifuEmotion(newMessage.emotions);
      // const waifuEmotion = String(e.data);
      setWaifuEmotion(emotion);
    };
  }, [account, setWaifuEmotion]);
};
