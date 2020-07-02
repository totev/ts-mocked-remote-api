<template>
  <div class="home">
    <TrendingAnime />
  </div>
</template>

<script>
  import TrendingAnime from "@/components/TrendingAnime.vue";

  export default {
    name: "Home",
    components: {
      TrendingAnime,
    },
  };
</script>
