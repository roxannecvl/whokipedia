<script setup lang="ts">

import { getAutocompleteSuggestions } from "~/model/CelebrityList"

// Props
const props = defineProps( {
  over : {
    type : Boolean,
    required: true,
  },
  name: {
    type : String,
    required: true,
  },
  alert : {
    type : Boolean,
    required: true,
  },
})

// Emits
const emit = defineEmits(['new-name-set', 'new-hint-asked'])

// Refs
const selectedName = ref("")
const tremble = ref(false)

// Constants
const mode = useColorMode()
const redColor = computed(() => mode.value === 'dark' ? '#996666' : '#ffe6e6')
const toast = useToast()

/**
 * Method to set the new name guessed by the user. It will emit the event to the parent component.
 * It also handles error when user tries to submit same name twice and resets the input field.
 */
function newName(): void {
  if (selectedName.value === "") return
  emit("new-name-set", selectedName.value)
  tremble.value = true
  setTimeout(() => {
    selectedName.value = ""
    tremble.value = false
  }, 300)
  setTimeout(() => {
    if(props.alert){
      toast.add({
        title: "Already guessed!",
        description: "This guess doesn't count as a new guess, try again :)",
        icon: 'i-heroicons-x-circle',
        color:"red",
        timeout: 2500
      })
    }
  }, 50)
}

watch(selectedName, newName)

</script>

<template>
  <div v-if="over" class="text-3xl font-black mx-[11px] sm:ml-2 border-b">{{ name }}</div>
  <div v-else class="flex pl-2.5 sm:pl-1 pr-2.5 px-2 pt-1 lg:pt-0 mt-0 sm:mt-1">
    <UInputMenu
        v-model="selectedName"
        :search="getAutocompleteSuggestions"
        placeholder="Take a guess..."
        option-attribute="name"
        trailing
        by="id"
        :style="{ fontSize: '18px', padding: '10px', height: '40px', backgroundColor: alert ? redColor : '' }"
        :class="{'tremble': tremble }" class="w-full mr-2" />
    <UButton v-if="!over" variant="soft"
             icon="i-heroicons-plus-circle-16-solid"
             @click="emit('new-hint-asked')"/>
  </div>
</template>

<style>
@keyframes tremble {
  0% { transform: translate(0) }
  25% { transform: translate(-15px, 0px) }
  50% { transform: translate(15px, 0px) }
  75% { transform: translate(-15px, 0px) }
  100% { transform: translate(0) }
}

.tremble {
  animation: tremble 0.3s ease-in-out 1
}
</style>
