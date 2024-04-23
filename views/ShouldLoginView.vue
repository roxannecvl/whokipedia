<script setup lang="ts">

const logoPath = ref('')

// Constants
const logoDark = '/img/dark-community-logo.svg'
const logoLight = '/img/light-community-logo.svg'
const mode = useColorMode()

// Watchers
watch(mode, (newMode) => {
  logoPath.value = newMode.value === 'dark' ? logoDark : logoLight
})

// Computed
onMounted(() => {
  logoPath.value = mode.value === 'dark' ? logoDark : logoLight
})

</script>

<template>
  <div class="relative" style="min-height: 70vh">
    <div class="absolute inset-0 pointer-events-none bg-no-repeat bg-right blur-sm"
         :style="{ backgroundImage: `url(${logoPath})`, backgroundSize: '55%'}">
    </div>

    <div class="inset-0 flex flex-col items-start px-4 mt-10">
        <div class="text-5xl font-bold mb-2 max-w-[60%]">Join the Community Today & Unlock the Daily Challenge!</div>
        <div class="text-3xl font-bold mb-4 text-primary max-w-[50%]">Compete Globally & Enjoy Other Exclusive Benefits !</div>
        <div class="text-xl  mb-10 max-w-[50%]">
          <span class="text-primary">Sign in</span> now by clicking on our <span class="text-primary">top-right corner</span> login button and elevate your gaming experience,
          track your <span class="text-primary">stats</span>, and climb the <span class="text-primary">leaderboard</span>
          to reach the <span class="text-primary">top spot</span>! Join us and let the <span class="text-primary">challenge</span> begin!
        </div>

      <div class="border border-primary border-solid rounded-lg p-4 mt-10">
        <p class="font-black text-2xl">
          Don't want to create an account ?
        </p>
        <p class="py-2 font-semibold text-xl">
          You can still enjoy <span class="text-primary">Whokipedia</span> with our <span class="text-primary">solo mode !</span>
        </p>
        <UButton to="/solo-mode" size="xl" class="text-xl" label="Play">
          Play solo
        </UButton>
      </div>
    </div>

  </div>
</template>



