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

watch(gameModel.$state, () => gameModel.time = props.timeSec)

</script>

<template>
  <SidebarView
      @new-time-set="(seconds: number) => gameModel.time = seconds"
      :guessCount="gameModel.nbGuesses" :totalGuesses="gameModel.totalGuesses" :over="gameModel.end" 
      :seconds="timeSec" :showRules="showRules"/>
</template>