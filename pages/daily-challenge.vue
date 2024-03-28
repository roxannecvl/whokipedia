<script
    setup
    lang="ts">

import { GameModel } from "~/model/GameModel";
import { celebrities } from "~/model/CelebrityList";
import { Utils } from "~/utilities/Utils"
import GamePresenter from "~/presenters/GamePresenter.vue";
import SidebarPresenter from "~/presenters/SidebarPresenter.vue"

const model = reactive(new GameModel());
//TODO :take the name of the celebrity from firebase in a way
model.init(Utils.getRandom(celebrities))

</script>

<template>
  <div>
    <div v-if="!model.isReady()">
      <UIcon
          name="i-eos-icons-loading"
          class="w-full"
      />
    </div>
    <div v-else class="flex">
      <div class="w-1/4 p-2"><SidebarPresenter :model=model /></div>
      <div class="w-3/4 p-2"><GamePresenter :model=model /></div>
    </div>
  </div>
</template>