<script setup lang="ts">

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
  <div class="w-100 h-100 flex flex-col justify-center items-center">
    <h1 class="font-bold text-5xl m-5">Leaderboard</h1>
    <UTable :rows="usersData" :columns="columns" :ui="{ tbody: ''}">
        <template #averageRank-data="{ row }">
            <span class="font-bold text-black dark:text-white" :class="[row.username === displayName && 'text-primary-500 dark:text-primary-400']">{{ row.averageRank }}</span>
        </template>
        <template #username-data="{ row }">
            <span class="text-black dark:text-white">{{ row.username }}</span>
        </template>
        <template #currentStreak-data="{ row }">
            <span class=" text-black dark:text-white">{{ row.currentStreak }}</span>
        </template>
        <template #maxStreak-data="{ row }">
            <span class=" text-black dark:text-white">{{ row.maxStreak }}</span>
        </template>
        <template #averageGuesses-data="{ row }">
            <span class=" text-black dark:text-white">{{ row.averageGuesses }}</span>
        </template>
        <template #averageTime-data="{ row }">
            <span class=" text-black dark:text-white">{{ row.averageTime }}</span>
        </template>
        <template #timesPlayed-data="{ row }">
            <span class=" text-black dark:text-white">{{ row.timesPlayed }}</span>
        </template>
    </UTable>
  </div>

</template>