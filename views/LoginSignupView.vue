<script setup lang="ts">

import { UserModel } from "~/model/UserModel";
import LoginView from "~/views/LoginView.vue";
import { initialiseFirebase } from '~/model/FirebaseModel';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type UserCredential } from 'firebase/auth'
import { saveUserToFirebase, readUserFromFirebase } from '~/model/FirebaseModel';
import SignupView from "~/views/SignupView.vue";

const props = defineProps({
  userModel: {
      type: UserModel,
      required: true,
  },
})

const toast = useToast()

initialiseFirebase()

const isLogInOpen = ref(false)

const auth = useFirebaseAuth()!
const user = useCurrentUser()

const isUserLoggedIn = ref(false)

// we don't need this watcher on server
onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // user logged out      
      props.userModel.resetStats()
      isUserLoggedIn.value = false
      isLogInOpen.value = false
    } else if (user) {
      // user logged in
      readUserFromFirebase(props.userModel)
      isUserLoggedIn.value = true
      isLogInOpen.value = false
    }
  })
})


/**
 * Displays an error notification
 *
 * @param description - The description of the error
 */
function displayErrorNotification(description: string) {
  toast.add({ title: 'Error', description: description, icon: 'i-heroicons-x-circle', color:"red"})
}

/**
 * Logs in the user
 *
 * @param username - The username used to log in
 * @param password - The password used to log in
 */
function login(username: string, password: string) {
  signInWithEmailAndPassword(auth, username, password)
      .catch((reason) => {
        console.error('Failed log in: ', reason)
        displayErrorNotification('Failed log in '+reason)
      })
}

/**
 * Signs up the user
 *
 * @param username - The username used to sign up
 * @param password - The password used to sign up
 */
function signup(username: string, password: string) {
  createUserWithEmailAndPassword(auth, username, password)
      .then((userCredentials: UserCredential) => {
        saveUserToFirebase(props.userModel, userCredentials.user?.uid);
      })
      .catch((reason) => {
        console.error('Failed sign up: ', reason)
        displayErrorNotification('Failed sign up '+reason)
      })
}

/**
 * Logs out the user
 */
function logout() {
  signOut(auth)
      .catch((reason) => {
        console.error('Failed log out: ', reason)
        displayErrorNotification('Failed log out '+reason)
      })
}
</script>

<template>
    <UButton v-if="isUserLoggedIn" label="Log out" @click="logout"/>
    <UButton v-else label="Log in" @click="isLogInOpen = true" />
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
</template>