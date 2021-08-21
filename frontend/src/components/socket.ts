import { Dispatch, SetStateAction } from "react";
import { BackEmotions, BackMessage } from "./fetchChat";

const convertWaifuEmotion = ({ NEGATIVE, NEUTRAL, POSITIVE }: BackEmotions) => {
  if (POSITIVE > NEGATIVE && POSITIVE > NEUTRAL) return "happy";
  return "standart";
};

export const useSocket = (
  setWaifuEmotion: Dispatch<SetStateAction<string>>,
  account: string | undefined
) => {
  const socket = new WebSocket(`/chats/${account}`);

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
};
