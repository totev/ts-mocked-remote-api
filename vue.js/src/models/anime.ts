export interface AnimeAttributes {
  createdAt: Date;
  updatedAt: Date;
  synopsis: string; //"In the year 2071, humanity has colonoized several of the planets and moons...";
  coverImageTopOffset: number; //400;
  canonicalTitle: string; //"Cowboy Bebop";
  averageRating: string;
  startDate: string;
  endDate: string;
  ageRating: string; //"R";
  ageRatingGuide: string; //"17+ (violence & profanity)";
  status: string; //"finished";
  posterImage: AnimeImage;
  coverImage: AnimeImage;
  episodeCount: number;
  episodeLength: number;
  showType: string; //"TV";
  nsfw: boolean;
}

export interface AnimeImage {
  tiny: string;
  small: string;
  large: string;
  original: string;
}

export interface Anime {
  id: string;
  attributes: AnimeAttributes;
}
