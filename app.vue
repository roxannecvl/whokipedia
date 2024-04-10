<script lang="ts" setup>

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type UserCredential } from 'firebase/auth'
import { type UserStore, useUserStore } from "./model/UserModel";
import { initializeFirebase, saveUserToFirebase, readUserFromFirebase } from '~/model/FirebaseModel';
import LoginView from "~/views/LoginView.vue";
import SignupView from "~/views/SignupView.vue";

// Initialize Firebase
initializeFirebase()

// Set up user model
const store: UserStore = useUserStore()

// Initialize authentication
const auth = useFirebaseAuth()!
const user = useCurrentUser()

// Set up color mode
const colorMode = useColorMode()
const isErrorModalOpen = ref(false)
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
})

const isLogInOpen = ref(false)
const errorMessage = ref('')
const isUserLoggedIn = ref(false)

// Keep this watcher client-side
onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // User logged out
      store.$reset()
      isUserLoggedIn.value = false
    } else if (user) {
      // User logged in
      readUserFromFirebase(store)
      isUserLoggedIn.value = true
    }
  })
})

/**
 * Method to log in the user.
 * @param username - Username used for login
 * @param password - Password used for login
 */
function login(username: string, password: string): void {
  isLogInOpen.value = false
  signInWithEmailAndPassword(auth, username, password)
      .catch((error) => {
        const message: string = "Failed to log in : " + error
        console.error(message)
        errorMessage.value = message
        isErrorModalOpen.value = true
      })
}

/**
 * Method to sign up the user.
 * @param username - Username used for signup
 * @param password - Password used for signup
 */
function signup(username: string, password: string): void {
  isLogInOpen.value = false
  createUserWithEmailAndPassword(auth, username, password)
      .then((credentials: UserCredential) => {
        saveUserToFirebase(store, credentials.user?.uid);
      })
      .catch((error) => {
        const message: string = "Failed to sign up : " + error
        console.error(message)
        errorMessage.value = message
        isErrorModalOpen.value = true
      })
}

/**
 * Method to log out the user.
 */
function logout(): void {
  signOut(auth)
      .catch((reason) => {
        console.error('Failed log out: ', reason)
        errorMessage.value = 'Failed log out: ' + reason
        isErrorModalOpen.value = true
      })
}

</script>

<template>
  <Body
      class="bg-gray-50 dark:bg-gray-950 h-full">
  <UContainer
      class="p-0 sm:py-5">
    <UCard :ui="{
      rounded: 'rounded-none sm:rounded-lg',
    }">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <ClientOnly>
              <UTooltip
                  :text="`Switch to ${isDark ? 'Light' : 'Dark'} Mode`">
                <UButton
                    :icon="isDark ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'"
                    @click="isDark = !isDark"
                    color="white"/>
              </UTooltip>
            </ClientOnly>
          </div>
          <a href="/">
            <div class="flex">
              <UIcon
                  name="i-heroicons-magnifying-glass-16-solid"
                  class="text-primary w-10 h-10 hidden sm:block"/>
              <p class="font-black text-3xl hidden sm:block select-none">
                Whokipedia
              </p>
            </div>
          </a>
          <div class="flex justify-between items-center">
            <div class="p-3">
              <UButton v-if="isUserLoggedIn" label="Log out" @click="logout"/>
              <UButton v-else label="Log in" @click="isLogInOpen = true"/>
              <UModal v-model="isLogInOpen">
                <div class="p-4">
                  <div class="flex justify-center">
                    <div class="w-60 ">
                      <UTabs :items="[
                        { key: 'login', label: 'Log in' },
                        { key: 'signup', label: 'Sign up' }
                        ]">
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
            <div class="p-3">
              <ClientOnly>
                <UTooltip
                    text="Open on Github">
                  <UButton
                      :to="`https://github.com/roxannecvl/whokipedia`"
                      icon="i-simple-icons-github"
                      color="white"
                      target="_blank"/>
                </UTooltip>
              </ClientOnly>
            </div>
          </div>
        </div>
        <UModal v-model="isErrorModalOpen">
          <div class="p-4">
            <p>{{ errorMessage }}</p>
          </div>
        </UModal>
      </template>

      <main>
        <NuxtPage/>
      </main>

    </UCard>
  </UContainer>
  </Body>
</template>
