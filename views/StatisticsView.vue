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
  <UButton @click="populateStats()">Populate stats</UButton>
  <div v-if="user" class="flex flex-col items-center justify-center">
    <p class="font-black text-3xl">Statistics</p>
    <div class="flex justify-around w-full mt-10">
      <div class="flex flex-col items-center">
        <div class="flex justify-center items-center h-24 w-24 rounded-full border-8 text-2xl font-extrabold border-primary">
          {{ currentStreak }}
        </div>
        <p class="mt-3 text-sm text-gray-500">Cur. Streak</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex justify-center items-center h-24 w-24 rounded-full border-8 text-2xl font-extrabold border-primary">
          {{ maxStreak }}
        </div>
        <p class="mt-3 text-sm text-gray-500">Max. Streak</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex justify-center items-center h-24 w-24 rounded-full border-8 text-2xl font-extrabold border-primary">
          {{ averageRank }}
        </div>
        <p class="mt-3 text-sm text-gray-500">Avg. Rank</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex justify-center items-center h-24 w-24 rounded-full border-8 text-2xl font-extrabold border-primary">
          {{ averageGuesses }}
        </div>
        <p class="mt-3 text-sm text-gray-500">Avg. Guesses</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex justify-center items-center h-24 w-24 rounded-full border-8 text-2xl font-extrabold border-primary">
          {{ averageTime }}
        </div>
        <p class="mt-3 text-sm text-gray-500">Avg.Time</p>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex justify-center items-center h-24 w-24 rounded-full border-8 text-2xl font-extrabold border-primary">
          {{ gamesPlayed }}
        </div>
        <p class="mt-3 text-sm text-gray-500">Games Played</p>
      </div>
    </div>
    <div class="flex justify-center items-end w-full mt-10">
      <div class="w-1/2 flex flex-col items-center">
        <Line :data="guessesData" :options="guessesOptions" />
        <p class="mt-3 text-sm text-gray-500">{{ guessesTitle }}</p>
      </div>
      <div class="w-1/2 flex flex-col items-center">
        <Bar :data="ranksData" :options="ranksOptions" />
        <p class="mt-3 text-sm text-gray-500">{{ ranksTitle }}</p>
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
  data() {
    return {
      guessesTitle: 'Number of guesses',
      ranksTitle: 'Daily rank',
      mainColor: 'rgba(245,158,12,255)'
    }
  },
  computed: {
    legendColor(): string {
      return this.$colorMode.value === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
    },
    guessesData(): ChartData<"line", (number | Point | null)[]> {
      return {
        labels: this.$props.timedStats.map((stat: TimedStat) => stat.date),
        datasets: [
          {
            label: 'Number of guesses',
            data: this.$props.timedStats.map((stat: TimedStat) => stat.guesses),
            borderColor: this.mainColor,
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
              color: this.legendColor
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
              color: this.legendColor
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
            borderRadius: 100,
            borderSkipped: false,
            backgroundColor: this.mainColor,
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
              color: this.legendColor
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
              color: this.legendColor
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
