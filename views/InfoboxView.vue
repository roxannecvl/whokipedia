<script
    setup
    lang="ts">
import { HintList, revealedLabels } from "~/model/HintList";
defineProps( {
    hints: {
      type: HintList,
      required: true,
    },
    image : {
      type: String,
      required: true,
    },
    blur : {
      type : Number,
      required: true,
    },
    over : {
      type : Boolean,
      required: true,
    }
})
</script>

<template>
  <UCard class="flex flex-col items-center justify-center">
    <template #header>
      <div class="flex flex-col items-center justify-center">
        <img
            :src="image"
            alt="image"
            class="w-40 object-cover pb-2"
            :class="{
            'blur-none': blur === 0 || over,
            'blur-sm': blur === 1,
            'blur': blur === 2,
            'blur-md': blur === 3,
            'blur-lg': blur === 4,
            'blur-xl': blur === 5,
            'blur-2xl': blur === 6,
            'blur-3xl': blur === 7
          }"
        />

      </div>
    </template>
    <div class="flex flex-col items-center justify-center">
      <table>
        <tr v-for="hint in hints.toList()"
            :key="hint">
            <td class="text-left">
              <p v-if="hint.label === 'Death' && (!hint.revealed || hints.alive)"
                 class="text-blue-500 font-semibold"> Status </p>
              <p v-else-if=" hint.revealed || revealedLabels.includes(hint.label) || over"
                   class="text-blue-500 font-semibold">{{ hint.label }}  </p>
              <p v-else class="text-blue-500 font-semibold blur-sm">Unknown  </p>
            </td>
            <td class="text-right">
                <p v-if="hint.label === 'Death' &&  hints.alive && (hint.revealed|| over)"> Alive </p>
                <p v-else-if="hint.revealed || over">{{ hint.value }}</p>
                <p v-else class="blur-sm"> cheater </p>
            </td>
        </tr>
      </table>
    </div>
  </UCard>
</template>