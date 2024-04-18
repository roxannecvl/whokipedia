<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel";
import { celebrities } from "~/model/CelebrityList";
import { getRandom } from "~/utilities/Utils"
import GamePresenter from "~/presenters/GamePresenter.vue";
import SidebarPresenter from "~/presenters/SidebarPresenter.vue"

// TODO: retrieve celebrity name from persistence
const store: GameStore = useGameStore()
store.init(getRandom(celebrities))

// Refs
const elapsedTime = ref(0)
const isRulesOpen = ref(false)

// Computed
let timerInterval: NodeJS.Timeout | null = null;

// Functions
onMounted(() => {
  timerInterval = setInterval(() => {
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
  <div>
    <div class="w-full flex justify-center items-center" v-if="store.loading">
      <UIcon name="i-eos-icons-loading"/>
    </div>
    <div v-else>
      <div class="hidden lg:flex">
        <div class="w-1/6 p-2" style="max-height: 75vh; overflow-y:auto">
          <SidebarPresenter :model="store" :timeSec="checkStopInterval(store.end)" :showTime="true" :showRules="true"/>
        </div>
        <div class="w-5/6 p-2"><GamePresenter :model="store" /></div>
      </div>
      <div class="lg:hidden">
        <div>
          <div class="w-1/5 inline-block justify-center">
            <UButton label="See rules" size="xl" class="text-lg" @click="isRulesOpen = true"/>
          </div>
          <div class="w-4/5 inline-block">
            <SidebarPresenter :model="store" :timeSec="checkStopInterval(store.end)" :showTime="true" :showRules="false"/>
          </div>
        </div>
        <USlideover v-model="isRulesOpen" title="Rules">
          <UCard :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <div class="flex items-center justify-between">
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isRulesOpen = false" />
            </div>
            <div class="p-5 w-full box-border">
              <SidebarPresenter :model="store" :timeSec="checkStopInterval(store.end)" :showTime="false" :showRules="true"/>
            </div>
          </UCard>
        </USlideover>
        <div class="p-2"><GamePresenter :model="store" /></div>
      </div>
    </div>
  </div>
</template>