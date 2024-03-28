<script
    setup
    lang="tsx">

import StatisticsView
  from "~/views/StatisticsView.vue";
import { updateUserToFirebase } from '~/model/FirebaseModel'
import { getRandomUserModel } from "~/utilities/Utils";

const userModel: any = useAttrs().userModel
const user = useCurrentUser()

const populateStats = () => {
  if(user.value){
    const randomUserModel = getRandomUserModel()
    userModel.updateStats(randomUserModel.currentStreak, randomUserModel.maxStreak, randomUserModel.averageRank, randomUserModel.averageGuesses, randomUserModel.averageTime, randomUserModel.timesPlayed, randomUserModel.times, randomUserModel.ranks, randomUserModel.guesses)
    updateUserToFirebase(userModel, user.value.uid)
  }
}

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
    <div v-if="user" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
      <UButton @click="populateStats">Populate stats</UButton>
    </div>
  </div>
</template>