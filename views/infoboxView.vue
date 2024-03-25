<script
    lang="ts">
import { GameModel } from "~/model/GameModel";
import { reactive } from "vue";

export default {
  props: {
    model: {
      type: GameModel,
      required: true,
    }
  },
  // Change this !!! Need to add reactive in presenter
  setup(props: { model: GameModel; }) {
    const model = reactive(props.model);
    return {
      model
    }
  }
}
</script>

<template>¨
  <div v-if="(model.infoPromiseState.data == null || model.imagePromiseState.data == null || model.introPromiseState.data == null)">
    <img src="https://brfenergi.se/iprog/loading.gif" alt="loading"/>
  </div>
  <div v-else>
    <UCard class="m-4">{{ model.intro}}</UCard>
    <img alt="profile picture" :src="model.imageUrl" class="m-4"/>
    <UCard class="m-4">{{ model.hints?.toString() }}</UCard>
  </div>
  <div>
    <UCard class="m-4">{{ model.infoPromiseState.data == null }}</UCard>
    <UCard class="m-4">{{ model.imagePromiseState.data == null }}</UCard>
    <UCard class="m-4">{{ model.introPromiseState.data == null }}</UCard>
  </div>
  <UCard class="flex flex-col items-center justify-center">
    <template #header>
      <div class="flex flex-col items-center justify-center">
        <img
            :src="model.imageUrl"
            alt="image"
            class="w-40 h-40 rounded-full object-cover pb-2"
            :class="{
            'blur-sm': model.blur === 1,
            'blur': model.blur === 2,
            'blur-md': model.blur === 3,
            'blur-lg': model.blur === 4,
            'blur-xl': model.blur === 5,
            'blur-2xl': model.blur === 6,
            'blur-3xl': model.blur === 7
          }"
        />
        <UButtonGroup>
          <UButton
              @click="model.blur--"
              :disabled="model.blur === 0"
              icon="i-heroicons-minus-solid"
              color="primary"/>
          <UButton
              @click="model.blur++"
              :disabled="model.blur === 7"
              icon="i-heroicons-plus-solid"
              color="primary"/>
        </UButtonGroup>
        <UButtonGroup>
          <UButton
              @click="model.getNewHint()"
              icon="i-heroicons-plus-solid"
              color="primary"/>
        </UButtonGroup>
      </div>
    </template>
    <div class="flex flex-col items-center justify-center">
      <!-- <div class="text-2xl font-bold">
        {{ model.name }}
      </div>
      <div class="text-lg">
        {{model.hints.birth.value.getDate()}} {{model.hints.birth.value.toLocaleString('en-US', { month: 'long' })}} {{model.hints.birth.value.getFullYear()}}
      </div>
      <div class="text-lg">
        {{model.hints.death.revealed ? " " + model.hints.death.value.getDate()  + " "  + model.hints.death.value.toLocaleString('en-US', { month: 'long' }) + " " + model.hints.death.value.getFullYear(): "-"}}
      </div>
      <div class="text-lg">
        {{model.hints.occupation.revealed ? model.hints.occupation.value: "-"}}
      </div>
      <div class="text-lg">
        {{model.hints.citizenship.revealed ? model.hints.citizenship.value: "-"}}
      </div>
      <div class="text-lg">
        {{model.hints.initials.revealed ? model.hints.initials.value: "-"}}
      </div>
      <div class="text-lg">
        {{model.hints.paragraph.revealed ? model.hints.paragraph.value: "-"}}
      </div>-->
    </div>
  </UCard>
</template>