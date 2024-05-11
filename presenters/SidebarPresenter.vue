<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel"
import SidebarView from "~/views/SidebarView.vue"

// Props
const props = defineProps({
  timeSec: {
    type : Number,
    required : true,
  },
  showRules: {
    type : Boolean,
    required : true,
  },
})

// Models
const gameModel: GameStore = useGameStore()

// Refs
let trueSeconds = computed(() => {
  if (gameModel.end && gameModel.time !== 0) return gameModel.time
  else return props.timeSec
})

/**
 * This function is used to update the current time of the game.
 */
function updateCurrentTime() {
  if(trueSeconds.value !== 0){
    gameModel.time = trueSeconds.value
  }
}

watch(gameModel.$state, updateCurrentTime)

</script>

<template>
  <SidebarView
      @new-time-set="(seconds: number) => gameModel.time = seconds"
      :guessCount="gameModel.nbGuesses" :totalGuesses="gameModel.totalGuesses" :over="gameModel.end" 
      :seconds="trueSeconds" :showRules="showRules"/>
</template>