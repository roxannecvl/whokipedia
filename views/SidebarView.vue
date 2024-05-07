<script setup lang="ts">
import { formatTime } from "~/utilities/Utils"

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
const emit = defineEmits(['new-time-set', 'new-guess-asked'])

// Refs
const areRulesOpen = ref(false)

// Variables
let once = true

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
  <div :class="showRules ? '' : 'flex justify-between'">
    <UButton v-if="!showRules" @click="areRulesOpen = true" icon="i-material-symbols-help-rounded" variant="soft" class="mr-2"/>
    <UCard :class="showRules ? 'mb-5' : 'w-full'" :ui="{
      background: over ? 'bg-gray-100' : 'bg-white',
      body: {
        padding: 'px-3 py-2'
      },
    }">
      <div :class="showRules ? '' : 'flex justify-between'">
        <div :class="showRules ? '' : 'w-3/5'">
          <UDivider label="guess n°" :ui="{ label: 'text-xs' }"/>
          <div :class="showRules ? 'flex mb-4 mt-2' : 'flex'">
            <UProgress :value="(guessCount / totalGuesses) * 100" size="md" :class="showRules ? 'mb-2 mr-2' : 'mr-1'">
              <template #indicator="{ percent }">
                <div class="text-right" :style="{ width: `${percent}%` }">
                  <span class="text-amber-500">{{ Math.round((percent / 100) * totalGuesses)}}</span>
                </div>
              </template>
            </UProgress>
            <UButton :disabled="over" variant="ghost"
                     icon="i-heroicons-plus-circle-16-solid"
                     @click="emit('new-guess-asked')"/>
          </div>
        </div>
        <div>
          <UDivider label="time" :ui="{ label: 'text-xs' }"/>
          <p class="mt-2 text-center text-primary">{{ showAndEmit(seconds, over)}}</p>
        </div>
      </div>
    </UCard>
  </div>

  <div v-if="showRules">
    <UDivider label="How to play" :ui="{ label: 'text-xl font-bold' }"/>
    <p class="py-3 font-semibold">
    Guess the celebrity <span class="text-primary">in as few hints as possible</span>
    </p>
    <ul class="list-disc list-inside m-2">
      <li>Each guess must be one of our listed <span class="text-primary">celebrities</span>.</li>
      <li>Each unsuccessful guess brings a <span class="text-primary">new hint</span>.</li>
      <li><span class="text-primary">Guess until you find the celebrity</span> or until <span class="text-primary">all hints are consumed</span>.</li>
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
          Guess the celebrity <span class="text-primary">in as few hints as possible</span>
        </p>
        <ul class="list-disc list-inside m-2">
          <li>Each guess must be one of our listed <span class="text-primary">celebrities</span>.</li>
          <li>Each unsuccessful guess brings a <span class="text-primary">new hint</span>.</li>
          <li><span class="text-primary">Guess until you find the celebrity</span> or until <span class="text-primary">all hints are consumed</span>.</li>
        </ul>
      </div>
    </UCard>
  </USlideover>

</template>