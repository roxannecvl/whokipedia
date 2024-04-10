<script setup lang="ts">

import type { ParagraphHint } from "~/model/Hint";
import { getAutocompleteSuggestions } from "~/model/CelebrityList";
import { getEncryptedString, removeNameOccurrences } from "~/utilities/Utils";

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
    firstSentence : {
      type: String,
      required: true
    },
    redBackground : {
      type : Boolean,
      required: true,
    },
})

const emit = defineEmits(['new-name-set'])

const selectedName = ref("");
const tremble = ref(false);

function newName() {
  if (selectedName.value === "") return;
  emit("new-name-set", selectedName.value);
  tremble.value = true;
  setTimeout(() => {
    selectedName.value = "";
    tremble.value = false;
  }, 300);
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
            :style="{ fontSize: '18px', padding: '10px', height: '40px',
                      backgroundColor: redBackground ? '#ffe6e6' : '' }"
            :class="{'tremble': tremble }"
        />
          <div v-if="over" class="text-3xl font-black">
            {{name}}
          </div>
      </template>
      <div style="max-height: 75vh; overflow-y:auto;">
        <p v-if="over">{{ firstSentence }}</p>
        <div v-for="paragraph in intro" :key="paragraph">
          <p v-if="paragraph.revealed && !over">{{ removeNameOccurrences(paragraph.value, name) }}</p>
          <p v-else-if="over">{{ paragraph.value }}</p>
          <p v-else class="blur-sm">{{ getEncryptedString(paragraph.value) }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style>

@keyframes tremble {
  0% { transform: translate(0); }
  25% { transform: translate(-15px, 0px); }
  50% { transform: translate(15px, 0px); }
  75% { transform: translate(-15px, 0px); }
  100% { transform: translate(0); }
}

.tremble {
  animation: tremble 0.3s ease-in-out 1;
}
</style>
