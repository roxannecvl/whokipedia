<script
    lang="ts"
    setup>
import { UserModel } from './model/UserModel';
import { initialiseFirebase } from './model/firebaseModel';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type UserCredential } from 'firebase/auth'
import { saveUserToFirebase, readUserFromFirebase } from '~/model/firebaseModel';
import LoginView from "~/views/loginView.vue";
import SignupView from "~/views/signUpView.vue";

const colorMode = useColorMode()
const isMessageOpen = ref(false)
const isDark = computed({
    get: () => colorMode.value === 'dark',
    set: () => colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
})

const userModel = reactive(new UserModel())
console.log(userModel)

initialiseFirebase()

const isLogInOpen = ref(false)
const message = ref('')

const auth = useFirebaseAuth()!
const user = useCurrentUser()

// we don't need this watcher on server
onMounted(() => {
  watch(user, (user, prevUser) => {
    console.log('User changed: ', user, prevUser)
    if (prevUser && !user) {
        // user logged out
        console.log('Successfully logged out')
        message.value = 'Successfully logged out'
        isMessageOpen.value = true
        userModel.resetStats()
    } else if (user) {
        // user logged in
        console.log('Successfully logged in')
        message.value = 'Successfully logged in'
        isMessageOpen.value = true
        readUserFromFirebase(userModel)
    }
  })
})

console.log('User: ', user)

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
        message.value = 'Failed log in: '+ reason
        isMessageOpen.value = true
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
        saveUserToFirebase(userModel, userCredentials.user?.uid);
    })
    .catch((reason) => {
        console.error('Failed sign up: ', reason)
        message.value = 'Failed sign up: '+reason
        isMessageOpen.value = true
    })
}

/**
 * Logs out the user
 */
function logout() {
    signOut(auth)
    .catch((reason) => {
        console.error('Failed log out: ', reason)
        message.value = 'Failed log out: '+reason
        isMessageOpen.value = true
    })
}

</script>

<template>
  <Body
      class="bg-gray-50 dark:bg-gray-950">
  <UContainer
      class="p-10 min-h-screen">
    <UCard>
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
          <div class="flex">
            <UIcon
                name="i-heroicons-magnifying-glass-16-solid"
                class="text-primary w-10 h-10"/>
            <p class="font-black text-3xl">
              Whokipedia
            </p>
          </div>

          <div>
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
          <div>
            <UButton label="Sign up / Log in" @click="isLogInOpen = true" />
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
                    <UButton v-if="user" :ui="{ rounded: 'rounded-full' }" @click="logout" label="Logout" />
                    <UButton v-else :ui="{ rounded: 'rounded-full' }" disabled label="Logout" />
                  </div>
                </div>

                <UModal v-model="isMessageOpen">
                  <div class="p-4">
                    <p>{{message}}</p>
                  </div>
                </UModal>
              </div>
            </UModal>
          </div>
        </div>
      </template>

      <main>
        <NuxtPage :userModel/>
      </main>

    </UCard>
  </UContainer>
  </Body>
</template>
