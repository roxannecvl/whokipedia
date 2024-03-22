<template>
  <div>
    Home
  </div>
  <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
    <ULink to="/example">Go to example</ULink>
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
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getAutocompleteSuggestions} from "~/model/CelebrityList";


const selectedName = ref("");
const intro = ref("");

const getData = async () => {
  intro.value = "data"
}

watch(selectedName, getData)
</script>