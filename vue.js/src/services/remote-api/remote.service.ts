export type Anime = any;

export interface RemoteAnimeService {
  fetchTrending(): Promise<Anime>;
}
