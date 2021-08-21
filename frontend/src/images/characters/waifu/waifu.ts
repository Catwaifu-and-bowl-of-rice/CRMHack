import { CharacterT } from "@ctypes/character";
import happyImg from "./waifu_happy.png";
import standartImg from "./waifu_standart.png";
import positiveVid from "./waifu-positive.mp4";
import standartVid from "./waifu-standart.mp4";
import negativeVid from "./waifu-negative.mp4";

const waifu: CharacterT = {
  happy: {
    img: happyImg,
  },
  // standart: {
  //   img: standartImg,
  // },
  positive: {
    img: positiveVid,
  },
  standart: {
    img: standartVid,
  },
  negative: {
    img: negativeVid,
  },
};

export default waifu;
