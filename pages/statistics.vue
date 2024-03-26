<script
    setup
    lang="tsx">

import StatisticsView
  from "~/views/statisticsView.vue";
import { updateUserToFirebase } from '~/model/firebaseModel'
import { Utils } from "~/utilities/Utils";

const userModel = useAttrs().userModel
const user = useCurrentUser()

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
    <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
      <UButton @click="updateUserToFirebase(Utils.getRandomUserModel(), user?.uid)">Populate stats</UButton>
    </div>
  </div>
</template>