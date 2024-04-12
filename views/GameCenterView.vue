<script setup lang="ts">

import type { ParagraphHint } from "~/model/Hint";
import { getAutocompleteSuggestions } from "~/model/CelebrityList";
import {blurHTML, getEncryptedString, removeNameOccurrences} from "~/utilities/Utils";

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
    redBackground : {
      type : Boolean,
      required: true,
    },
})

// Emits
const emit = defineEmits(['new-name-set'])

// Refs
const selectedName = ref("");
const tremble = ref(false);

// Constants
const mode = useColorMode();
const redColor = computed(() => mode.value === 'dark' ? '#996666' : '#ffe6e6');
const encrypted = props.intro ? getEncryptedString(props.intro[0].value) : ""

// Watchers
watch(selectedName, newName)

// Functions
function newName(): void {
  if (selectedName.value === "") return;
  emit("new-name-set", selectedName.value);
  tremble.value = true;
  setTimeout(() => {
    selectedName.value = "";
    tremble.value = false;
  }, 300);
}

function format(str: string) : string {
  return blurHTML(removeNameOccurrences(str, props.name))
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
            :style="{ fontSize: '18px', padding: '10px', height: '40px',
                      backgroundColor: redBackground ? redColor : '' }"
            :class="{'tremble': tremble }"
        />
          <div v-if="over" class="text-3xl font-black">
            {{name}}
          </div>
      </template>
      <div style="max-height: 75vh; overflow-y:auto;">
        <span v-if="over">{{ firstSentence }}</span>
        <div v-for="paragraph in intro" style="display: inline;">
          <span v-if="paragraph.revealed && !over" v-html="format(paragraph.value)"></span>
          <span v-else-if="over">{{ paragraph.value }}</span>
          <span v-else class="blur-sm">{{ encrypted }}</span>
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
