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
  setup(props) {
    const model = reactive(props.model);
    return {
      model
    }
  }
}
</script>

<template>
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
      <div class="text-2xl font-bold">
        {{ model.name }}
      </div>
      <div class="text-lg">
        {{model.birth.value.getDate()}} {{model.birth.value.toLocaleString('en-US', { month: 'long' })}} {{model.birth.value.getFullYear()}}
      </div>
      <div class="text-lg">
        {{model.death.revealed ? " " + model.death.value.getDate()  + " "  + model.death.value.toLocaleString('en-US', { month: 'long' }) + " " + model.death.value.getFullYear(): "-"}}
      </div>
      <div class="text-lg">
        {{model.occupation.revealed ? model.occupation.value: "-"}}
      </div>
      <div class="text-lg">
        {{model.citizenship.revealed ? model.citizenship.value: "-"}}
      </div>
      <div class="text-lg">
        {{model.initials.revealed ? model.initials.value: "-"}}
      </div>
      <div class="text-lg">
        {{model.paragraph1.revealed ? model.paragraph1.value: "-"}}
      </div>
    </div>
  </UCard>
</template>