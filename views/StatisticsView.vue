<script setup lang="ts">

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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

const barData = {
  labels: [ 'January', 'February', 'March' ],
  datasets: [ { data: [40, 20, 12] } ]
}

const barOptions = {
  responsive: true
}

// Functions
function populateStats(){
  emit('populate-stats')
}

</script>

<template>
    <Bar :data="barData" :options="barOptions"></Bar>
</template>
