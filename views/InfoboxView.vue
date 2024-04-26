<!--suppress ALL -->
<script setup lang="ts">
import { type InfoboxHint, compulsoryLabels } from "~/model/Hint"
import { capitalize } from "~/utilities/Utils"

// Props
const props = defineProps( {
    fields: {
      type: Array<InfoboxHint>,
      required: true,
    },
    imageUrl : {
      type: String,
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
  <div>
    <UCard class="flex flex-col items-center justify-center" :ui="{header: {padding:''}}">
      <template #header>
        <div class="flex flex-col items-center justify-center my-5">
          <transition name="scale-up" mode="out-in">
            <img :src="imageUrl" :key="imageUrl" alt="image" class="w-40 object-cover pointer-events-none rounded-md rounded-b-md shadow-md"/>
          </transition>
        </div>
      </template>
      <div class="flex flex-col items-center justify-center py-5">
        <table>
          <tr v-for="(field, index) in fields" :key="index">
              <td class="text-left align-top pr-6 pt-2">
                <p v-if="field.label === 'Death' && !field.revealed"
                   class="text-blue-500 font-semibold"> Status </p>
                <p v-else-if=" field.revealed || compulsoryLabels.hasOwnProperty(field.label) || over"
                     class="text-blue-500 font-semibold"> {{ field.label }} </p>
                <p v-else class="text-blue-500 font-semibold blur-sm"> Unknown </p>
              </td>
              <td class="text-left pt-2">
                <Transition>
                  <div v-if="field.revealed || over">
                    <p v-for="value in field.value.split(/(?:,?\s*and|,|and)(?=\s|$)/g)" :key="value">
                      {{ capitalize(value) }}
                    </p>
                  </div>
                  <p v-else class="blur-sm"> cheater </p>
                </Transition>
              </td>
          </tr>
        </table>
      </div>
      <div v-if="over" style="display: flex; justify-content: center">
        <UButton :to="buttonLink" size="lg">Learn more</UButton>
      </div>
    </UCard>
  </div>
</template>


<style scoped>
.v-enter-active {
  animation: scale-text 1.2s
}

@keyframes scale-text {
  0% {
    transform: scale(1)
  }

  50% {
    transform: scale(1.3);
    color: rgb(245, 158, 12)
  }

  100% {
    transform: scale(1)
  }
}

.scale-up-enter-active {
  transition: all 1.2s;
}

.scale-up-leave-active {
  transition: all 0.6s;
}

.scale-up-enter-from, .scale-up-leave-to {
  transform: scale(1.05);
  box-shadow: 0 0 15px 6px rgb(245, 158, 12, 0.9);
}

</style>