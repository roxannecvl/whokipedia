<script setup lang="ts">

import LoginSignupView from "~/views/LoginSignupView.vue"

// Props
defineProps({
  closeLSV: {
    type : Boolean,
    required : true,
  },
})

// Emits
const emit = defineEmits(['login-event-tris', 'signup-event-tris', 'logout-event-bis', 'reset-password-event-bis'])

// Refs
const logoPath = ref('')

// Constants
const logoFilledPath = '/img/logo-filled.svg'
const logoTransparentPath = '/img/logo-transparent.svg'
const mode = useColorMode()

watch(mode, (newMode) => {
  logoPath.value = newMode.value === 'dark' ? logoFilledPath : logoTransparentPath
})
onMounted(() => {
  logoPath.value = mode.value === 'dark' ? logoFilledPath : logoTransparentPath
})

</script>

<template>
  <div class="w-full h-full relative">
    <div class="absolute flex items-center left-2 sm:left-auto sm:right-0 lg:right-8
     h-full min-w-[32rem] aspect-square box-border p-8 pointer-events-none">
      <img :src="logoPath" class="w-full h-full object-contain opacity-60
      dark:opacity-60 blur-[6px] sm:blur-[7px] md:blur-[8px]" alt="Whokipedia"/>
    </div>
    <div class="relative h-full flex flex-col justify-center gap-6 sm:gap-8 md:w-2/3 py-0 z-10">
      <div class="flex flex-col gap-4 p-2">
        <div class="flex flex-col gap-2">
          <div class="text-4xl sm:text-5xl font-black text-primary dark:drop-shadow-lg">Whokipedia</div>
          <div class="text-2xl sm:text-3xl font-black dark:drop-shadow">The ultimate guessing game!</div>
        </div>
        <div class="text-lg sm:text-xl text-justify dark:drop-shadow">
          Test your knowledge of the who's who in Whokipedia,
          where each clue leads you closer to uncovering the celebrity behind the blur!
        </div>
      </div>

      <div class="flex flex-row drop-shadow">
        <LoginSignupView
            @login-event-bis="(email: string, password: string) => emit('login-event-tris', email, password)"
            @signup-event-bis="(username: string, email: string, password: string) => {
              emit('signup-event-tris', username, email, password)
            }"
            @logout-event="() => emit('logout-event-bis')"
            @reset-password-event-bis ="(email: string) => emit('reset-password-event-bis', email)"
            :close="closeLSV" :welcome="true"/>
        <div class="p-2">
          <UButton to="/solo-mode" size="xl" class="text-xl" label="Play">
            Play solo
          </UButton>
        </div>
      </div>

      <div class="p-2 box-border dark:drop-shadow-lg">
        <div class="w-full relative overflow-hidden rounded-lg p-4 text-gray-900 dark:text-white bg-gray-50/60
        dark:bg-gray-900/60 ring-1 ring-gray-200/60 dark:ring-gray-800/60">
          <div class="flex flex-col gap-3">
            <div class="flex flex-row items-center gap-2 pb-2">
              <p class="i-heroicons-check-circle text-lg"/>
              <p class="font-black text-xl">
                How to play
              </p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-lg font-semibold">
                Guess the celebrity <span class="text-primary">in as few hints as possible</span>
              </p>
              <ul class="list-inside m-2">
                <li><UIcon name="i-heroicons-arrow-long-right-16-solid"/>
                  Each unsuccessful guess brings a <span class="text-primary">new hint</span>.</li>
                <li><UIcon name="i-heroicons-arrow-long-right-16-solid"/>
                  Guess until you find the <span class="text-primary">celebrity</span> or until
                  <span class="text-primary">all hints are consumed</span>.</li>
                <li><UIcon name="i-heroicons-arrow-long-right-16-solid"/>
                  If you do not have the slightest <span class="text-primary">idea</span>, press the
                  <UIcon class="text-primary" name="i-heroicons-plus-circle-16-solid"/> button to get a new hint. Be
                  careful, this will <span class="text-primary">consume</span> a new guess !</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
