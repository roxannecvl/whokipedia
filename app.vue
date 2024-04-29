<script lang="ts" setup>
import { type UserStore, useUserStore } from "./model/UserModel"
import HeaderPresenter from "~/presenters/HeaderPresenter.vue"
import {readUserFromFirebase} from "~/model/FirebaseModel";

// Set up user model
const store: UserStore = useUserStore()
</script>

<template>
  <NuxtLoadingIndicator/>
  <Body class="bg-gray-50 dark:bg-gray-950">
  <UContainer class="p-0 sm:py-5 sm:h-screen">
    <UCard
      :ui="{
        base: 'flex flex-col h-full',
        rounded: 'rounded-none sm:rounded-lg',
        body: {
          base: 'h-full sm:overflow-clip',
        }
      }">
      <template #header>
        <HeaderPresenter :userModel="store"/>
      </template>
       <main class="flex sm:h-full sm:overflow-y-auto justify-center">
        <NuxtPage :userModel="store"/>
      </main>
      <UNotifications />
    </UCard>
    <UNotifications />
  </UContainer>
  </Body>
</template>
