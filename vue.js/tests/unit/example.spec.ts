import { shallowMount } from "@vue/test-utils";
import TrendingAnime from "@/components/TrendingAnime.vue";

describe("TrendingAnime.vue", () => {
  it("compiles", () => {
    const wrapper = shallowMount(TrendingAnime, {});
    expect(wrapper.exists()).toBeTruthy();
  });
});
