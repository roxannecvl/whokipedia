<script setup lang="ts">

// Props
const props = defineProps({
    games : {
      type: Array<Object>,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
})

// Refs
const isLeaderboardOpen = ref(false)

// Constants
const user = useCurrentUser()
const columns = [{
  key: 'rank',
  label: 'Rank',
  sortable: true
}, {
  key: 'username',
  label: 'Username'
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
  <UButton label="Leaderboard" @click="isLeaderboardOpen = true" :disabled="!user"/>
  <UModal v-model="isLeaderboardOpen" :ui="{
    width: 'w-full sm:max-w-full sm:w-5/6',
  }">
    <UCard :ui="{ ring: '' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Leaderboard</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isLeaderboardOpen = false" />
        </div>
      </template>
      <div>
        <UTable :columns="columns" :rows="games" :ui="{
          wrapper: 'max-h-96 overflow-auto rounded-lg',
          thead: 'sticky top-0 z-10 bg-gray-50 dark:bg-gray-950',
        }" />
      </div>
    </UCard>
  </UModal>
</template>
