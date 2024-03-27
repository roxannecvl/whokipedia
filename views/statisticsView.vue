<script
    lang="ts">
import { UserModel } from "~/model/UserModel";
import { reactive } from "vue";

import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend)

export default {
  props: {
    userModel: {
      type: UserModel,
      required: false,
    }
  },
  components: {
    Line
  },
  
  // Change this !!! Need to add reactive in presenter
  setup(props) {
    if (!props.userModel) {
      return
    }
    const userModel = reactive(props.userModel);
    return {
      userModel
    }
  }
}
</script>

<template>
  <div v-if="userModel" class="flex flex-col items-center justify-center">
    <div>
      <p>{{ 'User name: ' + userModel.username }}</p>
      <p>{{ 'Current streak: ' + userModel.currentStreak }}</p>
      <p>{{ 'Max streak: ' + userModel.maxStreak }}</p>
      <p>{{ 'Average rank: ' + userModel.averageRank }}</p>
      <p>{{ 'Average guesses: ' + userModel.averageGuesses }}</p>
      <p>{{ 'Average time: ' + userModel.averageTime }}</p>
      <p>{{ 'Times played: ' + userModel.timesPlayed }}</p>
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
        labels: Array.from(Array(userModel.times.length).keys()),
        datasets: [ { label: 'Times', data: userModel.times, backgroundColor: 'blue', borderColor: 'blue' },
        { label: 'Ranks', data: userModel.ranks, backgroundColor: 'green', borderColor: 'green' },
        { label: 'Guesses', data: userModel.guesses, backgroundColor: 'red', borderColor: 'red' } ]
      }"
    />
  </div>
  <div v-else class="flex flex-col items-center justify-center">
    <p>User not logged in</p>
  </div>
</template>