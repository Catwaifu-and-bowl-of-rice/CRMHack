import { CharacterT, Emotion } from "@ctypes/character";

type CharacterProps = {
  position?: "LEFT | CENTER | RIGHT";
  character: CharacterT;
  emotion: Emotion;
};

const Character = ({ position, character, emotion }: CharacterProps) => {
  return <img src={character[emotion].img} className="character left" />;
};

export default Character;
