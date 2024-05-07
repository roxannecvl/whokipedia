<script lang="ts" setup>
import { initializeFirebase } from "~/utilities/Firebase"
import HeaderPresenter from "~/presenters/HeaderPresenter.vue"

// Set up authentication
initializeFirebase()
</script>

<template>
  <NuxtLoadingIndicator color="orange"/>
  <Body class="bg-gray-50 dark:bg-gray-950">
  <UContainer class="p-0 sm:py-5 sm:h-screen overflow-x-hidden">
    <UCard
      :ui="{
        base: 'flex flex-col h-full',
        rounded: 'rounded-none sm:rounded-lg',
        body: {
          base: 'h-full sm:overflow-clip',
        }
      }">
      <template #header>
        <HeaderPresenter/>
      </template>
       <main class="flex sm:h-full sm:overflow-y-auto justify-center">
        <NuxtPage/>
      </main>
      <UNotifications />
    </UCard>
    <UNotifications />
  </UContainer>
  </Body>
</template>
