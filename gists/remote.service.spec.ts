import { AnimeService } from "@remote-api/index";

describe("RemoteAnimeServiceSpec", () => {
  it("does not trigger remote service", async () => {
    const animeService = new AnimeService();
    const result = await animeService.fetchTrending();
    expect(result.id).toBeTruthy();
    expect(result.attributes.status).toBe("mocked finished");
  });
});
