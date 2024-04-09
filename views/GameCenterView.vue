<script setup lang="ts">

import { getAutocompleteSuggestions } from "~/model/CelebrityList";
import type { ParagraphHint } from "~/model/Hint";

defineProps( {
    intro : {
      type: Array<ParagraphHint>,
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
  <UCard>
    <p v-for="paragraph in intro" :key="paragraph">
      <p v-if="paragraph.revealed">{{ paragraph.value }}</p>
    </p>
  </UCard>
</template>
