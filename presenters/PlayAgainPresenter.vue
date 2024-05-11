<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel"
import { type UserStore, useUserStore } from "~/model/UserModel"
import { celebrities } from "~/model/CelebrityList"
import { dailyRandom, getRandomNumber } from "~/utilities/Utils"
import PlayAgainView from "~/views/PlayAgainView.vue"

// Props
const props = defineProps({
  dailyChallenge: {
    type: Boolean,
    required: true,
  },
})

// Models
const userModel: UserStore = useUserStore()
const gameModel: GameStore = useGameStore()

/**
 * This method inits a new game, ensuring chosen celebrity is different from daily challenge.
 */
async function initGame() {
  if (props.dailyChallenge) return
  let dailyRdm = await dailyRandom(0, celebrities.length - 1)
  let randomIndex = getRandomNumber(0, celebrities.length - 2)
  if(randomIndex >= dailyRdm) randomIndex +=1
  await gameModel.init(celebrities[randomIndex])
}

</script>

<template>
  <PlayAgainView @new-game="initGame" :over="gameModel.end"
                 :challenge="dailyChallenge" :connected="userModel.username !== ''"/>
</template>