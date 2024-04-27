<script setup lang="ts">
import WelcomePagePresenter from "~/presenters/WelcomePagePresenter.vue"
import { type UserStore, useUserStore } from "~/model/UserModel";

// Store
const userStore: UserStore = useUserStore()
</script>

<template>
  <div ><WelcomePagePresenter :userModel="userStore"/></div>
</template>
