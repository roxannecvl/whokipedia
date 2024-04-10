<script setup lang="ts">

import type { ParagraphHint } from "~/model/Hint";
import { getAutocompleteSuggestions } from "~/model/CelebrityList";
import { getEncryptedString, removeNameOccurrences } from "~/utilities/Utils";

// Props
const props = defineProps( {
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
    firstSentence : {
      type: String,
      required: true
    },
})

// Emits
const emit = defineEmits(['new-name-set'])

// Refs
const selectedName = ref("");

// Watchers
watch(selectedName, newName)

// Functions
function newName() {
  if (selectedName.value === "") return;
  emit("new-name-set", selectedName.value);
  setTimeout(() => {
    selectedName.value = "";
  }, 200);
}

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
        <span v-if="over">{{ firstSentence }}</span>
        <div v-for="paragraph in intro" :key="paragraph" style="display: inline;">
          <span v-if="paragraph.revealed && !over">{{ removeNameOccurrences(paragraph.value, name) }}</span>
          <span v-else-if="over">{{ paragraph.value }}</span>
          <span v-else class="blur-sm">{{ getEncryptedString(paragraph.value) }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>
