<script setup lang="ts">
import { useCurrentUser, useFirebaseAuth } from "vuefire"
import {
  getAllUserFromFirebase,
  readUserFromFirebase,
  updateUsernameToFirebase,
  type UserPersistence,
} from "~/model/FirebaseModel"
import { type TimedStat, type UserStore, useUserStore } from "~/model/UserModel"
import { formatTime, getCurrentDayTimestamp, sortTodayChallengers } from "~/utilities/Utils"
import { login, logout, signup, updateEmailAndPassword } from "~/utilities/Auth"
import HeaderView from "~/views/HeaderView.vue"

// Models
const userModel: UserStore = useUserStore()

// Constants
const user = useCurrentUser()!
const date : Date = new Date()
date.setHours(0,0,0,0)
let timeStamp = date.getTime()
const auth = useFirebaseAuth()!
const toast = useToast()

// Refs
const closeModal = ref(false)
const usersData = ref([] as LeaderboardData[])
export interface LeaderboardData {
  readonly rank: number,
  readonly username: string,
  readonly streak : number,
  readonly guesses: number,
  readonly time: string,
  readonly averageRank: number,
}

// Lifecycle hooks
onMounted(async () => {
  if(user.value) await readUserFromFirebase(userModel, user.value.uid)
  timeStamp = await getCurrentDayTimestamp()
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // User logged out
      userModel.$reset()
    } else if (user) {
      // User logged in
      readUserFromFirebase(userModel, user.uid)
      closeModal.value = true
      setTimeout(() => {
        closeModal.value = false
      }, 1000)
    }
  })
})

// Functions
/**
 * Method to update the leaderboard.
 */
function updateLeaderboard(): void {
  getAllUserFromFirebase().then(data => {
    const rankedData = sortTodayChallengers(data, timeStamp)

    // Keep only information relevant to the leaderboard
    usersData.value = rankedData.map((val : UserPersistence) => {
      const stats = val.stats.find((stat: TimedStat) => stat.date === timeStamp)
      if (stats) return {
        rank: stats.rank,
        username : val.username,
        streak : val.currentStreak,
        guesses : stats.guesses,
        time : formatTime(stats.time, true),
        averageRank : Math.round(val.averageRank)
      }
      else return {
        rank :rankedData.length + 1,
        username : val.username,
        streak : 0,
        guesses : NaN,
        time : " - ",
        averageRank : val.averageRank
      }
    })
  })
}
</script>

<template>
  <HeaderView
      @login-event-tris="(username: string, password: string) => login(username, password, auth, toast)"
      @signup-event-tris="(username: string, email: string, password: string) => signup(username, email, password, userModel, auth, toast)"
      @logout-event-bis="logout(auth, toast, useRoute().path)"
      @update-leaderboard-bis="updateLeaderboard"
      @change-info-event-tris="(username: string, email: string, password: string) => {
        updateEmailAndPassword(email, password, auth, toast)
        if (user) updateUsernameToFirebase(userModel, username, user.uid)
      }"
      :closeLSV="closeModal"
      :currentStreakUV="userModel.currentStreak"
      :maxStreakUV="userModel.maxStreak"
      :averageRankUV="Math.round(userModel.averageRank * 100) / 100"
      :averageGuessesUV="Math.round(userModel.averageGuesses * 100) / 100"
      :winRateUV="Math.round(userModel.winRate * 100) + '%'"
      :gamesPlayedUV="userModel.gamesPlayed"
      :timedStatsUV="userModel.timedStats"
      :gamesLV="usersData"
      :username="userModel.username"
  />
</template>