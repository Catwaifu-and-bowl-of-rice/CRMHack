import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import examplia from "@characters/examplia/examplia";
import { background } from "@backgrounds/bcgIndex";
import "./App.scss";
import Character from "./components/character/character";
import Dialog, { DialogMessage } from "./components/dialog/dialog";
import DiaInput from "./components/dialog/DiaInput";
import waifu from "@characters/waifu/waifu";
import { Emotion } from "@ctypes/character";
import { useInitChat } from "./components/fetchChat";

const App = () => {
  const [dialog, setDialog] = useState<DialogMessage[]>([
    {
      text: "Nyet",
      character_name: "Waifu",
    },
    {
      text: "Pamagi",
      character_name: "Semen",
    },
    {
      text: "Whoooma apoooma a aboba perdola. Superhyper gigachad. Hhuy uu ii asli epasue. Saoeurp.",
      character_name: "Semen",
    },
  ]);

  const addDialogMessage = (text: string, character_name: string) => {
    setDialog((curDia) => [...curDia, { text, character_name }]);
  };

  useInitChat(setDialog);

  const [currentWaifuEmotion, setWaifuEmotion] = useState<Emotion>("standart");

  const sendMessage = (msg: string) => {
    addDialogMessage(msg, "Semen");
  };

  return (
    <div className="App">
      <div className="novelWrapper">
        <img src={background} className="bcg" />
        <section className="characters">
          {<Character character={waifu} emotion={currentWaifuEmotion} />}
        </section>
        <Dialog dialog={dialog} />
        <DiaInput sendMessage={sendMessage} />
        {/* <h4 className="charName">Examplia</h4> */}
        {/* <p>Bla bla bla</p> */}
      </div>
    </div>
  );
};

export default App;
