<script
  setup
  lang="ts">

import SignupLoginPresenter from "~/presenter/signupLoginPresenter.vue"

const isOpen = ref(false)

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
    Home
  </div>
  <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
    <ULink to="/example">Go to example</ULink>
  </div>
  <div>
    <UButton label="Sign up / Log in" @click="isOpen = true" />
    <UModal v-model="isOpen">
      <div class="p-4">
        <SignupLoginPresenter />
      </div>
    </UModal>
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
