<script setup lang="ts">

// Props
const props = defineProps( {
    usersData : {
      type: Array<Object>,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    }
})

// Refs
const isLeaderboardOpen = ref(false)

// Constants
const user = useCurrentUser()
const mode = useColorMode();
const textColor = computed(() => mode.value === 'dark' ? 'text-white' : 'text-black');
const columns = [{
  key: 'averageRank',
  label: '#',
}, {
  key: 'username',
  label: 'Username'
}, {
  key: 'currentStreak',
  label: 'Current streak'
}, {
  key: 'maxStreak',
  label: 'Max streak'
}, {
  key: 'averageGuesses',
  label: 'Average guesses'
}, {
  key: 'averageTime',
  label: 'Average time'
}, {
  key: 'timesPlayed',
  label: 'Times played'
}]
</script>

<template>
  <UButton label="Leaderboard" @click="isLeaderboardOpen = true" :disabled="!user"/>
  <UModal v-model="isLeaderboardOpen" :ui="{
    width: 'w-full sm:max-w-full sm:w-5/6'
  }">
    <UCard :ui="{ ring: '' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Leaderboard</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isLeaderboardOpen = false" />
        </div>
      </template>
      <div class="flex flex-col items-center">
        <UTable :rows="usersData" :columns="columns" :ui="{ tbody: ''}">
            <template #averageRank-data="{ row }">
                <span :class="[row.username === displayName && 'text-primary-500 dark:text-primary-400', textColor, 'font-bold']">
                  {{ row.averageRank }}
                </span>
            </template>
            <template #username-data="{ row }">
                <span class={{textColor}}>{{ row.username }}</span>
            </template>
            <template #currentStreak-data="{ row }">
                <span class={{textColor}}>{{ row.currentStreak }}</span>
            </template>
            <template #maxStreak-data="{ row }">
                <span class={{textColor}}>{{ row.maxStreak }}</span>
            </template>
            <template #averageGuesses-data="{ row }">
                <span class={{textColor}}>{{ row.averageGuesses }}</span>
            </template>
            <template #averageTime-data="{ row }">
                <span class={{textColor}}>{{ row.averageTime }}</span>
            </template>
            <template #timesPlayed-data="{ row }">
                <span class={{textColor}}>{{ row.timesPlayed }}</span>
            </template>
        </UTable>
      </div>
    </UCard>
  </UModal>
</template>