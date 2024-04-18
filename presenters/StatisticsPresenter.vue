<script setup lang="ts">

import { useCurrentUser } from 'vuefire'
import type { UserStore } from "~/model/UserModel"
import StatisticsView from "~/views/StatisticsView.vue"
import { getRandomNumber, getRandomTimedStats } from "~/utilities/Utils";
import { updateUserToFirebase } from "~/model/FirebaseModel";

// Props
const props = defineProps({
  model: {
    type: Object as () => UserStore,
    required: true,
  }
})

// Constants
const user = useCurrentUser()

// Functions
function populateStats () {
  if(user.value) {
    props.model.updateStats(
        getRandomNumber(1, 10),
        getRandomNumber(1, 10),
        getRandomNumber(1, 10),
        getRandomNumber(1, 10),
        getRandomNumber(1, 10),
        getRandomNumber(1, 10),
        getRandomNumber(1, 10),
        getRandomTimedStats(1)
    )
    updateUserToFirebase(props.model, user.value.uid)
  }
}

</script>

<template>
    <StatisticsView
        @populate-stats="populateStats()"
        :current-streak="model.currentStreak"
        :max-streak="model.maxStreak"
        :average-guesses="model.averageGuesses"
        :average-rank="model.averageRank"
        :win-rate="model.winRate"
        :games-played="model.gamesPlayed"
        :timed-stats="model.timedStats"
    />
</template>

