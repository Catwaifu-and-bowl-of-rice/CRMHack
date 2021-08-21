import { CharacterT, Emotion } from "@ctypes/character";

type CharacterProps = {
  position?: "LEFT | CENTER | RIGHT";
  character: CharacterT;
  emotion: Emotion;
};

const Character = ({ position, character, emotion }: CharacterProps) => {
  //return <img src={character[emotion].img} className="character left" />;
  console.log(character[emotion].img);
  return (
    <video className="character left" autoPlay loop muted>
      <source src={character[emotion].img} type="video/mp4" />
    </video>
  );
};

export default Character;
