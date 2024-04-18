<script setup lang="ts">

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type UserCredential } from "firebase/auth";
import { useCurrentUser, useFirebaseAuth, updateCurrentUserProfile } from "vuefire";
import { initializeFirebase, readUserFromFirebase, saveUserToFirebase } from "~/model/FirebaseModel";
import { type UserStore } from "~/model/UserModel";
import LoginView from "~/views/LoginView.vue";
import SignupView from "~/views/SignupView.vue";
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
const toast = useToast()
const auth = useFirebaseAuth()!
const user = useCurrentUser()

// Refs
const isLogInOpen = ref(false)
const isUserLoggedIn = ref(false)

// Watchers
onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // User logged out
      props.model.$reset()
      isUserLoggedIn.value = false
    } else if (user) {
      // User logged in
      readUserFromFirebase(props.model, user.uid)
      isUserLoggedIn.value = true
      isLogInOpen.value = false
    }
  })
})


// Functions
/**
 * Displays an error notification
 *
 * @param description - The description of the error
 */
function displayErrorNotification(description: string) {
  toast.add({ title: 'Error', description: description, icon: 'i-heroicons-x-circle', color:"red"})
}

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
        displayErrorNotification(message)
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
        saveUserToFirebase(props.model, credentials.user?.uid);
        updateCurrentUserProfile({displayName: username})
      })
      .catch((error) => {
        const message: string = "Failed to sign up : " + error
        console.error(message)
        displayErrorNotification(message)
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
        displayErrorNotification(message)
      })
}

function changeLogInOpenStatus(value : boolean) : void {
  isLogInOpen.value = value
}

</script>

<template>
  <LoginSignupView
      @login-event-bis="login" @signup-event-bis="signup" @logout-event="logout"
      @open-login="changeLogInOpenStatus(true)" @close-login="changeLogInOpenStatus(false)"
      :isLogInOpen="isLogInOpen" :isUserLoggedIn="isUserLoggedIn"
  />

</template>