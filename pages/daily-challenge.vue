<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel";
import { celebrities } from "~/model/CelebrityList";
import { dailyRandom } from "~/utilities/Utils"
import GamePresenter from "~/presenters/GamePresenter.vue";
import SidebarPresenter from "~/presenters/SidebarPresenter.vue"
import type { UserStore } from "~/model/UserModel";
import ShouldLoginView from "~/views/ShouldLoginView.vue";

// Props
const props = defineProps({
  userModel: {
      type: Object as () => UserStore,
      required: true,
  },
})

const store: GameStore = useGameStore()
store.init(celebrities[dailyRandom(0, celebrities.length)], true)

// Refs
const elapsedTime = ref(0)
const isRulesOpen = ref(false)

// Computed
let timerInterval: NodeJS.Timeout | null = null;

// Functions
onMounted(() => {
  startInterval()
});

function startInterval(){
  timerInterval = setInterval(() => {
    if(store.time > elapsedTime.value){
      elapsedTime.value = store.time
    }
    if(props.userModel.username !== "") {
      elapsedTime.value++
    }else{
      elapsedTime.value = 0
    }
  }, 1000);
}

function checkStopInterval(over : boolean){
  if(over && timerInterval !== null){
    clearInterval(timerInterval);
    timerInterval = null;
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
          <SidebarPresenter :gameModel="store" :timeSec="checkStopInterval(store.end)" :showTime="true" :showRules="true"/>
        </div>
        <div class="w-5/6 p-2">
          <GamePresenter :userModel="userModel" :gameModel="store" />
        </div>
      </div>

      <div class="h-full flex flex-col gap-4 lg:hidden">
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
          <GamePresenter :userModel="userModel" :gameModel="store" />
        </div>
      </div>
      
    </div>
  </div>
  <div v-else>
    <ShouldLoginView/>
  </div>
</template>