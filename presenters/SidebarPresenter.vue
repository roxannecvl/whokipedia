<script setup lang="ts">

import { type GameStore } from "~/model/GameModel";
import SidebarView from "~/views/SidebarView.vue";
import GameCenterView from "~/views/GameCenterView.vue";

// Props
const props = defineProps({
  model: {
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

</script>

<template>
  <SidebarView
      @new-time-set="seconds => {model.time = seconds}"
      :hintCount="model.nbGuesses" :over="model.end" :seconds="timeSec" :showTime="showTime" :showRules="showRules"/>
</template>