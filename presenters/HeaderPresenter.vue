<script setup lang="ts">
import { useCurrentUser, useFirebaseAuth } from "vuefire"
import {
  getAllUserFromFirebase,
  readUserFromFirebase,
  type UserPersistence,
} from "~/model/FirebaseModel"
import { type TimedStat, type UserStore, useUserStore } from "~/model/UserModel"
import { formatTime, getCurrentDayTimestamp, sortTodayChallengers } from "~/utilities/Utils"
import HeaderView from "~/views/HeaderView.vue"
import { login, logout, signup } from "~/utilities/Auth"

// Models
const userModel: UserStore = useUserStore()

// Constants
const user = useCurrentUser()
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
      @signup-event-tris="(email: string, username: string, password: string) => signup(email, username, password, userModel, auth, toast)"
      @logout-event-bis="logout(auth, toast, useRoute().path)"
      @update-leaderboard-bis="updateLeaderboard"
      :closeLSV="closeModal"
      :currentStreakSV="userModel.currentStreak"
      :maxStreakSV="userModel.maxStreak"
      :averageRankSV="Math.round(userModel.averageRank * 100) / 100"
      :averageGuessesSV="Math.round(userModel.averageGuesses * 100) / 100"
      :winRateSV="Math.round(userModel.winRate * 100) + '%'"
      :gamesPlayedSV="userModel.gamesPlayed"
      :timedStatsSV="userModel.timedStats"
      :gamesLV="usersData"
      :usernameLV="userModel.username"
  />
</template>