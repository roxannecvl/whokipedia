<script setup lang="ts">

import type { InfoboxHint, ParagraphHint } from "~/model/Hint"
import { blurHTML, getEncryptedString, removeNameOccurrences } from "~/utilities/Utils"
import InfoboxView from "~/views/InfoboxView.vue"

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
    size: {
      type: String,
      required: true,
    }
})

// Constants
const encrypted : string[] = props.intro ?
    props.intro.map(paragraph => getEncryptedString(paragraph.value)) : [""]

/**
 * Format the string by HTML-blurring the name occurrences.
 * @param str - string to format
 */
function format(str: string) : string {
  return blurHTML(removeNameOccurrences(str, props.name))
}

/**
 * Scroll to the paragraph if it is visible.
 * @param index - index of the paragraph within intro
 * @param size - size of the screen (small or big)
 * @param over - whether the game is over or not
 */
function scrollToParagraph(index: number, size: string, over: boolean): void {
  if (over) return
  const element = document.getElementById(`p-${size}-${index}`)
  if (element) {
    // According to https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    // offsetParent is null if the element or any of its parents is display: none
    if (element.offsetParent) {
      element.scrollIntoView({ behavior: "smooth", block: "center"})
    }
  }
}

</script>

<template>
  <div class="p-2 text-justify">
    <div class="p-1 sm:ml-4 sm:float-right">
      <InfoboxView
          :fields = "fields" :imageUrl="imageUrl"
          :over="over" :buttonLink="buttonLink"
      />
    </div>

    <span v-if="over">{{ firstSentence }}</span>
    <div v-for="(paragraph, index) in intro" :key="index" class="inline">
      <Transition name="reveal" @enter="scrollToParagraph(index, size, over)">
        <span v-if="paragraph.revealed && !over" v-html="format(paragraph.value)" :id="`p-${size}-${index}`"></span>
        <span v-else-if="over" :id="`p-${size}-${index}`">{{ paragraph.value }}</span>
        <span v-else class="blur-sm" :id="`p-${size}-${index}`">{{ encrypted[index] }}</span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
  .reveal-enter-active {
    animation: fade-color 1.2s
  }

  @keyframes fade-color {
    50% {
      color: rgb(245, 158, 12)
    }
  }
</style>

