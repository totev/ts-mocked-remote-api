import faker from "faker";
import { Anime } from "../../../src/models/anime";
import { RemoteAnimeService } from "../../../src/services/remote-api/remote.service";

function createAnimeMock(): Anime {
  return {
    id: faker.random.uuid(),
    attributes: {
      createdAt: faker.date.past(10),
      updatedAt: faker.date.past(2),
      startDate: String(faker.date.past(10)),
      endDate: String(faker.date.past(10)),
      synopsis: faker.lorem.paragraphs(),
      coverImageTopOffset: faker.random.number(),
      canonicalTitle: faker.lorem.words(),
      averageRating: String(faker.random.number()),
      ageRating: "PG",
      ageRatingGuide: "Teens 13 or older",
      status: "finished",
      posterImage: {
        tiny: faker.random.image(),
        small: faker.random.image(),
        large: faker.random.image(),
        original: faker.random.image(),
      },
      coverImage: {
        tiny: faker.random.image(),
        small: faker.random.image(),
        large: faker.random.image(),
        original: faker.random.image(),
      },
      episodeCount: faker.random.number(),
      episodeLength: faker.random.number(),
      showType: "TV",
      nsfw: faker.random.boolean(),
    },
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
