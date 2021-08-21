import React, { useState } from "react";
import examplia from "@characters/examplia/examplia";
import { testroom } from "@backgrounds/bcgIndex";
import "./App.scss";
import Character from "./components/character/character";
import Dialog, { DialogMessage } from "./components/dialog/dialog";

const App = () => {
  const [dialog, setDialog] = useState<DialogMessage[]>([
    {
      text: "Pamagi",
      character_name: "Waifu",
    },
    {
      text: "Nyet",
      character_name: "Semen",
    },
  ]);

  const addDialogMessage = (text: string, character_name: string) => {
    setDialog((curDia) => [...curDia, { text, character_name }]);
  };

  // let socket = new WebSocket("ws://localhost:4000");

  // socket.onopen = function(e) {
  //   alert("[open] Connection established");
  //   alert("Sending to server");
  //   socket.send("My name is John");
  // };

  return (
    <div className="App">
      <div className="novelWrapper">
        <img src={testroom} className="bcg" />
        <section className="characters">
          {<Character character={examplia} emotion="testtag" />}
        </section>
        <Dialog dialog={dialog} />
        {/* <h4 className="charName">Examplia</h4> */}
        {/* <p>Bla bla bla</p> */}
      </div>
    </div>
  );
};

export default App;
