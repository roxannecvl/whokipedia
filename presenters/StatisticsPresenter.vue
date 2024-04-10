<script setup lang="ts">

import { useCurrentUser } from 'vuefire'
import type { UserStore } from "~/model/UserModel"
import { updateUserToFirebase } from "~/model/FirebaseModel"
import { getRandomUserModel } from "~/utilities/Utils";
import StatisticsView from "~/views/StatisticsView.vue"

defineProps({
  model: {
    type: Object as () => UserStore,
    required: true,
  }
})

let user = useCurrentUser()

// TODO: remove after testing
/**
 * Method to populate stats to persistence, used for testing purposes.
 */
const populateStats = (model: UserStore) => {
  if(user.value){
    const randomUserModel = getRandomUserModel()
    model.updateStats(
        randomUserModel.currentStreak,
        randomUserModel.maxStreak,
        randomUserModel.averageRank,
        randomUserModel.averageGuesses,
        randomUserModel.averageTime,
        randomUserModel.timesPlayed
    )
    updateUserToFirebase(model, user.value.uid)
  }
}

</script>

<template>
    <StatisticsView  @populate-stats="populateStats(model)"
                     :average-rank="model.averageRank" :average-guesses="model.averageGuesses"
                     :average-time="model.averageTime" :current-streak="model.currentStreak"
                     :guesses="model.guesses" :max-streak="model.maxStreak" :ranks="model.ranks"
                     :times="model.times" :times-played="model.timesPlayed"/>
</template>

