<script setup lang="ts">
import { useCurrentUser } from 'vuefire'
import { type GameStore } from "~/model/GameModel"
import type { TimedStat, UserStore } from "~/model/UserModel"
import {
  updateUserToFirebase,
  getAllUserFromFirebase,
  updateUserRankToFirebase,
  updateUserAVGRankToFirebase,
  saveCurrentGameToFirebase,
  readCurGameFromFirebase,
  type UserPersistence
} from "~/model/FirebaseModel"
import { getCurrentDayTimestamp, sortTodayChallengers } from "~/utilities/Utils"
import GameCenterView from "~/views/GameCenterView.vue"
import SearchFieldView from "~/views/SearchFieldView.vue"

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
  size: {
    type: String,
    required: true,
  }
})

// Constants
const user = useCurrentUser()
const baseString = "https://en.wikipedia.org/wiki/"
let timeStamp = await getCurrentDayTimestamp()

// Refs
const validGuess = ref(true)

// Functions

/**
 * This function is used to make a guess and check if it is correct, triggering end of game if it is.
 * @param name - The name of the celebrity guessed
 */
function guessAndCheck(name : string) {
  validGuess.value = props.gameModel.makeAGuess.bind(props.gameModel)(name)
  if (!validGuess.value) {
    setTimeout(() => {
      validGuess.value = true
    }, 2500)
  }
  if (props.gameModel.end && props.dailyChallenge) {
    computeRank().then((rank) => {
      if (user.value && rank) {
        props.userModel.endGame(props.gameModel.win, rank, props.gameModel.nbGuesses, props.gameModel.time, timeStamp)
        updateUserToFirebase(props.userModel, user.value.uid)
      }
    }).catch((err) => {
      console.error(err)
    })
  }
}

/**
 * This function is used to compute the rank of the user in the daily challenge mode.
 */
async function computeRank(): Promise<number | void> {
  return getAllUserFromFirebase().then((data: UserPersistence[]) => {
    const sortedUserData = sortTodayChallengers(data, timeStamp).filter(item => item.uid !== user.value?.uid)
    for (let index = 0; index < sortedUserData.length; index++) {
      const item = sortedUserData[index]
      const stat = item.stats.find((stat: any) => parseInt(stat.date) === timeStamp)
        if (stat && (props.gameModel.nbGuesses < stat.guesses
            || (props.gameModel.nbGuesses === stat.guesses && props.gameModel.time < stat.time))) {
          for (let i = index; i < sortedUserData.length; i++) {
            updateUserRankToFirebase(i + 2, sortedUserData[i].uid)
            updateUserAVGRankToFirebase(1, sortedUserData[i].uid)
          }
          return index + 1
      }
    }
    return sortedUserData.length + 1
  }).catch((err) => {
    console.error(err)
  })
}

/**
 * This function is used to update the game model with the user's stats if the user has already played the game today.
 */
async function updateGameModel(): Promise<void> {
  if(props.gameModel?.isDaily) {
    let dailyStats: TimedStat[] = props.userModel.timedStats.filter((stat: TimedStat) => stat.date == timeStamp)
    if (dailyStats.length !== 0) {
      props.gameModel.end = true
      props.gameModel.win = true
      props.gameModel.nbGuesses = dailyStats[0].guesses
      props.gameModel.time = dailyStats[0].time
      props.gameModel.imageUrl = props.gameModel.updateImage()
    } else if (user.value) {
      await readCurGameFromFirebase(props.gameModel, user.value.uid)
    }
  }
}

/**
 * This function is used to update the current game in the database.
 */
function updateCurrentGame(): void {
  setTimeout(() => {
    if (user.value && props.gameModel.nbGuesses > 0) saveCurrentGameToFirebase(props.gameModel, user.value.uid)
  }, 1000)
}

// Lifecycle hooks
onMounted(async () => {
  if (props.dailyChallenge) {
    await updateGameModel()
  }
})

if (props.dailyChallenge) {
  watch(props.gameModel.$state, updateCurrentGame)
}

</script>

<template>
  <div class="flex flex-col h-full">
    <SearchFieldView
        @new-name-set="selectedName => guessAndCheck(selectedName)"
        :over="gameModel.end" :name="gameModel.name" :alert="!validGuess"
    />
    <div class="overflow-y-auto">
      <GameCenterView
          :intro="gameModel.intro" :over="gameModel.end" :name="gameModel.name" :win = "gameModel.win"
          :first-sentence="gameModel.firstSentence" :fields = "gameModel.infobox" :imageUrl="gameModel.imageUrl"
          :buttonLink="baseString + gameModel.name" :size="size"
      />
    </div>
  </div>
</template>

