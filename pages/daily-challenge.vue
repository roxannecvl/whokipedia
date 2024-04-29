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
const isRulesOpen = ref(false)
const curUsername = ref("")

// Computed
let timerInterval: NodeJS.Timeout | null = null

// Functions
function startInterval(){
  timerInterval = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

function checkStopInterval(over : boolean, name : string){
  if (gameModel.time > elapsedTime.value) elapsedTime.value = gameModel.time
  if (name !== curUsername.value && timerInterval !== null) {
    curUsername.value = name
    clearInterval(timerInterval)
    timerInterval = null
  }
  if (over && timerInterval !== null) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  return elapsedTime.value
}

// Lifecycle hooks
onMounted(async () => {
  if(timerInterval === null) startInterval()
})

// Initialize game
const dailyRdm: number = await dailyRandom(0, celebrities.length - 1)
await gameModel.init(celebrities[dailyRdm], true)

// Handle consistency upon reconnection
curUsername.value = userModel.username
if (gameModel.time > elapsedTime.value) elapsedTime.value = gameModel.time

</script>

<template>
  <div v-if="userModel.username != ''">
    <div v-if="gameModel.loading" class="w-full flex justify-center items-center">
      <UIcon name="i-eos-icons-loading"/>
    </div>
    <div v-else class="h-full">
      <!-- FOR BIG SCREENS-->
      <div class="h-full hidden lg:flex">
        <div class="w-1/6 p-2 max-h-[75vh] overflow-y-auto">
          <SidebarPresenter :gameModel="gameModel" :timeSec="checkStopInterval(gameModel.end, userModel.username)" :showTime="true" :showRules="true"/>
        </div>
        <div class="h-full flex flex-col w-5/6 p-2">
          <PlayAgainPresenter :dailyChallenge="true" :gameModel="gameModel" :userModel="userModel"/>
          <GamePresenter :userModel="userModel" :gameModel="gameModel" :dailyChallenge="true" size="big" class="overflow-y-auto"/>
        </div>
      </div>

      <!-- FOR SMALL SCREENS-->
      <div class="h-full flex flex-col gap-3 lg:hidden">
        <PlayAgainPresenter :daily-challenge="true" :gameModel="gameModel" :userModel="userModel"/>
        <div class="flex justify-between gap-2 items-center px-2.5 sm:pl-1">
          <div>
            <UButton icon="i-material-symbols-help-rounded" variant="outline" size="md" class="h-full" @click="isRulesOpen = true">
              <span class="hidden md:inline">Rules</span>
            </UButton>
          </div>
          <div class="flex-grow">
            <SidebarPresenter :gameModel="gameModel" :timeSec="checkStopInterval(gameModel.end, userModel.username)" :showTime="true" :showRules="false"/>
          </div>
        </div>
        <USlideover v-model="isRulesOpen" title="Rules">
          <UCard :ui="{ body: { base: 'flex-1' }, ring: '', shadow: '', rounded: ''}">
            <div class="flex items-center justify-end">
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isRulesOpen = false" />
            </div>
            <div class="p-5 w-full box-border">
              <SidebarPresenter :gameModel="gameModel" :timeSec="checkStopInterval(gameModel.end, userModel.username)" :showTime="false" :showRules="true"/>
            </div>
          </UCard>
        </USlideover>
        <div class="h-full overflow-y-auto">
          <GamePresenter :userModel="userModel" :gameModel="gameModel" :dailyChallenge="true" size="small"/>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <UIcon name="i-eos-icons-loading"/>
  </div>
</template>