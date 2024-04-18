<script lang="ts" setup>
import LoginSignupView from "~/views/LoginSignupView.vue";
import SignupView from "~/views/SignupView.vue";

// Props
const props = defineProps({
  isUserLoggedInLSV: {
    type : Boolean,
    required : true,
  },
  closeLSV: {
    type : Boolean,
    required : true,
  },
  errorLSV:{
    type : String,
    required :true,
  }
})

// Emits
const emit = defineEmits(['login-event-tris', 'signup-event-tris', 'logout-event-bis'])

// Constants
const logoPath = '/img/logo-primary-filled.svg';

// Set up color mode
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
})

const user = useCurrentUser()

</script>

<template>
  <div class="flex justify-between items-center " style="max-height: 3vh">
    <div>
      <ClientOnly>
        <UTooltip :text="`Switch to ${isDark ? 'Light' : 'Dark'} Mode`">
          <UButton
              :icon="isDark ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'"
              @click="isDark = !isDark"
              color="white"/>
        </UTooltip>
      </ClientOnly>
    </div>
    <a href="/">
      <div class="flex">
        <img :src="logoPath" alt="logo" class="w-9 h-9 mx-auto"/>
        <p class="font-black text-3xl hidden sm:block select-none">Whokipedia</p>
      </div>
    </a>
    <div class="flex justify-between items-center">
      <div><UButton @click="navigateTo('/statistics')" :disabled="!user">Statistics</UButton></div>
      <div class="p-3">
        <LoginSignupView
          @login-event-bis="(email, password) => emit('login-event-tris', email, password)"
          @signup-event-bis="(email, username, password) => emit('signup-event-tris', email, username, password)"
          @logout-event="emit('logout-event-bis')"
          :isUserLoggedIn="isUserLoggedInLSV" :close="closeLSV"  :error="errorLSV"/>
      </div>
      <div class="p-3">
        <ClientOnly>
          <UTooltip text="Open on Github">
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
</template>
