<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel"
import { type UserStore, useUserStore } from "~/model/UserModel"
import { celebrities } from "~/model/CelebrityList"
import { dailyRandom, getRandomNumber } from "~/utilities/Utils"
import GamePresenter from "~/presenters/GamePresenter.vue"
import SidebarPresenter from "~/presenters/SidebarPresenter.vue"
import PlayAgainPresenter from "~/presenters/PlayAgainPresenter.vue";

// Models
const userModel: UserStore = useUserStore()
const gameModel: GameStore = useGameStore()

// Refs
const elapsedTime = ref(0)
const isRulesOpen = ref(false)

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
      <div class="w-1/6 p-2 max-h-[75vh] overflow-y-auto">
        <SidebarPresenter :timeSec="checkStopInterval(gameModel.end)" :showTime="true" :showRules="true"/>
      </div>
      <div class="h-full flex flex-col w-5/6 p-2">
        <PlayAgainPresenter :dailyChallenge="false"/>
        <GamePresenter :dailyChallenge="false" class="overflow-y-auto" size="big"/>
      </div>
    </div>

    <!-- FOR SMALL SCREENS-->
    <div class="h-full flex flex-col gap-3 lg:hidden">
      <PlayAgainPresenter :daily-challenge="false"/>
      <div class="flex justify-between gap-2 items-center px-2.5 sm:pl-1">
        <div>
          <UButton icon="i-material-symbols-help-rounded" variant="outline" size="md" class="h-full" @click="isRulesOpen = true">
            <span class="hidden md:inline">Rules</span>
          </UButton>
        </div>
        <div class="flex-grow">
          <SidebarPresenter :timeSec="checkStopInterval(gameModel.end)" :showTime="true" :showRules="false"/>
        </div>
      </div>
      <USlideover v-model="isRulesOpen" title="Rules">
        <UCard :ui="{ body: { base: 'flex-1' }, ring: '', shadow: '', rounded: ''}">
          <div class="flex items-center justify-end">
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isRulesOpen = false" />
          </div>
          <div class="p-5 w-full box-border">
            <SidebarPresenter :timeSec="checkStopInterval(gameModel.end)" :showTime="false" :showRules="true"/>
          </div>
        </UCard>
      </USlideover>
      <div class="h-full overflow-y-auto">
        <GamePresenter :dailyChallenge="false" size="small"/>
      </div>
    </div>
  </div>
</template>