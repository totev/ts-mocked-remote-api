import config from "@/config";
import { Anime } from "@/models/anime";
import axios from "axios";
import { RemoteAnimeService } from "./remote.service";

export class KitsuService implements RemoteAnimeService {
  fetchTrending(): Promise<Anime> {
    return axios
      .get(`${config.remoteApi}/trending/anime?limit=1`)
      .then(response => response.data?.data.pop());
  }
}
