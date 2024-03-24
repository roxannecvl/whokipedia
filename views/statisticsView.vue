<script
    lang="ts">
import { UserModel } from "~/model/UserModel";
import { reactive } from "vue";



export default {
  props: {
    userModel: {
      type: UserModel,
      required: false,
    }
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
  <UCard v-if="userModel" class="flex flex-col items-center justify-center">
    Test view
    <p>{{ 'User id: ' + userModel.userUid }}</p>
    <p>{{ 'Current streak: ' + userModel.currentStreak }}</p>
    <p>{{ 'Max streak: ' + userModel.maxStreak }}</p>
    <p>{{ 'Average rank: ' + userModel.averageRank }}</p>
    <p>{{ 'Ranks: ' + userModel.ranks }}</p>
    <p>{{ 'Average guesses: ' + userModel.averageGuesses }}</p>
    <p>{{ 'Guesses: ' + userModel.guesses }}</p>
    <p>{{ 'Average time: ' + userModel.averageTime }}</p>
    <p>{{ 'Times: ' + userModel.times }}</p>
    <p>{{ 'Times played: ' + userModel.timesPlayed }}</p>
  </UCard>
  <UCard v-else class="flex flex-col items-center justify-center">
    <p>User not logged in</p>
  </UCard>
</template>