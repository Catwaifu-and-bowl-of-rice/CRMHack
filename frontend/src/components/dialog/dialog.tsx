import "./dialog.scss";

export type DialogMessage = {
  text: string;
  character_name: string;
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
  return (
    <section className="dialog">
      {dialog.map(({ character_name, text }, idx) => (
        <div
          key={idx}
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
