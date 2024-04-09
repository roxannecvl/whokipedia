<script setup lang="tsx">

import { updateUserToFirebase } from '~/model/FirebaseModel'
import { getRandomUserModel } from "~/utilities/Utils";
import {type UserStore, useUserStore} from "~/model/UserModel";
import StatisticsView from "~/views/StatisticsView.vue";

const store: UserStore = useUserStore()
const user = useCurrentUser()

// TODO: remove after testing
/**
 * Method to populate stats to persistence, used for testing purposes.
 */
const populateStats = () => {
  if(user.value){
    const randomUserModel = getRandomUserModel()
    store.updateStats(
        randomUserModel.currentStreak,
        randomUserModel.maxStreak,
        randomUserModel.averageRank,
        randomUserModel.averageGuesses,
        randomUserModel.averageTime,
        randomUserModel.timesPlayed
    )
    updateUserToFirebase(store, user.value.uid)
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
      <StatisticsView :model="store" />
    <div v-if="user" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
      <UButton @click="populateStats">Populate stats</UButton>
    </div>
  </div>
</template>