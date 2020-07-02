<template>
  <div class="hello">
    <span v-if="anime">
      <h3>
        {{ anime.attributes.canonicalTitle }}
      </h3>
      <div class="row">
        <div class="column">
          <img :src="anime.attributes.posterImage.large" />
        </div>
        <div class="column text-left">
          <h3>Synopsis</h3>
          {{ anime.attributes.synopsis }}
          <h3>Episode count</h3>
          {{ anime.attributes.episodeCount }}
          <h3>Status</h3>
          {{ anime.attributes.status }}
          <h3>Age rating</h3>
          {{ anime.attributes.ageRating }}
          {{ anime.attributes.ageRatingGuide }}
        </div>
      </div>
      <small
        >Data provided by
        <a href="https://kitsu.io" target="_blank" rel="noopener"
          >Kitsu</a
        ></small
      >
    </span>
    <span v-else>
      Loading...
    </span>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import { Anime } from "@/models/anime";
  import { KitsuService } from "@/services/kitsu.service";

  @Component
  export default class HelloWorld extends Vue {
    private anime: Anime | null = null;

    async mounted() {
      const animeService = new KitsuService();
      this.anime = await animeService.fetchTrending();
    }
  }
</script>

<style scoped>
  h3 {
    margin: 40px 0 0;
  }
  a {
    color: #42b983;
  }

  .row {
    display: flex;
  }

  .column {
    flex: 50%;
  }
  .text-left {
    text-align: left;
  }
</style>
