<script setup lang="ts">

import { fetchImage, fetchInfoBox, fetchIntro } from "~/api/WikipediaSource"
import { celebrities } from "~/model/CelebrityList"

// Refs
const isPaused = ref(false)
const isVerifying = ref(false)
const progress = ref(0)
const q = ref('')
const results = ref(celebrities.map(celebrity => ({ name: celebrity, status: '⏳' })))

// Computed
const filteredResults = computed(() => {
  if (!q.value) return results.value
  return results.value.filter((celebrity) => {
    return Object.values(celebrity).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})
const numChecks = computed(() => results.value.filter(result => result.status === '✅').length)
const numCrosses = computed(() => results.value.filter(result => result.status === '❌').length)
const numWaiting = computed(() => results.value.filter(result => result.status === '⏳').length)

/**
 * This function is used to verify the celebrities' wikipedia page existence.
 */
async function verifyCelebrities() {
  isVerifying.value = true
  for (const [index, result] of results.value.entries()) {
    while (isPaused.value) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    try {
      await fetchIntro(result.name)
      await fetchInfoBox(result.name)
      await fetchImage(result.name, 100)
      result.status = '✅'
    } catch (error) {
      result.status = '❌'
    }
    progress.value = ((index + 1) / results.value.length) * 100
  }
  isVerifying.value = false
}

</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex">
      <UButton class="mb-4 mr-4" variant="soft" v-show="!isVerifying" @click="() => verifyCelebrities()">Verify Celebrities</UButton>
      <UButton class="mb-4 mr-4" variant="soft" v-show="isVerifying" :icon="isPaused ? 'i-heroicons-play-20-solid' : 'i-heroicons-pause-20-solid'"
               @click="() => isPaused = !isPaused"/>
      <UProgress class="mb-4" :value="progress" indicator />
    </div>
    <div class="flex mb-4">
      <UInput v-model="q" placeholder="Filter people..." />
      <UButton class="ml-2" variant="soft" @click="() => q = '✅'">✅ ({{ numChecks }})</UButton>
      <UButton class="ml-2" variant="soft" @click="() => q = '❌'">❌ ({{ numCrosses }})</UButton>
      <UButton class="ml-2" variant="soft" @click="() => q = '⏳'">⏳ ({{ numWaiting }})</UButton>
      <UButton class="ml-2" variant="soft" @click="() => q = ''">🔄</UButton>
    </div>
    <UTable :rows="filteredResults" />
  </div>
</template>
