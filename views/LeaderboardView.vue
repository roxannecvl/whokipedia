<script setup lang="ts">

import type { LeaderboardData } from "~/presenters/HeaderPresenter.vue"

// Props
const props = defineProps({
    games : {
      type: Array<LeaderboardData>,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
})


// Emits
const emit = defineEmits(['update-leaderboard'])

// Refs
const isLeaderboardOpen = ref(false)

// Computed
const styledGames = computed(()=> {
  if (user) {
    return props.games.map((game) => {
      if (game.username === props.username) game.class = 'bg-primary-500/25'
      return game
    })
  }
  return props.games
})

// Constants
const user = useCurrentUser()
const columns = [{
  key: 'rank',
  label: 'Rank',
  sortable: true
}, {
  key: 'username',
  label: 'Username',
}, {
  key: 'streak',
  label: 'Streak',
  sortable: true
}, {
  key: 'guesses',
  label: 'Guesses',
}, {
  key: 'time',
  label: 'Time',
}, {
  key: 'averageRank',
  label: 'Average Rank',
  sortable: true
}]

</script>

<template>
  <UButton icon="i-heroicons-trophy-16-solid" @click="() => { isLeaderboardOpen = true; emit('update-leaderboard') }">
    <span class="hidden md:inline">Leaderboard</span>
  </UButton>
  <UModal v-model="isLeaderboardOpen" :ui="{
    width: 'w-full sm:max-w-full sm:w-5/6',
  }">
    <UCard :ui="{ ring: '' }">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex flex-row gap-2">
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Leaderboard</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path-20-solid" @click="emit('update-leaderboard')"/>
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isLeaderboardOpen = false" />
        </div>
      </template>
      <div>
        <UTable :columns="columns" :rows="styledGames" :ui="{
          wrapper: 'max-h-96 overflow-auto rounded-lg',
          thead: 'sticky top-0 z-10 bg-gray-50 dark:bg-gray-950',
        }" >
          <template #streak-data="{ row }">
            <span class="align-baseline"> {{ row.streak + " "}} </span>
            <span v-if="row.streak <= 1" class="i-heroicons-fire-16-solid text-xl align-middle bg-[#FFC11F]"/>
            <span v-else-if="row.streak <= 3" class="i-heroicons-fire-16-solid text-xl align-middle bg-[#FF9316]"/>
            <span v-else-if="row.streak <= 7" class="i-heroicons-fire-16-solid text-xl align-middle bg-[#FE650D]"/>
            <span v-else-if="row.streak <= 14" class="i-heroicons-fire-16-solid text-xl align-middle bg-[#F33C04]"/>
            <span v-else-if="row.streak <= 30" class="i-heroicons-fire-16-solid text-xl align-middle bg-[#DA1F05]"/>
            <span v-else class="i-heroicons-fire-16-solid text-xl align-middle bg-[#A10100]"/>
          </template>
        </UTable>
      </div>
    </UCard>
  </UModal>
</template>

