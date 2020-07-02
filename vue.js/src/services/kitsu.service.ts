import axios from "axios";
import { RemoteAnimeService } from "./remote.service";
import { Anime } from "@/models/anime";

export class KitsuService implements RemoteAnimeService {
  fetchTrending(): Promise<Anime> {
    return axios
      .get("https://kitsu.io/api/edge/trending/anime?limit=1")
      .then((response) => response.data?.data.pop());
  }
}
