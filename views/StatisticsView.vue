<script setup lang="ts">

import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  type ChartData, type Point
} from 'chart.js'
import type { TimedStat } from "~/model/UserModel";

ChartJS.register(Title, Tooltip, Legend, BarElement, PointElement, LineElement, CategoryScale, LinearScale)

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
  ranks: {
    type: Array<TimedStat>,
    required: true
  },
  averageGuesses: {
    type: Number,
    required: true
  },
  guesses: {
    type: Array<TimedStat>,
    required: true
  },
  averageTime: {
    type: Number,
    required: true
  },
  times: {
    type: Array<TimedStat>,
    required: true
  },
  gamesPlayed: {
    type: Number,
    required: true
  },
})

// Emits
const emit = defineEmits(['populate-stats'])

// Constants
const guessesData : ChartData<'line', (number | Point | null)[]> = {
  labels: ['January', 'February', 'March'],
  datasets: [ { data: [10, 30, 40] } ]
}

const guessesOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    }
    }
}

const ranksData : ChartData <'bar', number[]> = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [{
    label: '# of Votes',
    data: [12, 19, 3, 5, 2, 3],
    borderWidth: 1
  }]
}

const ranksOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    }
  }
}

// Functions
function populateStats(){
  emit('populate-stats')
}

</script>

<template>
  <div class="text-3xl font-bold text-center">Statistics</div>

  <div class="flex-col">
    <Line :data="guessesData" :options="guessesOptions"></Line>
    <Bar :data="ranksData" :options="ranksOptions"></Bar>
  </div>

  <UButton @click="populateStats()">Populate stats</UButton>
</template>
