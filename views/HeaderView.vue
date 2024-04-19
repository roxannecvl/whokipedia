<script lang="ts" setup>
import LoginSignupView from "~/views/LoginSignupView.vue";
import StatisticsView from "~/views/StatisticsView.vue";
import LeaderboardView from "~/views/LeaderboardView.vue";
import type { TimedStat } from "~/model/UserModel";

// Props
const props = defineProps({
  closeLSV: {
    type : Boolean,
    required : true,
  },
  errorLSV:{
    type : String,
    required :true,
  },
  currentStreakSV: {
    type: Number,
    required: true
  },
  maxStreakSV: {
    type: Number,
    required: true
  },
  averageRankSV: {
    type: Number,
    required: true
  },
  averageGuessesSV: {
    type: Number,
    required: true
  },
  winRateSV: {
    type: Number,
    required: true
  },
  gamesPlayedSV: {
    type: Number,
    required: true
  },
  timedStatsSV: {
    type: Array<TimedStat>,
    required: true
  },
  gamesLV : {
    type: Array<Object>,
    required: true,
  },
  usernameLV: {
    type: String,
    required: true,
  }
})

// Emits
const emit = defineEmits(['login-event-tris', 'signup-event-tris', 'logout-event-bis', 'populate-stats', 'update-leaderboard-bis'])

// Constants
const logoPath = '/img/logo-primary-filled.svg';
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
})

// Functions
function populateStats() {
  emit('populate-stats')
}

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
      <div class="p-3">
        <LeaderboardView
            @update-leaderboard ="emit('update-leaderboard-bis')"
            :games="gamesLV"
            :username="usernameLV"
        />
      </div>
      <div class="p-3">
        <StatisticsView
            @populate-stats="populateStats()"
            :current-streak="currentStreakSV"
            :max-streak="maxStreakSV"
            :average-guesses="averageGuessesSV"
            :average-rank="averageRankSV"
            :win-rate="winRateSV"
            :games-played="gamesPlayedSV"
            :timed-stats="timedStatsSV"
        />
      </div>
      <div class="p-3">
        <LoginSignupView
          @login-event-bis="(email, password) => emit('login-event-tris', email, password)"
          @signup-event-bis="(email, username, password) => emit('signup-event-tris', email, username, password)"
          @logout-event="emit('logout-event-bis')"
          :close="closeLSV"  :error="errorLSV"/>
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