<script setup lang="ts">

import type { InfoboxHint, ParagraphHint } from "~/model/Hint";
import { blurHTML, getEncryptedString, removeNameOccurrences } from "~/utilities/Utils";
import InfoboxView from "~/views/InfoboxView.vue";


// Props
const props = defineProps( {
    intro : {
      type: Array<ParagraphHint>,
      required: true,
    },
    name: {
      type : String,
      required: true,
    },
    over : {
      type : Boolean,
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
    fields: {
      type: Array<InfoboxHint>,
      required: true,
    },
    imageUrl : {
      type: String,
      required: true,
    },
    buttonLink : {
      type : String,
      required: true,
    },
})

// Constants
const encrypted : string[] = props.intro ?
    props.intro.map(paragraph => getEncryptedString(paragraph.value))
    : [""]

// Functions
function format(str: string) : string {
  return blurHTML(removeNameOccurrences(str, props.name))
}

</script>

<template>
  <div class="pt-5 pr-5 pl-5 text-justify">
    <div class="p-3 sm:mb-1 sm:ml-3 sm:float-right overflow-hidden">
      <InfoboxView
          :fields = "fields" :imageUrl="imageUrl"
          :over="over" :buttonLink="buttonLink"
      />
    </div>

    <span v-if="over">{{ firstSentence }}</span>
    <div v-for="(paragraph, index) in intro" :key="index" class="inline">
      <span v-if="paragraph.revealed && !over" v-html="format(paragraph.value)"></span>
      <span v-else-if="over">{{ paragraph.value }}</span>
      <span v-else class="blur-sm">{{ encrypted[index] }}</span>
    </div>
  </div>
</template>

