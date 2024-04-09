<script setup lang="ts">

import { useGameStore } from "~/model/GameModel";
import SidebarView from "~/views/SidebarView.vue";

defineProps({
  model: {
    type: useGameStore,
    required: true,
  },
})

</script>

<template>
  <SidebarView :hintCount="model.nbGuesses" :over="false"/>
</template>