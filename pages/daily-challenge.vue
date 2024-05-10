<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel"
import { type UserStore, useUserStore } from "~/model/UserModel"
import { celebrities } from "~/model/CelebrityList"
import { dailyRandom } from "~/utilities/Utils"
import GamePresenter from "~/presenters/GamePresenter.vue"
import SidebarPresenter from "~/presenters/SidebarPresenter.vue"
import PlayAgainPresenter from "~/presenters/PlayAgainPresenter.vue"

// Page meta
definePageMeta({
  middleware: "auth"
})

// Models
const userModel: UserStore = useUserStore()
const gameModel: GameStore = useGameStore()

// Refs
const elapsedTime = ref(0)

// Computed
let timerInterval: NodeJS.Timeout | null = null

// Functions

/**
 * Method to start the timer, it will increment the elapsed time every second.
 */
function startInterval(){
  timerInterval = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

/**
 * Method to stop the timer when game is over and returning elapsed time.
 * @param over - boolean to check if game is over
 * @return number - elapsed time
 */
function checkStopInterval(over : boolean){
  if (gameModel.time > elapsedTime.value) elapsedTime.value = gameModel.time
  if (over && timerInterval !== null) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  return elapsedTime.value
}

/**
 * This method inits a new game, and ensures time is updated to match game
 * model stats, if the game was already started.
 */
async function initGame(): Promise<void> {
  if (gameModel.time > elapsedTime.value) elapsedTime.value = gameModel.time
  const dailyRdm: number = await dailyRandom(0, celebrities.length - 1)
  await gameModel.init(celebrities[dailyRdm], true)
}

await initGame()

// Lifecycle hooks
onMounted(() => {
   startInterval()
})

</script>

<template>
  <div v-if="userModel.username === '' || gameModel.loading" class="w-full flex justify-center items-center">
    <UIcon name="i-eos-icons-loading"/>
  </div>
  <div v-else class="h-full">
    <!-- FOR BIG SCREENS-->
    <div class="h-full hidden lg:flex">
      <div class="w-1/6 p-2 max-h-[75vh] overflow-y-auto">
        <SidebarPresenter :timeSec="checkStopInterval(gameModel.end)" :showRules="true"/>
      </div>
      <div class="h-full flex flex-col w-5/6 p-2">
        <PlayAgainPresenter :dailyChallenge="true"/>
        <GamePresenter :dailyChallenge="true" size="big" class="overflow-y-auto"/>
      </div>
    </div>

    <!-- FOR SMALL SCREENS-->
    <div class="h-full flex flex-col gap-3 lg:hidden">
      <PlayAgainPresenter :dailyChallenge="true"/>
      <div class="w-full px-3">
        <SidebarPresenter :timeSec="checkStopInterval(gameModel.end)"  :showRules="false"/>
      </div>
      <div class="h-full overflow-y-auto">
        <GamePresenter :dailyChallenge="true" size="small"/>
      </div>
    </div>
  </div>
</template>