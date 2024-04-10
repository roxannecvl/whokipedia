<script setup lang="ts">

defineProps({
  hintCount: Number,
  over: Boolean,
})

const logoFilledPath = '/img/logo-filled.svg';
const logoTransparentPath = '/img/logo-transparent.svg';
const elapsedTime = ref(0);
const mode = useColorMode();
const logoPath = computed(() => mode.value === 'dark' ? logoFilledPath : logoTransparentPath);
let timerInterval: NodeJS.Timeout | null = null;

onMounted(() => {
  timerInterval = setInterval(() => {
    elapsedTime.value++;
  }, 1000);
});

function formatTime(seconds : number, over : boolean){
  if(over && timerInterval !== null){
    clearInterval(timerInterval);
    timerInterval = null;
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

  <div>
    <img
        :src="logoPath"
        alt="logo"
        class="w-40 h-40 mx-auto"
    />
  </div>


  <UAlert
      :title="'Guess number ' + hintCount"
      color="primary"
      :variant="over ? 'subtle': 'outline'"
      :description="formatTime(elapsedTime, over)"
      class="my-4"
  />

  <UDivider
      label="How to play"
      :ui="{ label: 'text-xl font-bold' }"
  />

  <p class="py-3 font-semibold">
  Guess the celebrity <span class="text-primary">in as few hints as possible</span>
  </p>
  <ul class="list-disc list-inside m-2">
    <li>Each guess must be one of our listed <span class="text-primary">celebrities</span>.</li>
    <li>Each unsuccessful guess brings a <span class="text-primary">new hint</span>.</li>
    <li><span class="text-primary">Guess until you find the celebrity</span> or until <span class="text-primary">all hints are consumed</span>.</li>
  </ul>
</template>