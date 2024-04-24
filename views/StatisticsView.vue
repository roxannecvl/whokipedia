<script setup lang="ts">

import type { TimedStat } from "~/model/UserModel"
import { getColor } from "~/utilities/Utils";

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
  winRate: {
    type: String,
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

// Refs
const isStatOpen = ref(false)

// Constants
const user = useCurrentUser()
const currentStreakColor = computed(() => getColor(props.currentStreak))
const maxStreakColor = computed(() => getColor(props.maxStreak))

// Function


</script>

<template>
  <UButton icon="i-heroicons-presentation-chart-line-16-solid" @click="isStatOpen = true" :disabled="!user">
    <span class="hidden md:inline">Statistics</span>
  </UButton>
  <UModal v-model="isStatOpen" :ui="{
    width: 'w-full sm:max-w-full sm:w-5/6',
  }">
    <UCard :ui="{ ring: '' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Statistics</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isStatOpen = false" />
        </div>
      </template>
        <div style="max-height: 80vh; overflow-y: auto">
          <div class="flex flex-col md:flex-row justify-around mt-3">
            <div class="flex justify-around w-full md:w-1/2 mb-5 md:mb-0">
              <div class="flex flex-col items-center">
                <div class="flex justify-center items-center h-24 w-24 rounded-full border-primary border-8 text-2xl font-extrabold">
                  {{ averageGuesses }}
                </div>
                <p class="mt-3 text-sm text-gray-500">Avg. Guesses</p>
              </div>
              <div class="flex flex-col items-center">
                <div class="flex justify-center items-center h-24 w-24 rounded-full border-primary border-8 text-2xl font-extrabold">
                  {{ averageRank }}
                </div>
                <p class="mt-3 text-sm text-gray-500">Avg. Rank</p>
              </div>
              <div class="flex flex-col items-center">
                <div class="flex justify-center items-center h-24 w-24 rounded-full border-primary border-8 text-2xl font-extrabold">
                  {{ winRate  }}
                </div>
                <p class="mt-3 text-sm text-gray-500">Win Rate</p>
              </div>
            </div>
            <div class="flex justify-around w-full md:w-1/2">
              <div class="flex flex-col items-center">
                <div class="flex justify-center items-center h-24 w-24 rounded-full border-primary border-8 text-2xl font-extrabold">
                  {{ gamesPlayed}}
                </div>
                <p class="mt-3 text-sm text-gray-500">Games Played</p>
              </div>
              <div class="flex flex-col items-center">
                <div class="flex justify-center items-center h-24 w-24 rounded-full border-primary border-8 text-2xl font-extrabold">
                  {{ currentStreak + " " }}
                  <span :class="'i-heroicons-fire-16-solid text-3xl align-middle bg-[' + currentStreakColor +']'"/>
                </div>
                <p class="mt-3 text-sm text-gray-500">Cur. Streak</p>
              </div>
              <div class="flex flex-col items-center">
                <div class="flex justify-center items-center h-24 w-24 rounded-full border-primary border-8 text-2xl font-extrabold">
                  {{ maxStreak + " "}}
                  <span :class="'i-heroicons-fire-16-solid text-3xl align-middle bg-[' + maxStreakColor +']'"/>
                </div>
                <p class="mt-3 text-sm text-gray-500">Max. Streak</p>
              </div>
            </div>
          </div>
        <div class="flex flex-col md:flex-row justify-between items-center md:items-end w-full mt-10">
          <div class="flex flex-col items-center w-full md:w-1/2 mb-5 md:mb-0">
            <Line :data="guessesData" :options="guessesOptions" />
            <p class="mt-3 text-sm text-gray-500">{{ guessesTitle }}</p>
          </div>
          <div class="flex flex-col items-center w-full md:w-1/2">
            <Bar :data="ranksData" :options="ranksOptions" />
            <p class="mt-3 text-sm text-gray-500">{{ ranksTitle }}</p>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>


<script lang="ts">
// Script to handle chart logic
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, type ChartData, type ChartOptions, type Point, registerables } from 'chart.js'

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
        labels: this.$props.timedStats.map((stat: TimedStat) => {
          const date: Date = new Date(stat.date)
          return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        }),
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
                return tooltipItem.dataset.data[tooltipItem.dataIndex]?.toString()
              }
            }
          },
        },
      }
    },
    ranksData(): ChartData<"bar", (number | [number, number] | null)[]> {
      return {
        labels: this.$props.timedStats.map((stat: TimedStat) => {
          const date: Date = new Date(stat.date)
          return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        }),
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
                return tooltipItem.dataset.data[tooltipItem.dataIndex]?.toString()
              }
            }
          },
        },
      }
    },
  },
}
</script>
