<script
    setup
    lang="ts">

import { ref } from 'vue';
import { fetchIntro, fetchImageUrl, fetchInfoBox } from "~/api/wikipediaSource";
import { getAutocompleteSuggestions } from "~/model/CelebrityList";

const selectedName = ref("");
const intro = ref("");
const imageUrl = ref("");
const infoBox = ref("");

const getData = async () => {
  intro.value = await fetchIntro(selectedName.value);
  imageUrl.value = await fetchImageUrl(selectedName.value, 100);
  infoBox.value = await fetchInfoBox(selectedName.value);
}

watch(selectedName, getData)

</script>

<template>
  <div>
    Test some of our implemented functionalities
  </div>
  <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
    <ULink to="/">Home</ULink>
  </div>
  <UInputMenu
      v-model="selectedName"
      :search="getAutocompleteSuggestions"
      placeholder="Enter a name..."
      option-attribute="name"
      trailing
      by="id"
  />
  <UCard class="m-4">{{ intro }}</UCard>
  <img alt="profile picture" :src="imageUrl" v-if="imageUrl" class="m-4"/>
  <UCard class="m-4">{{ infoBox }}</UCard>
</template>
