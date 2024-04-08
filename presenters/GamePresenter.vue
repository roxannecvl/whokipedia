<script setup lang="ts">

import InfoboxView from "~/views/InfoboxView.vue";
import { GameModel } from "~/model/GameModel";
import GameCenterView from "~/views/GameCenterView.vue";

defineProps({
  model: {
      type: GameModel,
      required: true,
  },
})

</script>

<template>
  <div v-if="model.end" class="text-5xl text-primary font-black">
    <p v-if="model.win"> YOU WON ! </p>
    <p v-else> You lost... </p>
  </div>
  <div class="flex flex-col">
    <GameCenterView
        @new-name-set="selectedName => model.makeAGuess.bind(model)(selectedName)"
        :intro="model.intro"
    />
    <InfoboxView
        :fields = "model.infobox" :imageUrl="model.imageUrl" :blur="model.blur" :over="model.end"
    />
  </div>

</template>
