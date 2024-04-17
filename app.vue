<script lang="ts" setup>

import { type UserStore, useUserStore } from "./model/UserModel";
import LoginSignupPresenter from "~/presenters/LoginSignupPresenter.vue";

// Set up user model
const store: UserStore = useUserStore()

// Set up color mode
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
})

const user = useCurrentUser()

</script>

<template>
  <Body class="bg-gray-50 dark:bg-gray-950 h-full">
  <UContainer class="p-0 sm:py-5">
    <UCard :ui="{ rounded: 'rounded-none sm:rounded-lg' }">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <ClientOnly>
              <UTooltip :text="`Switch to ${isDark ? 'Light' : 'Dark'} Mode`">
                <UButton
                    :icon="isDark ? 'i-heroicons-moon-solid' : 'i-heroicons-sun-solid'"
                    @click="isDark = !isDark"
                    color="white"/>
              </UTooltip>
            </ClientOnly>
          </div>
          <a href="/">
            <div class="flex">
              <UIcon name="i-heroicons-magnifying-glass-16-solid" class="text-primary w-10 h-10 hidden sm:block"/>
              <p class="font-black text-3xl hidden sm:block select-none">Whokipedia</p>
            </div>
          </a>
          <div class="flex justify-between items-center">
            <div><UButton @click="navigateTo('/statistics')" :disabled="!user">Statistics</UButton></div>
            <div class="p-3"><LoginSignupPresenter :model="store"/></div>
            <div class="p-3">
              <ClientOnly>
                <UTooltip text="Open on Github">
                  <UButton
                      :to="`https://github.com/roxannecvl/whokipedia`"
                      icon="i-simple-icons-github"
                      color="white"
                      target="_blank"/>
                </UTooltip>
              </ClientOnly>
            </div>
          </div>
        </div>
      </template>

      <main>
        <NuxtPage/>
      </main>

      <UNotifications />

    </UCard>
    <UNotifications />
  </UContainer>
  </Body>
</template>
