<template>
  <div>
    Home
  </div>
  <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
    <ULink to="/example">Go to example</ULink>
  </div>
  <form @submit.prevent="getData">
    <label for="name" class="mr-4">Enter Name</label>
    <input type="text" id="name" v-model="selectedName" placeholder="Enter name" class="mr-4">
    <button type="submit">Get Data</button>
  </form>
  <UCard class="m-4">{{ intro }}</UCard>
  <img alt="profile picture" :src="imageUrl" v-if="imageUrl" class="m-4"/>
  <UCard class="m-4">{{ infoBox }}</UCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { fetchIntro, fetchImageUrl, fetchInfoBox } from "~/api/wikipediaSource";

const selectedName = ref("Albert_Einstein");
const intro = ref("");
const imageUrl = ref("");
const infoBox = ref("");

const getData = async () => {
  intro.value = await fetchIntro(selectedName.value);
  imageUrl.value = await fetchImageUrl(selectedName.value, 100);
  infoBox.value = await fetchInfoBox(selectedName.value);
}
</script>
