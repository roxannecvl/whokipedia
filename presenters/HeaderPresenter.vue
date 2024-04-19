<script setup lang="ts">

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type UserCredential } from "firebase/auth";
import { useCurrentUser, useFirebaseAuth } from "vuefire";
import {
  getAllUserFromFirebase,
  initializeFirebase,
  readUserFromFirebase,
  saveUserToFirebase,
  updateUserToFirebase,
  type UserPersistence,
} from "~/model/FirebaseModel";
import { type UserStore } from "~/model/UserModel";
import { getCurrentDayTimestamp, getRandomNumber, getRandomTimedStats } from "~/utilities/Utils";
import HeaderView from "~/views/HeaderView.vue";

// Props
const props = defineProps({
  model: {
      type: Object as () => UserStore,
      required: true,
  },
})

// Set up authentication
initializeFirebase()

// Constants
const auth = useFirebaseAuth()!
const user = useCurrentUser()

// Refs
const closeModal = ref(false)
const errorMessage = ref("")
const usersData = ref([] as leaderboardData[])
interface leaderboardData {
  readonly rank: number,
  readonly username: string,
  readonly guesses: number,
  readonly time: number,
  readonly averageRank: number,
}

// Watchers
onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // User logged out
      props.model.$reset()
    } else if (user) {
      // User logged in
      readUserFromFirebase(props.model, user.uid)
      closeModal.value = true
      setTimeout(() => {
        closeModal.value = false
      }, 1000);
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
        }, 300);
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
        saveUserToFirebase(props.model, username, credentials.user?.uid);
      })
      .catch((error) => {
        const message: string = "Failed to sign up : " + error
        console.error(message)
        errorMessage.value = message
        setTimeout(() => {
          errorMessage.value = ""
        }, 300);
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
        }, 300);
      })
}

function populateStats () {
  if(user.value) {
    props.model.updateStats(
        getRandomNumber(1, 10),
        getRandomNumber(1, 10),
        getRandomNumber(1, 10),
        getRandomNumber(1, 10),
        getRandomNumber(1, 10),
        getRandomNumber(1, 10),
        getRandomTimedStats(10)
    )
    updateUserToFirebase(props.model, user.value.uid)
  }
}

function updateLeaderboard(){
  getAllUserFromFirebase().then(data => {

    // Keep only players of the day
    let filteredUserData : UserPersistence[] = data.filter((item: UserPersistence) =>
        item.stats && item.stats.find((stat: any) => parseInt(stat.date) === getCurrentDayTimestamp()))

    // Sort by number of guesses or time if number of guesses is equal
    let rankedData : UserPersistence []  = filteredUserData.sort((a: UserPersistence, b: UserPersistence) => {
      const aStats = a.stats.find((stat: any) => parseInt(stat.date) === getCurrentDayTimestamp())
      const bStats = b.stats.find((stat: any) => parseInt(stat.date) === getCurrentDayTimestamp())
      if (aStats && bStats) {
        if (aStats.guesses === bStats.guesses) {
          return aStats.time - bStats.time;
        }
        return aStats.guesses - bStats.guesses;
      }
      return 0;
    })

    // Keep only information relevant to the leaderboard
    usersData.value = rankedData.map((val : UserPersistence) => {
      const stats = val.stats.find((stat: any) => parseInt(stat.date) === getCurrentDayTimestamp())
      if(stats) return {
        rank: stats.rank,
        username : val.username,
        guesses : stats.guesses,
        time : stats.time,
        averageRank : val.averageRank}
      else return {
        rank :filteredUserData.length + 1,
        username : val.username,
        guesses : 1000,
        time : 1000,
        averageRank : val.averageRank}
    })
  })
}

</script>

<template>
  <HeaderView
      @login-event-tris="login"
      @signup-event-tris="signup"
      @logout-event-bis="logout"
      @populate-stats="populateStats"
      @update-leaderboard-bis="updateLeaderboard"
      :closeLSV="closeModal"
      :errorLSV="errorMessage"
      :currentStreakSV="model.currentStreak"
      :maxStreakSV="model.maxStreak"
      :averageRankSV="model.averageRank"
      :averageGuessesSV="model.averageGuesses"
      :winRateSV="model.winRate"
      :gamesPlayedSV="model.gamesPlayed"
      :timedStatsSV="model.timedStats"
      :gamesLV="usersData"
      :usernameLV="model.username"
  />
</template>