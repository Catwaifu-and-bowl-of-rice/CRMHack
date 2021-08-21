export type Emotion = string; 

interface CharacterInfo {
  img: string,
  origin?: {
    x: number,
    y: number
  }
}

export type CharacterT = Record<Emotion, CharacterInfo>