<script setup lang="ts">

import { type GameStore } from "~/model/GameModel";
import SidebarView from "~/views/SidebarView.vue";

defineProps({
  model: {
    type: Object as () => GameStore,
    required: true,
  },
})

</script>

<template>
  <SidebarView :hintCount="model.nbGuesses" :over="model.end"/>
</template>