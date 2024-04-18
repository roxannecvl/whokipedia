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
  <div class="w-100 h-100 flex flex-col justify-center items-center">
    <h1 class="font-bold text-5xl m-5">Leaderboard</h1>
    <UTable :rows="usersData" :columns="columns" :ui="{ tbody: ''}">
        <template #averageRank-data="{ row }">
            <span :class="[row.username === displayName && 'text-primary-500 dark:text-primary-400', textColor, 'font-bold']">{{ row.averageRank }}</span>
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

</template>