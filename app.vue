<script
    lang="ts"
    setup>

const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
})

</script>

<template>
  <Body
      class="bg-gray-50 dark:bg-gray-950">
  <UContainer
      class="p-10 min-h-screen">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <UTooltip
                :text="`Switch to ${isDark ? 'Light' : 'Dark'} Mode`">
              <UButton
                  :icon="isDark ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'"
                  @click="isDark = !isDark"
                  color="white"/>
            </UTooltip>
          </div>
          <div class="flex">
            <UIcon
                name="i-heroicons-magnifying-glass-16-solid"
                class="text-primary w-10 h-10"/>
            <p class="font-black text-3xl">
              Whokipedia
            </p>
          </div>

          <div>
            <ClientOnly>
              <UTooltip
                  text="Open on Github">
                <UButton
                    :to="`https://github.com/roxannecvl/whokipedia`"
                    icon="i-simple-icons-github"
                    color="white"
                    target="_blank"/>
              </UTooltip>
            </ClientOnly>
          </div>
        </div>
      </template>

      <main>
        <NuxtPage/>
      </main>

    </UCard>
  </UContainer>
  </Body>
</template>
