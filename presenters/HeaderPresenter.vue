<script setup lang="ts">

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type UserCredential } from "firebase/auth"
import { useCurrentUser, useFirebaseAuth } from "vuefire"
import {
  getAllUserFromFirebase,
  initializeFirebase,
  readUserFromFirebase,
  saveUserToFirebase,
  type UserPersistence,
} from "~/model/FirebaseModel"
import { type TimedStat, type UserStore } from "~/model/UserModel"
import { formatTime, getCurrentDayTimestamp, sortTodayChallengers } from "~/utilities/Utils"
import HeaderView from "~/views/HeaderView.vue"

// Set up authentication
initializeFirebase()

// Props
const props = defineProps({
  userModel: {
      type: Object as () => UserStore,
      required: true,
  },
})

// Constants
const auth = useFirebaseAuth()!
const user = useCurrentUser()
const date : Date = new Date()
date.setHours(0,0,0,0)
let timeStamp = date.getTime()

// Refs
const closeModal = ref(false)
const errorMessage = ref("")
const usersData = ref([] as leaderboardData[])
export interface leaderboardData {
  readonly rank: number,
  readonly username: string,
  readonly streak : number,
  readonly guesses: number,
  readonly time: string,
  readonly averageRank: number,
}

// Lifecycle hooks
onMounted(async () => {
  timeStamp = await getCurrentDayTimestamp()
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // User logged out
      props.userModel.$reset()
    } else if (user) {
      // User logged in
      readUserFromFirebase(props.userModel, user.uid)
      closeModal.value = true
      setTimeout(() => {
        closeModal.value = false
      }, 1000)
    }
  })
})


// Functions
/**
 * Method to log in the user.
 * @param username - Username used for login
 * @param password - Password used for login
 */
function login(username: string, password: string): void {
  signInWithEmailAndPassword(auth, username, password)
      .catch((error) => {
        const message: string = "Failed to log in : " + error
        console.error(message)
        errorMessage.value = message
        setTimeout(() => {
          errorMessage.value = ""
        }, 300)
      })
}

/**
 * Method to sign up the user.
 * @param username - Username used for signup
 * @param email - Email used for signup
 * @param password - Password used for signup
 */
function signup(email: string, username: string, password: string): void {
  createUserWithEmailAndPassword(auth, email, password)
      .then((credentials: UserCredential) => {
        saveUserToFirebase(props.userModel, username, credentials.user?.uid)
      })
      .catch((error) => {
        const message: string = "Failed to sign up : " + error
        console.error(message)
        errorMessage.value = message
        setTimeout(() => {
          errorMessage.value = ""
        }, 300)
      })
}

/**
 * Method to log out the user.
 */
function logout(): void {
  signOut(auth)
      .catch((error) => {
        const message = "Failed to log out : " + error
        console.error(message)
        errorMessage.value = message
        setTimeout(() => {
          errorMessage.value = ""
        }, 300)
      })
}

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
      @login-event-tris="login"
      @signup-event-tris="signup"
      @logout-event-bis="logout"
      @update-leaderboard-bis="updateLeaderboard"
      :closeLSV="closeModal"
      :errorLSV="errorMessage"
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