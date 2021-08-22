import { CharacterT } from "@ctypes/character";
// import happyImg from "./waifu_happy.png";
// import standartImg from "./waifu_standart.png";
import positiveVid from "./waifu2-positive.mp4";
import standartVid from "./waifu2-standart.mp4";
import negativeVid from "./waifu2-negative.mp4";

const waifu2: CharacterT = {
  // happy: {
  //   img: happyImg,
  // },
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

export default waifu2;
