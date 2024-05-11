<script setup lang="ts">

import { fetchIntro } from "~/api/WikipediaSource"
import { celebrities } from "~/model/CelebrityList"

async function verifyCelebrities() {
  for (const celebrity of celebrities) {
    console.log(celebrity)
    await fetchIntro(celebrity)
  }
}

</script>

<template>
    <UButton @click="verifyCelebrities()">Verify Celebrities</UButton>
</template>
