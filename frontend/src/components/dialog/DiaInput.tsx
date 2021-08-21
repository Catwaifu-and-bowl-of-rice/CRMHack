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
    <section className="diaInput">
      <input type="text" onChange={setInputHandler} />
      <button onClick={() => sendMessage(currentInput)}>{">"}</button>
    </section>
  );
};

export default DiaInput;
