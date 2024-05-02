<script setup lang="ts">

import type { TimedStat } from "~/model/UserModel"
import StatisticsView from "~/views/StatisticsView.vue"
import UserManagementView from "~/views/UserManagementView.vue"

// Props
defineProps({
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
    type: String,
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
  username: {
    type: String,
    required: true
  },
})

// Emits
const emit = defineEmits(['change-info-event-bis', 'delete-account-event-bis'])

// Refs
const isModalOpen = ref(false)

// Constants
const user = useCurrentUser()

</script>

<template>
  <UButton icon="i-heroicons-user-circle-16-solid" @click="isModalOpen = true" :disabled="!user">
    <span class="hidden md:inline">Account</span>
  </UButton>
  <UModal v-model="isModalOpen" :ui="{
    width: 'w-full sm:max-w-full sm:w-5/6',
    height: '80vh'
  }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Welcome, <span class="text-primary">{{ username }}</span>.</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isModalOpen = false" />
        </div>
      </template>

      <div class="flex">
        <div class="w-full ">
          <UTabs :items="[{ key: 'stats', label: 'Statistics' },  { key: 'account', label: 'Settings' }]">
            <template #item="{ item }">
              <div v-if="item.key === 'stats'" class="pt-4">
                <StatisticsView
                    :currentStreak="currentStreakSV"
                    :maxStreak="maxStreakSV"
                    :averageGuesses="averageGuessesSV"
                    :averageRank="averageRankSV"
                    :winRate="winRateSV"
                    :gamesPlayed="gamesPlayedSV"
                    :timedStats="timedStatsSV"
                />
              </div>
              <div v-else-if="item.key === 'account'" class="pt-4">
                <UserManagementView
                    :username="username"
                    @change-info-event="(username, email, password, oldPassword) => emit('change-info-event-bis', username, email, password, oldPassword)"
                    @delete-account-event="() => emit('delete-account-event-bis')"/>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </UCard>
  </UModal>

</template>
