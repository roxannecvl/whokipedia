<script setup lang="ts">

import { GameModel } from "~/model/GameModel";
import SidebarView from "~/views/SidebarView.vue";

defineProps({
  model: {
    type: GameModel,
    required: true,
  },
})

</script>

<template>
  <SidebarView :hintCount="model.nbGuesses" :over="false"/>
</template>