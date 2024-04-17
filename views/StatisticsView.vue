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
    <p class="font-black text-3xl">Statistics</p>
    <UButton @click="populateStats()">Populate stats</UButton>
    <div class="flex justify-center items-end w-full">
      <div class="w-1/2">
        <Line height="300" width="0" :data="guessesData" :options="guessesOptions" />
      </div>
      <div class="w-1/2">
        <Bar :data="ranksData" :options="ranksOptions" />
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center">
    <p>User not logged in</p>
  </div>
</template>

<script lang="ts">
// Script to handle chart logic
import { Line, Bar } from 'vue-chartjs'
import {Chart as ChartJS, type ChartData, type ChartOptions, type Point, registerables} from 'chart.js'
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
            tension: 0.3,
          }
        ]
      }
    },
    guessesOptions(): ChartOptions<"line"> {
      return {
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false
            },
            offset: true,
            ticks: {
              color: this.$colorMode.value === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
            border: {
              display: false
            },
            ticks: {
              color: this.$colorMode.value === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
            }
          },
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            usePointStyle: true,
            displayColors: false,
            callbacks: {
              label: (tooltipItem): string | void | string[] => {
                return tooltipItem.dataset.data[tooltipItem.dataIndex]?.toString();
              }
            }
          },
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
            barPercentage: 0.3,
          }
        ]
      }
    },
    ranksOptions(): ChartOptions<"bar"> {
      return {
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false
            },
            ticks: {
              color: this.$colorMode.value === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
            border: {
              display: false
            },
            ticks: {
              color: this.$colorMode.value === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
            }
          },
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            usePointStyle: true,
            displayColors: false,
            callbacks: {
              label: (tooltipItem): string | void | string[] => {
                return tooltipItem.dataset.data[tooltipItem.dataIndex]?.toString();
              }
            }
          },
        },
      }
    },
  },
}

</script>
