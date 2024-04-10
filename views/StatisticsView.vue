<script setup lang="ts">

import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

// Props
const props = defineProps({
  currentStreak: {
    type: Number,
    required: true
  },
  maxStreak: {
    type: Number,
    required: true
  },
  averageRank: {
    type: Number,
    required: true
  },
  averageGuesses: {
    type: Number,
    required: true
  },
  averageTime: {
    type: Number,
    required: true
  },
  timesPlayed: {
    type: Number,
    required: true
  },
  times: {
    type: Array<Number>,
    required: true
  },
  ranks: {
    type: Array<Number>,
    required: true
  },
  guesses: {
    type: Array<Number>,
    required: true
  }
})

// Emits
const emit = defineEmits(['populate-stats'])

// Constants
const user = useCurrentUser()

// Functions
function populateStats(){
  emit('populate-stats')
}

</script>

<template>
  <div v-if="user" class="flex flex-col items-center justify-center">
    <div>
      <p>{{ 'User name: ' + user.email }}</p>
      <p>{{ 'Current streak: ' + currentStreak }}</p>
      <p>{{ 'Max streak: ' + maxStreak }}</p>
      <p>{{ 'Average rank: ' + averageRank }}</p>
      <p>{{ 'Average guesses: ' + averageGuesses }}</p>
      <p>{{ 'Average time: ' + averageTime }}</p>
      <p>{{ 'Times played: ' + timesPlayed }}</p>
    </div>
    <Line
        id="my-chart-id"
        :options="{
          responsive: true,
          scales: {
            x: { grid: {color: 'grey'} },
            y: { grid: {color: 'grey'} }
          }
        }"
        :data="{
          labels: Array.from(Array(times.length).keys()),
          datasets: [ { label: 'Times', data: times, backgroundColor: 'blue', borderColor: 'blue' },
          { label: 'Ranks', data: ranks, backgroundColor: 'green', borderColor: 'green' },
          { label: 'Guesses', data: guesses, backgroundColor: 'red', borderColor: 'red' } ]
        }"
    />
  </div>
  <div v-else class="flex flex-col items-center justify-center">
    <p>User not logged in</p>
  </div>
  <div v-if="user" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
    <UButton @click="populateStats()">Populate stats</UButton>
  </div>
</template>