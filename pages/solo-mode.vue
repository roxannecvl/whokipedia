<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel"
import { celebrities } from "~/model/CelebrityList"
import {dailyRandom, getRandomNumber} from "~/utilities/Utils"
import GamePresenter from "~/presenters/GamePresenter.vue"
import SidebarPresenter from "~/presenters/SidebarPresenter.vue"
import type { UserStore } from "~/model/UserModel"
import ShouldLoginView from "~/views/ShouldLoginView.vue"
import PlayAgainPresenter from "~/presenters/PlayAgainPresenter.vue";

// Props
const props = defineProps({
  userModel: {
    type: Object as () => UserStore,
    required: true,
  },
})

const store: GameStore = useGameStore()
//random celebrity but not the current daily challenge
let randomIndex = getRandomNumber(0, celebrities.length - 2)
if(randomIndex >= dailyRandom(0, celebrities.length - 1)) randomIndex +=1
store.init(celebrities[randomIndex], true)

// Refs
const elapsedTime = ref(0)
const isRulesOpen = ref(false)

// Computed
let timerInterval: NodeJS.Timeout | null = null

// Functions
onMounted(() => {
  if(store.time > elapsedTime.value) elapsedTime.value = store.time
  if(timerInterval === null) startInterval()
});

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

</script>

<template>
  <div v-if="store.loading" class="w-full flex justify-center items-center">
    <UIcon name="i-eos-icons-loading"/>
  </div>

  <div v-else class="h-full">
    <!-- FOR BIG SCREENS-->
    <div class="h-full hidden lg:flex">
      <div class="w-1/6 p-2 max-h-[75vh] overflow-y-auto">
        <div class="mb-5">
          <PlayAgainPresenter :dailyChallenge="false" :gameModel="store"/>
        </div>
        <SidebarPresenter :gameModel="store" :timeSec="checkStopInterval(store.end)" :showTime="true" :showRules="true"/>
      </div>
      <div class="w-5/6 p-2">
        <GamePresenter :userModel="userModel" :gameModel="store" :dailyChallenge="false"/>
      </div>
    </div>

    <!-- FOR SMALL SCREENS-->
    <div class="h-full flex flex-col gap-4 lg:hidden">
      <PlayAgainPresenter :daily-challenge="false" :gameModel="store"></PlayAgainPresenter>
      <div class="flex justify-between gap-2 items-center px-2.5 sm:pl-1">
        <div>
          <UButton icon="i-material-symbols-help-rounded" variant="outline" size="md" class="h-full" @click="isRulesOpen = true">
            <span class="hidden md:inline">Rules</span>
          </UButton>
        </div>
        <div class="flex-grow">
          <SidebarPresenter :gameModel="store" :timeSec="checkStopInterval(store.end)" :showTime="true" :showRules="false"/>
        </div>
      </div>
      <USlideover v-model="isRulesOpen" title="Rules">
        <UCard :ui="{ body: { base: 'flex-1' }, ring: '', shadow: '', rounded: ''}">
          <div class="flex items-center justify-end">
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isRulesOpen = false" />
          </div>
          <div class="p-5 w-full box-border">
            <SidebarPresenter :gameModel="store" :timeSec="checkStopInterval(store.end)" :showTime="false" :showRules="true"/>
          </div>
        </UCard>
      </USlideover>
      <div class="h-full">
        <GamePresenter :userModel="userModel" :gameModel="store" :dailyChallenge="false"/>
      </div>
    </div>
  </div>
</template>