<script setup lang="ts">

import type { GameStore } from "~/model/GameModel";
import PlayAgainView from "~/views/PlayAgainView.vue";
import { celebrities } from "~/model/CelebrityList";
import { dailyRandom, getRandomNumber } from "~/utilities/Utils";
import type {UserStore} from "~/model/UserModel";

// Props
const props = defineProps({
  gameModel: {
    type: Object as () => GameStore,
    required: true,
  },
  userModel: {
    type: Object as () => UserStore,
    required: true,
  },
  dailyChallenge: {
    type: Boolean,
    required: true,
  },
})

// Functions
async function initGame() {
  if (props.dailyChallenge) return
  // Random celebrity but not the current daily challenge
  let dailyRdm = await dailyRandom(0, celebrities.length - 1)
  let randomIndex = getRandomNumber(0, celebrities.length - 2)
  if(randomIndex >= dailyRdm) randomIndex +=1
  props.gameModel.init(celebrities[randomIndex], true)
}

</script>

<template>
  <PlayAgainView
      @new-game="initGame" :over="gameModel.end" :challenge="dailyChallenge" :connected="userModel.username != ''"/>
</template>