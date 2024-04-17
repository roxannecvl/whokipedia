<script setup lang="ts">

import type {InfoboxHint, ParagraphHint} from "~/model/Hint";
import {blurHTML, getEncryptedString, removeNameOccurrences} from "~/utilities/Utils";
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
    blur : {
      type : Number,
      required: true,
    },
    buttonLink : {
      type : String,
      required: true,
    },
})

// Constants
const encrypted = props.intro ? getEncryptedString(props.intro[0].value) : ""

// Functions
function format(str: string) : string {
  return blurHTML(removeNameOccurrences(str, props.name))
}

</script>

<template>
  <div class="pt-5 pr-5 pl-5 text-justify">
    <div class="articleRight">
      <InfoboxView
          :fields = "fields" :imageUrl="imageUrl" :blur="blur"
          :over="over" :buttonLink="buttonLink"
      />
    </div>

    <span v-if="over">{{ firstSentence }}</span>
    <div v-for="paragraph in intro" :key="paragraph" style="display: inline;">
      <span v-if="paragraph.revealed && !over" v-html="format(paragraph.value)"></span>
      <span v-else-if="over">{{ paragraph.value }}</span>
      <span v-else class="blur-sm">{{ encrypted }}</span>
    </div>
  </div>
</template>


<style>
.articleRight {
  float: right;
  overflow: hidden;
  padding: 3px;
  margin: 0 0 5px 15px;
}
</style>

