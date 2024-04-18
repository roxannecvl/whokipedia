<script lang="ts" setup>

import { type UserStore, useUserStore } from "./model/UserModel";
import LoginSignupPresenter from "~/presenters/LoginSignupPresenter.vue";
import StatisticsPresenter from "~/presenters/StatisticsPresenter.vue";
import LeaderboardPresenter from "~/presenters/LeaderboardPresenter.vue";

// Set up user model
const store: UserStore = useUserStore()

// Constants
const logoPath = '/img/logo-primary-filled.svg';

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
        <div class="flex justify-between items-center " style="max-height: 3vh">
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
              <img :src="logoPath" alt="logo" class="w-9 h-9 mx-auto"/>
              <p class="font-black text-3xl hidden sm:block select-none">Whokipedia</p>
            </div>
          </a>
          <div class="flex justify-between items-center">
            <div class="p-3"><LeaderboardPresenter /></div>
            <div class="p-3"><StatisticsPresenter :model="store"/></div>
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
