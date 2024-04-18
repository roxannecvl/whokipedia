<script setup lang="ts">

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type UserCredential } from "firebase/auth";
import { useCurrentUser, useFirebaseAuth, updateCurrentUserProfile } from "vuefire";
import { initializeFirebase, readUserFromFirebase, saveUserToFirebase } from "~/model/FirebaseModel";
import { type UserStore } from "~/model/UserModel";
import LoginSignupView from "~/views/LoginSignupView.vue";

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
        updateCurrentUserProfile({displayName: username})
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

</script>

<template>
  <LoginSignupView
      @login-event-bis="login" @signup-event-bis="signup" @logout-event="logout"
      :isUserLoggedIn="user !== null" :close="closeModal"  :error="errorMessage"
  />
</template>