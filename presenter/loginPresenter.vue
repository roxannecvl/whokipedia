<script
    setup
    lang="tsx">
    
    import LoginView
    from "~/views/loginView.vue";
    import SignupView
    from "~/views/signUpView.vue";

    import { signIn, signOutUser, signUp } from "~/services/auth";

    const items = [{
      key: 'login',
      label: 'Log in'
    }, {
      key: 'signup',
      label: 'Sign up'
    }]

    const isOpen = ref(false)
    
    const auth = useFirebaseAuth()!
    const user = useCurrentUser()

    function login(username: string, password: string) {
      signIn(auth, username, password)
      .then(() => {
        console.log('Successfully logged in')
        message.value = 'Successfully logged in'
        isOpen.value = true
      })
      .catch((reason) => {
        console.error('Failed log in: ', reason)
        message.value = 'Failed log in: '+reason
        isOpen.value = true
      })
    }

    function signup(username: string, password: string) {
      signUp(auth, username, password).then(() => {
        console.log('Successfully signed up')
        message.value = 'Successfully signed up'
        isOpen.value = true
      })
      .catch((reason) => {
        console.error('Failed sign up: ', reason)
        message.value = 'Failed sign up: '+reason
        isOpen.value = true
      })
    }

    function logout() {
      signOutUser(auth)
      .then(() => {
        console.log('Successfully logged out')
        message.value = 'Successfully logged out'
        isOpen.value = true
      })
      .catch((reason) => {
        console.error('Failed log out: ', reason)
        message.value = 'Failed log out: '+reason
        isOpen.value = true
      })
    }

    const message = ref('')
</script>

<template>
  <div class="flex justify-center">
    <div class="w-60 ">
      <UTabs :items="items">
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

  <UModal v-model="isOpen">
    <div class="p-4">
      <p>{{message}}</p>
    </div>
  </UModal>
</template>