import faker from "faker";
import { Anime } from "../../../src/models/anime";
import { RemoteAnimeService } from "../../../src/services/remote-api/remote.service";

function createAnimeMock(): Anime {
  return {
    id: faker.random.uuid(),
    attributes: {/*... */},
  };
}

export class MockAnimeService implements RemoteAnimeService {
  async fetchTrending(): Promise<any> {
    const result = createAnimeMock();
    return new Promise((resolve) => {
      // why not add a delay to make it more realistic
      setTimeout(() => {
        resolve(result);
      }, faker.random.number(1500));
    });
  }
}
