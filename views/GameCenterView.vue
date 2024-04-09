<script setup lang="ts">

import { getAutocompleteSuggestions } from "~/model/CelebrityList";
import { getCryptedString } from "~/utilities/Utils";
import type { ParagraphHint } from "~/model/Hint";

defineProps( {
    intro : {
      type: Array<ParagraphHint>,
      required: true,
    },
    over : {
      type : Boolean,
      required: true,
    },
    name: {
      type : String,
      required: true,
    },
    win : {
      type : Boolean,
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
  <div class="flex flex-col">
    <UCard>
      <template #header>
        <UInputMenu
            v-if="!over"
            v-model="selectedName"
            :search="getAutocompleteSuggestions"
            placeholder="Take a guess..."
            option-attribute="name"
            trailing
            by="id"
            style="font-size: 18px; padding: 10px; height: 40px;"
        />
          <div v-if="over" class="text-3xl font-black">
            {{name}}
          </div>
      </template>
      <div style="max-height: 75vh; overflow-y:auto;">
        <p v-for="paragraph in intro" :key="paragraph">
          <p v-if="paragraph.revealed || over">{{ paragraph.value }}</p>
          <p v-else class="blur-sm">{{ getCryptedString(paragraph.value) }}</p>
        </p>
      </div>
    </UCard>




  </div>
</template>
