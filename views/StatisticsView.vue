<script setup lang="ts">

import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js'
import type { UserStore } from "~/model/UserModel";

ChartJS.register(CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend)

const user = useCurrentUser()

defineProps({
  model: {
    type: Object as () => UserStore,
    required: true,
  }
})

</script>

<template>
  <div v-if="user" class="flex flex-col items-center justify-center">
    <div>
      <p>{{ 'User name: ' + user.email }}</p>
      <p>{{ 'Current streak: ' + model.currentStreak }}</p>
      <p>{{ 'Max streak: ' + model.maxStreak }}</p>
      <p>{{ 'Average rank: ' + model.averageRank }}</p>
      <p>{{ 'Average guesses: ' + model.averageGuesses }}</p>
      <p>{{ 'Average time: ' + model.averageTime }}</p>
      <p>{{ 'Times played: ' + model.timesPlayed }}</p>
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
          labels: Array.from(Array(model.times.length).keys()),
          datasets: [ { label: 'Times', data: model.times, backgroundColor: 'blue', borderColor: 'blue' },
          { label: 'Ranks', data: model.ranks, backgroundColor: 'green', borderColor: 'green' },
          { label: 'Guesses', data: model.guesses, backgroundColor: 'red', borderColor: 'red' } ]
        }"
    />
  </div>
  <div v-else class="flex flex-col items-center justify-center">
    <p>User not logged in</p>
  </div>
</template>