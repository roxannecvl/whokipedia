<script setup lang="ts">

import { ref } from 'vue'
import { fetchIntro, fetchImage, fetchInfoBox } from "~/api/WikipediaSource"
import { celebrities } from "~/model/CelebrityList"

const selectedName = ref()
const intro = ref()
const imageUrl = ref()
const infoBox = ref()

const getData = async () => {
  intro.value = await fetchIntro(selectedName.value)
  imageUrl.value = await fetchImage(selectedName.value, 100)
  infoBox.value = await fetchInfoBox(selectedName.value)
}

watch(selectedName, getData)

async function verifyCelebrities() {
  for (const celebrity of celebrities) {
    console.log(celebrity)
    await fetchIntro(celebrity)
    await fetchInfoBox(celebrity)
    await fetchImage(celebrity, 100)
  }
}

</script>

<template>
    <UButton @click="verifyCelebrities()">Verify Celebrities</UButton>
</template>
