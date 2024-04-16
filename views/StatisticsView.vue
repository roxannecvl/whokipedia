<script setup lang="ts">

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
  gamesPlayed: {
    type: Number,
    required: true
  },
  timedStats: {
    type: Array<TimedStat>,
    required: true
  },
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
    <UButton @click="populateStats()">Populate stats</UButton>

    <div class="flex-row">
      <Line :data="guessesData" :options="chartOptions" />
      <Bar :data="ranksData" :options="chartOptions" />
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center">
    <p>User not logged in</p>
  </div>
</template>

<script lang="ts">
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, type ChartData, type Point, registerables } from 'chart.js'
import type { TimedStat } from "~/model/UserModel";

ChartJS.register(...registerables)

export default {
  components: { Line, Bar },
  computed: {
    guessesData(): ChartData<"line", (number | Point | null)[]> {
      return {
        labels: this.$props.timedStats.map((stat: TimedStat) => stat.date),
        datasets: [
          {
            label: 'Number of guesses',
            data: this.$props.timedStats.map((stat: TimedStat) => stat.guesses),
            borderColor: 'rgba(245,158,12,255)',
            borderWidth: 5,
            fill: false,
            tension: 0.5
          }
        ]
      }
    },
    ranksData(): ChartData<"bar", (number | [number, number] | null)[]> {
      return {
        labels: this.$props.timedStats.map((stat: TimedStat) => stat.date),
        datasets: [
          {
            label: 'Ranks',
            data: this.$props.timedStats.map((stat: TimedStat) => stat.rank),
            borderColor: 'rgba(245,158,12,255)',
            borderWidth: 0,
            borderRadius: 100,
            backgroundColor: 'rgba(245,158,12,255)'
          }
        ]
      }
    },
    chartOptions() {
      return {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }
    },
  }

};
</script>
