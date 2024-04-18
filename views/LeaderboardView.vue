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
  label: 'Average rank',
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
  key: 'winRate',
  label: 'Win rate'
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
            <span class={{textColor}}>{{ row.averageRank }}</span>
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
        <template #winRate-data="{ row }">
            <span class={{textColor}}>{{ row.winRate }}</span>
        </template>
        <template #timesPlayed-data="{ row }">
            <span class={{textColor}}>{{ row.timesPlayed }}</span>
        </template>
    </UTable>
  </div>

</template>