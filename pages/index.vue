<template>
  <div>
    Home
  </div>
  <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
    <ULink
        to="/example">
      Go to example
    </ULink>
  </div>
</template>

<script lang="ts">
import { fetchIntro, fetchImageUrl } from "~/api/wikipediaSource";
const s : string = await fetchIntro("Jupiter");
console.log(s)
const url : string = await fetchImageUrl("Jupiter", 100);
console.log(url)
</script>