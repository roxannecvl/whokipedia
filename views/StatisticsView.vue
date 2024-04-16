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

    <Line :data="guessesData" :options="guessesOptions" />
    <Bar :data="ranksData" :options="ranksOptions" />
  </div>

  <div v-else class="flex flex-col items-center justify-center">
    <p>User not logged in</p>
  </div>
</template>

<script lang="ts">
// Script to handle chart logic
import { Line, Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, type ChartData, type Point, registerables } from 'chart.js'
import type { TimedStat } from "~/model/UserModel";

ChartJS.register(...registerables)
ChartJS.register(ChartDataLabels)

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
            tension: 0.3
          }
        ]
      }
    },
    guessesOptions() {
      return {
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
            border: {
              display: false
            }
          },
        },
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            display: false,
          }
        },
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
            borderRadius: 100,
            borderSkipped: false,
            backgroundColor: 'rgba(245,158,12,255)',
            barPercentage: 0.2,
            categoryPercentage: 1,
          }
        ]
      }
    },
    ranksOptions() {
      return {
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false
            },
          },
          y: {
            display: false,
          },
        },
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            color: '#000',
            anchor: 'end',
            align: 'top',
            offset: 10,
            font: {
              weight: 'bold'
            },
          }
        },
      }
    },
  },

};
</script>
