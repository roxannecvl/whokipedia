<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel"
import { celebrities, pres_celebrities } from "~/model/CelebrityList"
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

/**
 * Method to start the timer, it will increment the elapsed time every second.
 */
function startInterval(): void {
  timerInterval = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

/**
 * Method to stop the timer when game is over and returning elapsed time.
 * @param over - boolean to check if game is over
 * @return number - elapsed time
 */
function checkStopInterval(over : boolean): number {
  if(over && timerInterval !== null){
    clearInterval(timerInterval)
    timerInterval = null
  }
  return elapsedTime.value;
}

/*
 * Method to initialize the game, ensuring the celebrity is different from the daily challenge.
 * This method must be called on client only to ensure randomness won't cause hydration mismatches due to SSR.
 */
async function initGame(): Promise<void> {
  let randomIndex = getRandomNumber(0, pres_celebrities.length - 2)
  let dailyRdm = await dailyRandom(0, pres_celebrities.length - 1)
  if (randomIndex >= dailyRdm) randomIndex +=1
  await gameModel.init(pres_celebrities[randomIndex])
  elapsedTime.value = 0
  startInterval()
}

gameModel.loading = true
onMounted(async () => {
  await initGame()
})

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
        <PlayAgainPresenter @new-game-bis="async () => await initGame()" :dailyChallenge="false"/>
        <GamePresenter :dailyChallenge="false" cass="overflow-y-auto" size="big"/>
      </div>
    </div>

    <!-- FOR SMALL SCREENS-->
    <div class="h-full flex flex-col gap-3 lg:hidden">
      <PlayAgainPresenter @new-game-bis="async () => await initGame()" :daily-challenge="false"/>
      <div class="w-full px-3">
        <SidebarPresenter :timeSec="checkStopInterval(gameModel.end)" :showRules="false"/>
      </div>
      <div class="h-full overflow-y-auto">
        <GamePresenter :dailyChallenge="false" size="small"/>
      </div>
    </div>
  </div>
</template>