<script setup lang="ts">

import {type GameStore, useGameStore} from "~/model/GameModel";
import { celebrities } from "~/model/CelebrityList";
import GamePresenter from "~/presenters/GamePresenter.vue";
import SidebarPresenter from "~/presenters/SidebarPresenter.vue"
import { getRandom } from "~/utilities/Utils"

// TODO: retrieve celebrity name from persistence
const store: GameStore = useGameStore()
store.init(getRandom(celebrities))

const isRulesOpen = ref(false)

</script>

<template>
  <div>
    <div class="w-full flex justify-center items-center" v-if="store.loading">
      <UIcon
          name="i-eos-icons-loading"
      />
    </div>
    <div v-else>
      <div class="hidden md:flex">
        <div class="w-1/4 p-2"><SidebarPresenter :model="store" /></div>
        <div class="w-3/4 p-2"><GamePresenter :model="store" /></div>
      </div>
      <div class="flex md:hidden flex-col ">
        <div class="p-2 items-center">
          <UButton label="See rules" @click="isRulesOpen = true"/>
        </div>
        <USlideover
            v-model="isRulesOpen"
            title="Rules">
          <UCard
              :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Rules
                </h3>
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isRulesOpen = false" />
              </div>

            </template>
            <div class="p-5 w-full box-border"><SidebarPresenter :model="store" /></div>
          </UCard>

        </USlideover>
        <div class="p-2"><GamePresenter :model="store" /></div>
      </div>
    </div>
  </div>
</template>