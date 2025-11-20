export type Game = {
    id: string;
  title: string;
  coverUrl: string;
  description?: string;
  genres?: string[];
  platforms?: string[];
  ratingAvg?: number;
  releaseDate?: any;
  steamAppId?: string;
};