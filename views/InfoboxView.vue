<script setup lang="ts">
import { type InfoboxHint, compulsoryLabels } from "~/model/Hint";
import { capitalize } from "~/utilities/Utils";

defineProps( {
    fields: {
      type: Array<InfoboxHint>,
      required: true,
    },
    imageUrl : {
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
    },
    buttonLink : {
      type : String,
      required: true,
    },
})
</script>

<template>
  <UCard class="flex flex-col items-center justify-center">
    <template #header>
      <div class="flex flex-col items-center justify-center">
        <img
            :src="imageUrl"
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
    <div class="flex flex-col items-center justify-center py-5">
      <table>
        <tr v-for="field in fields"
            :key="field">
            <td class="text-left align-top pr-6 pt-2">
              <p v-if="field.label === 'Death' && !field.revealed"
                 class="text-blue-500 font-semibold"> Status </p>
              <p v-else-if=" field.revealed || compulsoryLabels.hasOwnProperty(field.label) || over"
                   class="text-blue-500 font-semibold"> {{ field.label }} </p>
              <p v-else class="text-blue-500 font-semibold blur-sm"> Unknown </p>
            </td>
            <td class="text-left pt-2">
                <div v-if="field.revealed || over">
                  <p v-for="value in field.value.split(/(?:,?\s*and|,|and)(?=\s|$)/g)" :key="value">
                    {{ capitalize(value) }}
                  </p>
                </div>
                <p v-else class="blur-sm"> cheater </p>
            </td>
        </tr>
      </table>
    </div>
    <div v-if="over" style="display: flex; justify-content: center;">
      <UButton
          :to="buttonLink"
          size="lg"
      >
        Learn more
      </UButton>
    </div>
  </UCard>
</template>