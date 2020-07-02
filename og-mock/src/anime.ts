import { Anime } from "@models/anime";
import { Application } from "express";
import faker from "faker";

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

function createAnimeMocks(count: number = 1): Anime[] {
  const results = [];
  for (let index = 0; index < count; index++) {
    results.push(createAnimeMock());
  }
  return results;
}

const animeMock = (app: Application) => {
  app.get("/trending/anime", function (req, res) {
    const limit = req.query.limit ?? 1;
    const animes = createAnimeMocks(Number(limit));
    const result = {
      data: animes,
    };
    setTimeout(() => {
      console.log("hooold your horses");
      if (faker.random.boolean()) {
        res.send(result);
      } else {
        res.status(206).send(result);
      }
    }, faker.random.number(1500));
  });
};

export default animeMock;
