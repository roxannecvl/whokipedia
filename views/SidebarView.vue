<script setup lang="ts">

import { formatTime } from "~/utilities/Utils"
import { useElementSize } from '@vueuse/core'

// Props
defineProps({
  guessCount: {
    type : Number,
    required : true,
  },
  totalGuesses : {
    type : Number,
    required : true,
  },
  over: {
    type : Boolean,
    required : true,
  },
  seconds: {
    type : Number,
    required : true,
  },
  showRules: {
    type : Boolean,
    required : true,
  },
})

// Emits
const emit = defineEmits(['new-time-set'])

// Refs
const areRulesOpen = ref(false)
const progressBar = ref(null)

// Variables
let once = true
const { width } = useElementSize(progressBar)

// Functions
function showAndEmit(seconds : number, over : boolean){
  if(over && once){
    once = false
    emit("new-time-set", seconds)
  }
  return formatTime(seconds)
}

</script>

<template>
  <div :class="showRules ? '' : 'flex justify-between sm:mt-1'">
    <UButton v-if="!showRules" @click="areRulesOpen = true" icon="i-material-symbols-help-rounded" variant="soft" class="mr-2 max-w-20 w-1/6 justify-center items-center"/>
    <UCard :class="showRules ? 'mb-5' : 'w-full'" :ui="{
      background: over ? 'bg-gray-100' : 'bg-white',
      body: {
        padding: 'px-3 py-2'
      },
    }">
      <div :class="showRules ? '' : 'flex justify-between'">
        <div :class="showRules ? '' : 'w-7/12'">
          <UDivider label="hints" :ui="{ label: 'text-xs' }"/>
          <div :class="showRules ? 'flex mb-4 mt-2' : 'flex'">
            <UProgress :value="(guessCount / totalGuesses) * 100" size="md"
                       :class="showRules ? 'mb-2 mr-2' : 'mr-1'" ref="progressBar">
              <template #indicator="{ percent }">
                <div class="flex justify-between">
                  <div class="text-right whitespace-pre" :style="{ width: `${ percent + 1.2 * (16 / width * 100) }%` }">
                    <span class="text-primary">
                      {{ Math.round((percent / 100) * totalGuesses)}} / {{ totalGuesses}}
                    </span>
                  </div>
                </div>
              </template>
            </UProgress>
          </div>
        </div>
        <UDivider v-if="!showRules" type="dashed" orientation="vertical" class="w-1/12"/>
        <div :class="showRules ? '' : 'w-4/12'">
          <UDivider label="time" :ui="{ label: 'text-xs' }"/>
          <p class="mt-2 text-center text-primary">{{ showAndEmit(seconds, over)}}</p>
        </div>
      </div>
    </UCard>
  </div>

  <div v-if="showRules">
    <UDivider label="How to play" :ui="{ label: 'text-sm font-bold' }"/>
    <p class="py-3 font-semibold text-sm">
    Guess the celebrity <span class="text-primary">in as few hints as possible</span>.
    </p>
    <ul class="list-inside m-2 text-sm">
      <li class="mb-4"><UIcon name="i-heroicons-arrow-long-right-16-solid"/>
        Each unsuccessful guess brings a <span class="text-primary">new hint</span>.</li>
      <li class="mb-4"><UIcon name="i-heroicons-arrow-long-right-16-solid"/>
        Guess until you find the <span class="text-primary">celebrity</span> or until
        <span class="text-primary">all hints are consumed</span>.</li>
      <li><UIcon name="i-heroicons-arrow-long-right-16-solid"/>
        If you do not have the slightest <span class="text-primary">idea</span>, press the
        <UIcon class="text-primary" name="i-heroicons-plus-circle-16-solid"/> button to get a new hint. Be
        careful, this will <span class="text-primary">consume</span> a new guess !</li>
    </ul>
  </div>

  <USlideover v-model="areRulesOpen" title="Rules">
    <UCard :ui="{ body: { base: 'flex-1' }, ring: '', shadow: '', rounded: ''}">
      <div class="flex items-center justify-end">
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="areRulesOpen = false" />
      </div>
      <div class="p-5 w-full box-border">
        <UDivider label="How to play" :ui="{ label: 'text-xl font-bold' }"/>
        <p class="py-3 font-semibold">
          Guess the celebrity <span class="text-primary">in as few hints as possible</span>.
        </p>
        <ul class="list-inside m-2">
          <li><UIcon name="i-heroicons-arrow-long-right-16-solid"/>
            Each unsuccessful guess brings a <span class="text-primary">new hint</span>.</li>
          <li><UIcon name="i-heroicons-arrow-long-right-16-solid"/>
            Guess until you find the <span class="text-primary">celebrity</span> or until
            <span class="text-primary">all hints are consumed</span>.</li>
          <li><UIcon name="i-heroicons-arrow-long-right-16-solid"/>
            If you do not have the slightest <span class="text-primary">idea</span>, press the
            <UIcon class="text-primary" name="i-heroicons-plus-circle-16-solid"/> button to get a new hint. Be
            careful, this will <span class="text-primary">consume</span> a new guess !</li>
        </ul>
      </div>
    </UCard>
  </USlideover>

</template>