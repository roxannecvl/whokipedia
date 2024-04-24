<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel"
import { celebrities } from "~/model/CelebrityList"
import { dailyRandom } from "~/utilities/Utils"
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


// Refs
const elapsedTime = ref(0)
const isRulesOpen = ref(false)
const curUsername = ref("")

// Computed
let timerInterval: NodeJS.Timeout | null = null

// Functions
onMounted(async () => {
  let dailyRdm = await dailyRandom(0, celebrities.length -1)
  await store.init(celebrities[dailyRdm], true)
  curUsername.value = props.userModel.username
  if(store.time > elapsedTime.value) elapsedTime.value = store.time
  if(timerInterval === null) startInterval()
});

function startInterval(){
  timerInterval = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

function checkStopInterval(over : boolean, name : string){
  if(store.time > elapsedTime.value) elapsedTime.value = store.time
  if(name !== curUsername.value && timerInterval !== null) {
    curUsername.value = name
    clearInterval(timerInterval)
    timerInterval = null
  }
  if(over && timerInterval !== null){
    clearInterval(timerInterval)
    timerInterval = null
  }
  if(!over && timerInterval === null){
    elapsedTime.value = 0
    startInterval()
  }
  return elapsedTime.value;
}

</script>

<template>
  <div v-if="userModel.username != ''">
    <div v-if="store.loading" class="w-full flex justify-center items-center">
      <UIcon name="i-eos-icons-loading"/>
    </div>

    <div v-else class="h-full">
      <div class="h-full hidden lg:flex">
        <div class="w-1/6 p-2 max-h-[75vh] overflow-y-auto">
          <PlayAgainPresenter :daily-challenge="true" :gameModel="store"/>
          <SidebarPresenter :gameModel="store" :timeSec="checkStopInterval(store.end, userModel.username)" :showTime="true" :showRules="true"/>
        </div>
        <div class="w-5/6 p-2">
          <GamePresenter :userModel="userModel" :gameModel="store" :dailyChallenge="true"/>
        </div>
      </div>

      <div class="h-full flex flex-col gap-4 lg:hidden">
        <PlayAgainPresenter :daily-challenge="true" :gameModel="store"/>
        <div class="flex justify-between gap-2 items-center px-2.5 sm:pl-1">
          <div>
            <UButton icon="i-material-symbols-help-rounded" variant="outline" size="md" class="h-full" @click="isRulesOpen = true">
              <span class="hidden md:inline">Rules</span>
            </UButton>
          </div>
          <div class="flex-grow">
            <SidebarPresenter :gameModel="store" :timeSec="checkStopInterval(store.end, userModel.username)" :showTime="true" :showRules="false"/>
          </div>
        </div>
        <USlideover v-model="isRulesOpen" title="Rules">
          <UCard :ui="{ body: { base: 'flex-1' }, ring: '', shadow: '', rounded: ''}">
            <div class="flex items-center justify-end">
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isRulesOpen = false" />
            </div>
            <div class="p-5 w-full box-border">
              <SidebarPresenter :gameModel="store" :timeSec="checkStopInterval(store.end, userModel.username)" :showTime="false" :showRules="true"/>
            </div>
          </UCard>
        </USlideover>
        <div class="h-full">
          <GamePresenter :userModel="userModel" :gameModel="store" :dailyChallenge="true"/>
        </div>
      </div>
      
    </div>
  </div>
  <div v-else>
    <ShouldLoginView/>
  </div>
</template>