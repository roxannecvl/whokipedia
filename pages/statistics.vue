<script
    setup
    lang="tsx">

import StatisticsView
  from "~/views/statisticsView.vue";

const userModel = useAttrs().userModel

</script>

<template>
  <div class="flex justify-around">
    <div>
      <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
        <ULink
            to="/">
          Go to home
        </ULink>
      </div>
    </div>
      <StatisticsView
        :userModel />
  </div>
</template>