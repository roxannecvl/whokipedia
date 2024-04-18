<script setup lang="ts">

import { type GameStore } from "~/model/GameModel";
import GameCenterView from "~/views/GameCenterView.vue";
import SearchFieldView from "~/views/SearchFieldView.vue";

// Props
const props = defineProps({
  model: {
      type: Object as () => GameStore,
      required: true,
  },
})

// Constants
const baseString = "https://en.wikipedia.org/wiki/";
const validGuess = ref(true);

function guessAndCheck(name : string, model : GameStore){
  validGuess.value = model.makeAGuess.bind(model)(name);
  if(!validGuess.value) {
    setTimeout(() => {
      validGuess.value = true;
    }, 2500);
  }
}

</script>

<template>
  <div class="flex flex-col" style="max-height: 80vh">
    <SearchFieldView
                    @new-name-set="selectedName => guessAndCheck(selectedName, model)"
                    :over="model.end" :name="model.name" :alert="!validGuess"
    />
    <div style="overflow-y:auto; max-height: 70vh">
      <GameCenterView
          :intro="model.intro" :over="model.end" :name="model.name" :win = "model.win"
          :first-sentence="model.firstSentence" :fields = "model.infobox" :imageUrl="model.imageUrl"
          :blur="model.blur" :buttonLink="baseString + model.name"
      />
    </div>
  </div>

</template>

