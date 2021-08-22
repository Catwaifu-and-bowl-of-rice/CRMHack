import { ChangeEventHandler, useState } from "react";
import "./diaInput.scss";

type DiaInputProps = {
  sendMessage: (msg: string) => void;
};

const DiaInput = ({ sendMessage }: DiaInputProps) => {
  const [currentInput, setInput] = useState<string>("");

  const setInputHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.target.value);
  };

  return (
    <form
      className="diaInput"
      action="#"
      onSubmit={(e) => {
        e.preventDefault();
        if (currentInput === "") return;
        sendMessage(currentInput);
        setInput("");
      }}
    >
      <input type="text" onChange={setInputHandler} value={currentInput} />
      <button>{">"}</button>
    </form>
  );
};

export default DiaInput;
