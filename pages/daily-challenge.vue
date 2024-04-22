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
store.init(celebrities[dailyRandom(0, celebrities.length)])

// Refs
const elapsedTime = ref(0)
const isRulesOpen = ref(false)

// Computed
let timerInterval: NodeJS.Timeout | null = null;

// Functions
onMounted(() => {
  timerInterval = setInterval(() => {
    if(store.time > elapsedTime.value) elapsedTime.value = store.time
    elapsedTime.value++;
  }, 1000);
});

function checkStopInterval(over : boolean){
  if(over && timerInterval !== null){
    clearInterval(timerInterval);
    timerInterval = null;
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

      <div class="lg:hidden">
        <div>
          <div class="w-1/5 inline-block justify-center">
            <UButton label="See rules" size="xl" class="text-lg" @click="isRulesOpen = true"/>
          </div>
          <div class="w-4/5 inline-block">
            <SidebarPresenter :gameModel="store" :timeSec="checkStopInterval(store.end)" :showTime="true" :showRules="false"/>
          </div>
        </div>
        <USlideover v-model="isRulesOpen" title="Rules">
          <UCard :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <div class="flex items-center justify-between">
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isRulesOpen = false" />
            </div>
            <div class="p-5 w-full box-border">
              <SidebarPresenter :gameModel="store" :timeSec="checkStopInterval(store.end)" :showTime="false" :showRules="true"/>
            </div>
          </UCard>
        </USlideover>
        <div class="h-full p-2">
          <GamePresenter :userModel="userModel" :gameModel="store" />
        </div>
      </div>
      
    </div>
  </div>
  <div v-else>
    <ShouldLoginView/>
  </div>
</template>