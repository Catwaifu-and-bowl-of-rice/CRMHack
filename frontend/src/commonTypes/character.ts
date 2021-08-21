export type Emotion = string; 

type CharacterInfo = {
  img: string,
  origin?: {
    x: number,
    y: number
  }
}

export type CharacterT = Record<Emotion, CharacterInfo>