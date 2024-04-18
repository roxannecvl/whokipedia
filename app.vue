<script lang="ts" setup>
import { type UserStore, useUserStore } from "./model/UserModel";
import HeaderPresenter from "~/presenters/HeaderPresenter.vue";

// Set up user model
const store: UserStore = useUserStore()
</script>

<template>
  <Body class="bg-gray-50 dark:bg-gray-950 h-full">
  <UContainer class="p-0 sm:py-5">
    <UCard :ui="{ rounded: 'rounded-none sm:rounded-lg' }">
      <template #header>
        <HeaderPresenter :model="store"/>
      </template>
      <main>
        <NuxtPage :userModel="store"/>
      </main>
      <UNotifications />
    </UCard>
    <UNotifications />
  </UContainer>
  </Body>
</template>
