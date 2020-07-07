import { Anime } from "@/models/anime";

export interface RemoteAnimeService {
  fetchTrending(): Promise<Anime>;
}
