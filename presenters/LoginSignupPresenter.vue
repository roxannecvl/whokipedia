<script setup lang="ts">

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type UserCredential } from "firebase/auth";
import { useCurrentUser, useFirebaseAuth, updateCurrentUserProfile } from "vuefire";
import { initializeFirebase, readUserFromFirebase, saveUserToFirebase } from "~/model/FirebaseModel";
import { type UserStore } from "~/model/UserModel";
import LoginView from "~/views/LoginView.vue";
import SignupView from "~/views/SignupView.vue";

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
let ready = ref(false)
const toast = useToast()
const auth = useFirebaseAuth()!
const user = useCurrentUser()

// Refs
const isLogInOpen = ref(false)

// Watchers
onMounted(() => {
  ready.value = true
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // User logged out
      props.model.$reset()
    } else if (user) {
      // User logged in
      readUserFromFirebase(props.model, user.uid)
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

</script>

<template>
  <div v-if="ready">
  <UButton v-if="user" label="Log out" @click="logout"/>
  <UButton v-else label="Log in" @click="isLogInOpen = true" />
  <UModal v-model="isLogInOpen">
    <div class="p-4">
      <div class="flex justify-center">
        <div class="w-60 ">
          <UTabs :items="[{ key: 'login', label: 'Log in' },  { key: 'signup', label: 'Sign up' }]">
            <template #item="{ item }">
              <div v-if="item.key === 'login'">
                <LoginView @login-event="login"/>
              </div>
              <div v-else-if="item.key === 'signup'">
                <SignupView @signup-event="signup"/>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </div>
  </UModal>
  </div>
</template>