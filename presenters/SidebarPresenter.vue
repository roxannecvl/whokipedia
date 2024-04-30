<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel"
import SidebarView from "~/views/SidebarView.vue"

// Props
const props = defineProps({
  timeSec: {
    type : Number,
    required : true,
  },
  showTime: {
    type : Boolean,
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
} )


// Function
function updateCurrentTime() {
  if(trueSeconds.value !== 0){
    gameModel.time = trueSeconds.value
  }
}

watch(gameModel.$state, updateCurrentTime)

</script>

<template>
  <SidebarView
      @new-time-set="seconds => {gameModel.time = seconds}"
      :guessCount="gameModel.nbGuesses" :totalGuesses="gameModel.totalGuesses" :over="gameModel.end" 
      :seconds="trueSeconds" :showTime="showTime" :showRules="showRules"/>
</template>