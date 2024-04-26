<script setup lang="ts">
import { useCurrentUser } from 'vuefire'
import { type GameStore } from "~/model/GameModel"
import type { TimedStat, UserStore } from "~/model/UserModel"
import GameCenterView from "~/views/GameCenterView.vue"
import SearchFieldView from "~/views/SearchFieldView.vue"
import {
  updateUserToFirebase,
  getAllUserFromFirebase,
  updateUserRankToFirebase,
  updateUserAVGRankToFirebase,
  saveCurrentGameToFirebase,
  readCurGameFromFirebase,
  type UserPersistence,
} from "~/model/FirebaseModel"
import { getCurrentDayTimestamp } from "~/utilities/Utils"

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

// Constants
const baseString = "https://en.wikipedia.org/wiki/"
const validGuess = ref(true)
const user = useCurrentUser()
const date : Date = new Date()
date.setHours(0,0,0,0)

let timeStamp = date.getTime()

// Functions
onMounted(async () => {
  timeStamp = await getCurrentDayTimestamp()
  if (props.dailyChallenge) {
    await updateGameModel()
  }
})

function guessAndCheck(name : string) {
  validGuess.value = props.gameModel.makeAGuess.bind(props.gameModel)(name)
  if (!validGuess.value) {
    setTimeout(() => {
      validGuess.value = true
    }, 2500)
  }

  if (props.gameModel.end && props.dailyChallenge) {
    computeRank().then((rank) => {
      if(user.value && rank) {
        props.userModel.endGame(props.gameModel.win, rank, props.gameModel.nbGuesses, props.gameModel.time, timeStamp)
        updateUserToFirebase(props.userModel, user.value.uid)
      }
    }).catch((err) => {
      console.log(err)
    })
  }
}

// Only used in daily challenge mode
async function computeRank() {
  return getAllUserFromFirebase().then((data: UserPersistence[]) => {
    const filteredUserData = data.filter((item: UserPersistence) => {
      return item.stats.find((stat: any) => parseInt(stat.date) === timeStamp)
          && item.uid !== user.value?.uid
    })

    // Sort by number of guesses or time if number of guesses is equal
    const sortedUserData = filteredUserData.sort((a, b) => {
      const aStats = a.stats.find((stat: any) => parseInt(stat.date) === timeStamp)
      const bStats = b.stats.find((stat: any) => parseInt(stat.date) === timeStamp)
      if (aStats && bStats) {
        if (aStats.guesses === bStats.guesses) {
          return aStats.time - bStats.time
        }
        return aStats.guesses - bStats.guesses
      }
      return 0
    })

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
    console.log(err)
  })
}

// Only used in daily challenge mode
async function updateGameModel(){
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

// Only used in daily challenge mode
function updateCurrentGame() {
  setTimeout(() => {
    if (user.value && props.gameModel.nbGuesses > 0) saveCurrentGameToFirebase(props.gameModel, user.value.uid)
  }, 1000)
}

if(props.dailyChallenge) watch(props.gameModel.$state, updateCurrentGame)

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
          :buttonLink="baseString + gameModel.name"
      />
    </div>
  </div>
</template>

