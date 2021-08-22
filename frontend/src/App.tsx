import { useState } from "react";
import DiaInput from "./components/dialog/DiaInput";
import Dialog, { DialogMessage } from "./components/dialog/dialog";
import { randomBytes } from "crypto";
import { useInitChat } from "./components/fetchChat";
import { useSocket } from "./components/socket";
import { background } from "@backgrounds/bcgIndex";
import waifu from "@characters/waifu/waifu";
import Character from "./components/character/character";
import { Emotion } from "@ctypes/character";
import "./App.scss";
import "./styles/novelWrapper.scss";

const App = () => {
  const [dialog, setDialog] = useState<DialogMessage[]>([
    {
      text: "Nyet",
      character_name: "Waifu",
      pk: "1",
    },
    {
      text: "Pamagi",
      character_name: "Semen",
      pk: "2",
    },
    {
      text: "Whoooma apoooma a aboba perdola. Superhyper gigachad. Hhuy uu ii asli epasue. Saoeurp.",
      character_name: "Semen",
      pk: "3",
    },
  ]);

  const [account, setAccount] = useState<string | undefined>();
  const [currentWaifuEmotion, setWaifuEmotion] = useState<Emotion>("standart");

  const addDialogMessage = (message: DialogMessage) => {
    setDialog((curDia) => [...curDia, message]);
  };
  const sendMessage = (msg: string) => {
    addDialogMessage({
      text: msg,
      character_name: "Semen",
      pk: randomBytes(8).toString("hex"),
    });
  };

  useInitChat(setDialog, setAccount);

  useSocket(setWaifuEmotion, account, addDialogMessage);

  return (
    <div className="App">
      <div className="novelWrapper">
        <img src={background} className="bcg" alt="Background" />
        <section className="characters">
          {<Character character={waifu} emotion={currentWaifuEmotion} />}
        </section>
        <Dialog dialog={dialog} />
        <DiaInput sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default App;
