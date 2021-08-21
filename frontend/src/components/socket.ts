import { Dispatch, SetStateAction, useEffect } from "react";
import { BackEmotions, BackMessage } from "./fetchChat";

const convertWaifuEmotion = ({ NEGATIVE, NEUTRAL, POSITIVE }: BackEmotions) => {
  if (POSITIVE > NEGATIVE && POSITIVE > NEUTRAL) return "happy";
  return "standart";
};

export const useSocket = (
  setWaifuEmotion: Dispatch<SetStateAction<string>>,
  account: string | undefined
) => {
  useEffect(() => {
    if (!account) return;

    const socket = new WebSocket(`ws://localhost/chats/${account}`);

    socket.onopen = (e) => {
      // socket.send("Hello, server");
      console.log("SOCKET OPENED");
    };

    socket.onmessage = (e) => {
      // console.log(e);
      const newMessage = e.data as BackMessage;
      const emotion = convertWaifuEmotion(newMessage.emotions);
      // const waifuEmotion = String(e.data);
      setWaifuEmotion(emotion);
    };
  }, [account, setWaifuEmotion]);
};
