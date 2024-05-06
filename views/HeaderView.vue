<script lang="ts" setup>
import type { TimedStat } from "~/model/UserModel"
import type { LeaderboardData } from "~/presenters/HeaderPresenter.vue";
import LoginSignupView from "~/views/LoginSignupView.vue"
import LeaderboardView from "~/views/LeaderboardView.vue"
import UserAccountView from "~/views/AccountView.vue";

// Props
defineProps({
  closeLSV: {
    type : Boolean,
    required : true,
  },
  currentStreakUV: {
    type: Number,
    required: true
  },
  maxStreakUV: {
    type: Number,
    required: true
  },
  averageRankUV: {
    type: Number,
    required: true
  },
  averageGuessesUV: {
    type: Number,
    required: true
  },
  winRateUV: {
    type: String,
    required: true
  },
  gamesPlayedUV: {
    type: Number,
    required: true
  },
  timedStatsUV: {
    type: Array<TimedStat>,
    required: true
  },
  gamesLV : {
    type: Array<LeaderboardData>,
    required: true,
  },
  username: {
    type: String,
    required: true,
  }
})

// Emits
const emit = defineEmits([
    'login-event-tris',
    'signup-event-tris',
    'logout-event-bis',
    'update-leaderboard-bis',
    'change-info-event-tris',
    'delete-account-event-tris'
])

// Constants
const logoPath = '/img/logo-primary-filled.svg'


</script>

<template>
  <div class="flex justify-between items-center " style="max-height: 3vh">
    <div class="flex gap-2">
      <UTooltip text="Open on Github">
        <UButton
            :to="`https://github.com/roxannecvl/whokipedia`"
            icon="i-simple-icons-github"
            color="white"
            target="_blank"/>
      </UTooltip>
      <UTooltip :text="`Switch to ${$colorMode.preference == 'light' ? 'dark' : 'light'} Mode`">
        <UButton
            :icon="$colorMode.preference == 'dark' ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'"
            @click="$colorMode.preference = ($colorMode.preference == 'light' ? 'dark' : 'light')"
            color="white"/>
      </UTooltip>
    </div>
    <a href="/">
      <div class="flex">
        <img :src="logoPath" alt="logo" class="w-9 h-9 mx-auto"/>
        <p class="font-black text-3xl hidden sm:block select-none">Whokipedia</p>
      </div>
    </a>
    <div class="flex justify-between items-center gap-2">
      <LeaderboardView
          @update-leaderboard ="emit('update-leaderboard-bis')"
          :games="gamesLV"
          :username="username"
      />
     <UserAccountView
         @change-info-event-bis="(newUsername, newEmail, newPassword, email, password) => {
           emit('change-info-event-tris', newUsername, newEmail, newPassword, email, password)
         }"
         @delete-account-event-bis="(email, password) => {
           emit('delete-account-event-tris', email, password)
         }"
         :currentStreakSV="currentStreakUV"
         :maxStreakSV="maxStreakUV"
         :averageRankSV="averageRankUV"
         :averageGuessesSV="averageGuessesUV"
         :winRateSV="winRateUV"
         :gamesPlayedSV="gamesPlayedUV"
         :timedStatsSV="timedStatsUV"
         :username="username"
     />
      <LoginSignupView
        @login-event-bis="(email, password) => {
          emit('login-event-tris', email, password)
        }"
        @signup-event-bis="(username, email, password) => {
          emit('signup-event-tris', username, email, password)
        }"
        @logout-event="() => {
          emit('logout-event-bis')
        }"
        :close="closeLSV"/>
    </div>
  </div>
</template>
