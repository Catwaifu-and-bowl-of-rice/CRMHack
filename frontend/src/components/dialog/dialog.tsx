import { useEffect, useRef } from "react";
import "./dialog.scss";

export type DialogMessage = {
  text: string;
  character_name: string;
  pk: string;
};

type DialogProps = {
  dialog: DialogMessage[];
};

const characterColors: Record<string, { clr: string }> = {
  Waifu: {
    clr: "#FDBC00",
  },
  Semen: {
    clr: "#3DD643",
  },
};

const Dialog = ({ dialog }: DialogProps) => {
  const listRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (listRef?.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [dialog]);

  return (
    <section className="dialog" ref={listRef}>
      {dialog.map(({ character_name, text, pk }) => (
        <div
          key={pk}
          className={`dialogEntry ${character_name === "Waifu" ? "Waifu" : ""}`}
        >
          <h4
            style={{ color: characterColors[character_name].clr }}
            className="character_name"
          >
            {character_name}
          </h4>
          <div className="text">
            <p>{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Dialog;
