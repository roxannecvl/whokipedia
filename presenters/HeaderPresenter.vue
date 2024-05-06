<script setup lang="ts">
import { useCurrentUser, useFirebaseAuth } from "vuefire"
import type { User } from "firebase/auth"
import {
  getAllUserFromFirebase,
  readUserFromFirebase,
  updateUsernameToFirebase,
  type UserPersistence,
} from "~/model/FirebaseModel"
import { type TimedStat, type UserStore, useUserStore } from "~/model/UserModel"
import {
  formatTime,
  getCurrentDayTimestamp,
  sortTodayChallengers
} from "~/utilities/Utils"
import {
  login,
  logout,
  signup,
  updateEmail,
  updatePassword,
  reauthenticate,
  deleteAccount,
  resetPassword
} from "~/utilities/Auth"
import HeaderView from "~/views/HeaderView.vue"

// Models
const userModel: UserStore = useUserStore()

// Constants
const user = useCurrentUser()!
const auth = useFirebaseAuth()!
const toast = useToast()
let timeStamp = new Date().setHours(0,0,0,0)

// Computed
const username = computed(() => userModel.username)

// Refs
const closeModal = ref(false)
const usersData = ref([] as LeaderboardData[])

// Types
export type LeaderboardData = {
  readonly rank: number,
  readonly username: string,
  readonly streak : number,
  readonly guesses: number,
  readonly time: string,
  readonly averageRank: number,
}

// Lifecycle hooks
onMounted(async () => {
  if (user.value) await readUserFromFirebase(userModel, user.value.uid)
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
 * Method to update the leaderboard, keeping the relevant data from the database.
 */
async function updateLeaderboard(): Promise<void> {
  return getAllUserFromFirebase().then(data => {
    const rankedData = sortTodayChallengers(data, timeStamp)
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

/**
 * Method to change user info, ensuring re-authentication before any updates as required by Firebase.
 * @param newUsername - New username, if identical to the current username, no update is made
 * @param newEmail - New email, if identical to the current email, no update is made
 * @param newPassword - New password, if undefined, no update is made
 * @param email - Current email used to reauthenticate
 * @param password - Current password used to reauthenticate
 */
async function changeInfo(
    newUsername: string,
    newEmail: string,
    newPassword: string | undefined,
    email: string,
    password: string
): Promise<void> {
  if (user.value) {
    const innerUser: User = user.value
    return reauthenticate(email, password, user.value, toast)
        .then(async () => {
          if (email !== newEmail) await updateEmail(newEmail, innerUser, toast)
          if (newPassword) await updatePassword(newPassword, innerUser, toast)
          if (username.value !== newUsername) await updateUsernameToFirebase(userModel, newUsername, userModel.uid, toast)
        })
        .catch()
  }
}

/**
 * Method to delete a user account, ensuring re-authentication before any updates as required by Firebase.
 * @param email - Current email of user to delete to reauthenticate
 * @param password - Current password of user to delete to reauthenticate
 */
async function deleteUser(email: string, password: string): Promise<void> {
  if (user.value) {
    const innerUser: User = user.value
    return reauthenticate(email, password, innerUser, toast)
      .then(async () => {
          await deleteAccount(innerUser, toast)
          await useRouter().push('/')
      })
      .catch()
  }
}
</script>

<template>
  <HeaderView
      @login-event-tris="async (email: string, password: string) => {
        await login(email, password, auth, toast)
      }"
      @reset-password-event-tris="async (email: string) => {
        await resetPassword(email, auth, toast)
      }"
      @signup-event-tris="async (signupUsername: string, email: string, password: string) => {
        await signup(signupUsername, email, password, userModel, auth, toast)
      }"
      @logout-event-bis="async () => {
        await logout(auth, toast)
        if (useRoute().path === '/daily-challenge') await useRouter().push('/')
      }"
      @update-leaderboard-bis="updateLeaderboard"
      @change-info-event-tris="async (
          newUsername: string,
          newEmail: string,
          newPassword: string | undefined,
          email: string,
          password: string
      ) => {
        await changeInfo(newUsername, newEmail, newPassword, email, password)
      }"
      @delete-account-event-tris="async (email: string, password: string) => {
        await deleteUser(email, password)
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
      :username="username"
  />
</template>