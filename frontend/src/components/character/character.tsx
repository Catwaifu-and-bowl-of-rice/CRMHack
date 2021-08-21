import { CharacterT, Emotion } from "@ctypes/character";

type CharacterProps = {
  position?: "LEFT | CENTER | RIGHT";
  character: string; // CharacterT;
  emotion: Emotion;
};

const Character = ({ position, character, emotion }: CharacterProps) => {
  return (
    <img
      src={
        /*character[emotion].img */ `/../images/characters/${character}-${emotion}.gif`
      }
      className="character left"
    />
  );
};

export default Character;
