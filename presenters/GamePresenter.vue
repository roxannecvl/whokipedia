<script setup lang="ts">
import { useCurrentUser } from 'vuefire'
import { type GameStore } from "~/model/GameModel";
import type { UserStore } from "~/model/UserModel";
import GameCenterView from "~/views/GameCenterView.vue";
import SearchFieldView from "~/views/SearchFieldView.vue";
import { updateUserToFirebase, getAllUserFromFirebase, updateUserRankToFirebase } from "~/model/FirebaseModel";
import { getCurrentDayTimestamp } from "~/utilities/Utils";

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

})

// Constants
const baseString = "https://en.wikipedia.org/wiki/";
const validGuess = ref(true);
const user = useCurrentUser()

function guessAndCheck(name : string){
  validGuess.value = props.gameModel.makeAGuess.bind(props.gameModel)(name);
  if(!validGuess.value) {
    setTimeout(() => {
      validGuess.value = true;
    }, 2500);
  }

  if(props.gameModel.end){
    computeRank().then((rank) => {
      if(user.value && rank) {
        props.userModel.endGame(props.gameModel.win, rank, props.gameModel.nbGuesses, props.gameModel.time, getCurrentDayTimestamp());
        updateUserToFirebase(props.userModel, user.value.uid);
      }
    }).catch((err) => {
      console.log(err);
    })
  }
}

async function computeRank(){
  return getAllUserFromFirebase().then((data) => {
    const filteredUserData = data.filter((item) => (hasPlayedAtDate(item, getCurrentDayTimestamp()) && item.uid !== user.value?.uid))

    //sort by timedStats nbGuesses or time if nbGuesses are equal
    const sortedUserData = filteredUserData.sort((a, b) => {
      const aStats = a.timedStats.find((stat: any) => parseInt(stat.date) === getCurrentDayTimestamp());
      const bStats = b.timedStats.find((stat: any) => parseInt(stat.date) === getCurrentDayTimestamp());
      if(aStats.nbGuesses === bStats.nbGuesses){
        return aStats.time - bStats.time;
      }
      return aStats.nbGuesses - bStats.nbGuesses;
    });

    for (let index = 0; index < sortedUserData.length; index++) {
        const item = sortedUserData[index]
        const stat = item.timedStats.find((stat: any) => parseInt(stat.date) === getCurrentDayTimestamp())
        if (props.gameModel.nbGuesses < stat.guesses || (props.gameModel.nbGuesses === stat.guesses && props.gameModel.time < stat.time)) {
            for (let i = index; i < sortedUserData.length; i++) {
                updateUserRankToFirebase(i + 2, sortedUserData[i].uid)
            }
            return index + 1
        }
    }
    return sortedUserData.length + 1;
  }).catch((err) => {
    console.log(err);
  });
}

function hasPlayedAtDate(item : any, timestamp: number){
  return item.timedStats !== undefined && item.timedStats.find((stat: any) => parseInt(stat.date) === timestamp)
}

</script>

<template>
  <div class="flex flex-col h-fit">
    <SearchFieldView class="px-2"
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

