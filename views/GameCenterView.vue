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
})

// Constants
const encrypted : string[] = props.intro ?
    props.intro.map(paragraph => getEncryptedString(paragraph.value))
    : [""]

// Functions
function format(str: string) : string {
  return blurHTML(removeNameOccurrences(str, props.name))
}

function scrollToParagraph(index: number, over: boolean) {
  if (over) return
  const element = document.getElementById(`p${index}`)
  if (element) {
    console.log("Scrolling to paragraph", index)
    element.scrollIntoView({ behavior: "smooth", block: "center" })
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
      <Transition
          name="reveal"
          @enter="scrollToParagraph(index, over)"
      >
        <span v-if="paragraph.revealed && !over" v-html="format(paragraph.value)" :id="`p${index}`"></span>
        <span v-else-if="over" :id="`p${index}`">{{ paragraph.value }}</span>
        <span v-else class="blur-sm" :id="`p${index}`">{{ encrypted[index] }}</span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
  .reveal-enter-active {
    animation: scale-text 1.2s
  }

  @keyframes scale-text {
    0% {
      transform: scale(1)
    }

    50% {
      transform: scale(1.3);
      color: rgb(245, 158, 12)
    }

    100% {
      transform: scale(1)
    }
  }
</style>

