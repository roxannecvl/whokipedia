<script lang="ts" setup>
import { type UserStore, useUserStore } from "./model/UserModel"
import HeaderPresenter from "~/presenters/HeaderPresenter.vue"

// Set up user model
const store: UserStore = useUserStore()
</script>

<template>
  <Body class="bg-gray-50 dark:bg-gray-950">
  <UContainer class="p-0 sm:py-5 h-screen">
    <UCard
      :ui="{
        base: 'flex flex-col h-full',
        rounded: 'rounded-none sm:rounded-lg',
        body: {
          base: 'h-full overflow-clip',
        }
      }"
    >
      <template #header>
        <HeaderPresenter :model="store"/>
      </template>
       <main class="flex h-full">
        <NuxtPage :userModel="store"/>
      </main>
      <UNotifications />
    </UCard>
    <UNotifications />
  </UContainer>
  </Body>
</template>
