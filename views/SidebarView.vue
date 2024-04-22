<script setup lang="ts">

// Props
const props = defineProps({
  guessCount: {
    type : Number,
    required : true,
  },
  totalGuesses : {
    type : Number,
    required : true,
  },
  over: {
    type : Boolean,
    required : true,
  },
  seconds: {
    type : Number,
    required : true,
  },
  showTime: {
    type : Boolean,
    required : true,
  },
  showRules: {
    type : Boolean,
    required : true,
  },
})

// Emits
const emit = defineEmits(['new-time-set'])

//Ref
let once = true

// Functions
function showAndEmit(seconds : number, over : boolean){
  if(over && once){
    once = false;
    emit("new-time-set", seconds);
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  if(minutes >= 60){
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr ${remainingMinutes} min ${formattedSeconds} sec`;
  }
  return `${minutes} min ${formattedSeconds} sec`;
}

</script>

<template>
  <div v-if="showTime">
    <div v-if="showRules">
      <UAlert
        :title="'Guesses: ' + guessCount + ' / ' + totalGuesses"
        color="primary"
        :variant="over ? 'subtle': 'outline'"
        :description="showAndEmit(seconds, over)"
        class="mb-8"
      />
    </div>
    <div v-else class="flex flex-row gap-2">
      <UAlert
          :title="'Guesses: ' + guessCount + ' / ' + totalGuesses"
          color="primary"
          :variant="over ? 'subtle': 'outline'"
          class="text-center"
      />
      <UAlert
          :title="showAndEmit(seconds, over)"
          color="primary"
          :variant="over ? 'subtle': 'outline'"
          class="text-center"
      />
    </div>
  </div>

  <div v-if="showRules">
    <UDivider label="How to play" :ui="{ label: 'text-xl font-bold' }"/>
    <p class="py-3 font-semibold">
    Guess the celebrity <span class="text-primary">in as few hints as possible</span>
    </p>
    <ul class="list-disc list-inside m-2">
      <li>Each guess must be one of our listed <span class="text-primary">celebrities</span>.</li>
      <li>Each unsuccessful guess brings a <span class="text-primary">new hint</span>.</li>
      <li><span class="text-primary">Guess until you find the celebrity</span> or until <span class="text-primary">all hints are consumed</span>.</li>
    </ul>
  </div>
</template>