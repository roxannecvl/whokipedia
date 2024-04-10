<script setup lang="ts">

import InfoboxView from "~/views/InfoboxView.vue";
import { type GameStore } from "~/model/GameModel";
import GameCenterView from "~/views/GameCenterView.vue";

defineProps({
  model: {
      type: Object as () => GameStore,
      required: true,
  },
})

const baseString = "https://en.wikipedia.org/wiki/";
const validGuess = ref(true);
const toast = useToast();
const errTitle = "Already guessed!"
const errDescription = "This guess doesn't count as a new guess, try again :)"

function guessAndCheck(name : string, model : GameStore){
  validGuess.value = model.makeAGuess.bind(model)(name);
  if(!validGuess.value) {
    toast.add({
      title: errTitle,
      description: errDescription,
      icon: 'i-heroicons-x-circle',
      color:"red",
      timeout: 2500
    })

    setTimeout(() => {
      validGuess.value = true;
    }, 2500);
  }
}

</script>

<template>
  <div class="flex flex-row">
    <GameCenterView
        @new-name-set="selectedName => guessAndCheck(selectedName, model)"
        :intro="model.intro" :over="model.end" :name="model.name" :win = "model.win" :redBackground="!validGuess"
    />
    <InfoboxView
        :fields = "model.infobox" :imageUrl="model.imageUrl" :blur="model.blur"
        :over="model.end" :buttonLink="baseString + model.name"
    />
  </div>

</template>
