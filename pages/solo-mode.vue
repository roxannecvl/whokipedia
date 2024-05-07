<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel"
import { celebrities } from "~/model/CelebrityList"
import { dailyRandom, getRandomNumber } from "~/utilities/Utils"
import GamePresenter from "~/presenters/GamePresenter.vue"
import SidebarPresenter from "~/presenters/SidebarPresenter.vue"
import PlayAgainPresenter from "~/presenters/PlayAgainPresenter.vue"

// Models
const gameModel: GameStore = useGameStore()

// Refs
const elapsedTime = ref(0)

// Computed
let timerInterval: NodeJS.Timeout | null = null

// Functions
function startInterval(){
  timerInterval = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

function checkStopInterval(over : boolean){
  if(over && timerInterval !== null){
    clearInterval(timerInterval)
    timerInterval = null
  }
  return elapsedTime.value;
}

// Lifecycle hooks
onMounted(() => {
  startInterval()
});

// Initialize game - ensure celebrity is different from daily challenge
let randomIndex = getRandomNumber(0, celebrities.length - 2)
let dailyRdm = await dailyRandom(0, celebrities.length - 1)
if (randomIndex >= dailyRdm) randomIndex +=1
await gameModel.init(celebrities[randomIndex])
</script>

<template>
  <div v-if="gameModel.loading" class="w-full flex justify-center items-center">
    <UIcon name="i-eos-icons-loading"/>
  </div>
  <div v-else class="h-full">
    <!-- FOR BIG SCREENS-->
    <div class="h-full hidden lg:flex">
      <div class="w-1/6 p-2 max-h-[75vh] overflow-hidden">
        <SidebarPresenter :timeSec="checkStopInterval(gameModel.end)" :showRules="true"/>
      </div>
      <div class="h-full flex flex-col w-5/6 p-2">
        <PlayAgainPresenter :dailyChallenge="false"/>
        <GamePresenter :dailyChallenge="false" class="overflow-y-auto" size="big"/>
      </div>
    </div>

    <!-- FOR SMALL SCREENS-->
    <div class="h-full flex flex-col gap-3 lg:hidden">
      <PlayAgainPresenter :daily-challenge="false"/>
      <div class="w-full px-3">
        <SidebarPresenter :timeSec="checkStopInterval(gameModel.end)" :showRules="false"/>
      </div>
      <div class="h-full overflow-y-auto">
        <GamePresenter :dailyChallenge="false" size="small"/>
      </div>
    </div>
  </div>
</template>