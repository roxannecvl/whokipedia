<script setup lang="ts">

import { type GameStore } from "~/model/GameModel"
import SidebarView from "~/views/SidebarView.vue"

// Props
const props = defineProps({
  gameModel: {
    type: Object as () => GameStore,
    required: true,
  },
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

// Refs
let trueSeconds = computed(() => {
  if (props.gameModel.end && props.gameModel.time !== 0) return props.gameModel.time
  else return props.timeSec
} )


// Function
function updateCurrentTime() {
  if(trueSeconds.value !== 0){
    props.gameModel.time = trueSeconds.value
  }
}

watch(props.gameModel.$state, updateCurrentTime)

</script>

<template>
  <SidebarView
      @new-time-set="seconds => {gameModel.time = seconds}"
      :guessCount="gameModel.nbGuesses" :totalGuesses="gameModel.totalGuesses" :over="gameModel.end" 
      :seconds="trueSeconds" :showTime="showTime" :showRules="showRules"/>
</template>