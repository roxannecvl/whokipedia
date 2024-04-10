<script setup lang="ts">

import { type GameStore } from "~/model/GameModel";
import InfoboxView from "~/views/InfoboxView.vue";
import GameCenterView from "~/views/GameCenterView.vue";

defineProps({
  model: {
      type: Object as () => GameStore,
      required: true,
  },
})

const baseString = "https://en.wikipedia.org/wiki/";

</script>

<template>
  <div class="flex flex-row">
    <GameCenterView
        @new-name-set="selectedName => model.makeAGuess.bind(model)(selectedName)"
        :intro="model.intro" :over="model.end" :name="model.name" :win = "model.win"
    />
    <InfoboxView
        :fields = "model.infobox" :imageUrl="model.imageUrl" :blur="model.blur"
        :over="model.end" :buttonLink="baseString + model.name"
    />
  </div>

</template>
