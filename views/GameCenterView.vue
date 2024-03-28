<script setup lang="ts">

import { getAutocompleteSuggestions } from "~/model/CelebrityList";

defineProps( {
    intro : {
      type: Array<string>,
      required: true,
    },
    revealed : {
      type: Array<number>,
      required: true,
    },
})

const emit = defineEmits(['new-name-set'])

const selectedName = ref("");

function newName() {
  if (selectedName.value === "") return;
  emit("new-name-set", selectedName.value);
  setTimeout(() => {
    selectedName.value = "";
  }, 200);
}

watch(selectedName, newName)

</script>

<template>
  <UInputMenu
      v-model="selectedName"
      :search="getAutocompleteSuggestions"
      placeholder="Take a guess..."
      option-attribute="name"
      trailing
      by="id"
  />

</template>
