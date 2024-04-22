<script setup lang="ts">

// Refs
const logoPath = ref('')

// Constants
const logoFilledPath = '/img/logo-filled.svg'
const logoTransparentPath = '/img/logo-transparent.svg'
const mode = useColorMode()

// Watchers
watch(mode, (newMode) => {
  logoPath.value = newMode.value === 'dark' ? logoFilledPath : logoTransparentPath
})

// Computed
onMounted(() => {
  logoPath.value = mode.value === 'dark' ? logoFilledPath : logoTransparentPath
})

</script>

<template>
  <div class="relative">
    <div class="absolute inset-0 pointer-events-none bg-no-repeat bg-right blur"
         :style="{ backgroundImage: `url(${logoPath})`, backgroundSize: '47%'}">
    </div>

    <div class="inset-0 flex flex-col items-start px-4 mt-10">
      <div class="text-5xl font-bold mb-2 text-primary">Whokipedia</div>
      <div class="text-3xl font-bold mb-4">The ultimate guessing game!</div>
      <div class="text-xl  max-w-[50%] mb-10">
        Test your knowledge of the who's who in Whokipedia,
        where each clue leads you closer to uncovering the celebrity behind the blur!
      </div>

      <div class="flex flex-row">
        <div class="p-2">
          <UButton to="/daily-challenge" size="xl" class="text-xl" label="Play">
            Daily Challenge
          </UButton>
        </div>
        <div class="p-2">
          <UButton to="/solo-mode" size="xl" class="text-xl" label="Play">
            Play solo
          </UButton>
        </div>
      </div>

      <div class="border border-primary border-solid rounded-lg p-4 mt-10">
          <p class="font-black text-xl">
            How to play
          </p>
          <p class="py-2 font-semibold">
            Guess the celebrity <span class="text-primary">in as few hints as possible</span>
          </p>
          <ul class="list-disc list-inside m-1">
            <li>Each guess must be one of our listed <span class="text-primary">celebrities</span>.</li>
            <li>Each unsuccessful guess brings a <span class="text-primary">new hint</span>.</li>
            <li><span class="text-primary">Guess until you find the celebrity</span>
              or until <span class="text-primary">all hints are consumed</span>.</li>
          </ul>
      </div>
    </div>

  </div>
</template>



