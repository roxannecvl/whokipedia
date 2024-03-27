<script
    lang="ts">
import {
  GameModel
} from "~/model/GameModel";
import SidebarView
  from "~/views/SidebarView.vue";

export default {
  props: {
    model: {
      type: GameModel,
      required: true,
    },
  },
  components: {
    SidebarView,
  }
}

</script>

<template>
  <SidebarView :hintCount="model.nbGuesses" :over="false"/>
</template>