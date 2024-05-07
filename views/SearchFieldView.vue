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
const emit = defineEmits(['new-name-set'])

// Refs
const selectedName = ref("")
const tremble = ref(false)

// Constants
const mode = useColorMode()
const redColor = computed(() => mode.value === 'dark' ? '#996666' : '#ffe6e6')
const toast = useToast()

// Watchers
watch(selectedName, newName)

// Functions
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
</script>


<template>
  <div v-if="over" class="text-3xl font-black mx-[11px] sm:ml-2 border-b">{{ name }}</div>
  <div v-else class="pl-2.5 sm:pl-1 pr-2.5 px-2 pt-1 lg:pt-0 mt-0 sm:mt-1">
    <UInputMenu
        v-model="selectedName"
        :search="getAutocompleteSuggestions"
        placeholder="Take a guess..."
        option-attribute="name"
        trailing
        by="id"
        :style="{ fontSize: '18px', padding: '10px', height: '40px', backgroundColor: alert ? redColor : '' }"
        :class="{'tremble': tremble }" />
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
