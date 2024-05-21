<script setup lang="ts">

import { type GameStore, useGameStore } from "~/model/GameModel"
import { type UserStore, useUserStore } from "~/model/UserModel"
import PlayAgainView from "~/views/PlayAgainView.vue"

// Props
const props = defineProps({
  dailyChallenge: {
    type: Boolean,
    required: true,
  },
})

// Emits
const emit = defineEmits(['new-game-bis'])

// Models
const userModel: UserStore = useUserStore()
const gameModel: GameStore = useGameStore()

</script>

<template>
  <PlayAgainView @new-game="() => emit('new-game-bis')" :over="gameModel.end"
                 :challenge="dailyChallenge" :connected="userModel.username !== ''"/>
</template>