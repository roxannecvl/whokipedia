<script setup lang="ts">
import WelcomePagePresenter from "~/presenters/WelcomePagePresenter.vue"
import { type UserStore, useUserStore } from "~/model/UserModel";

// Model
const userModel: UserStore = useUserStore()

</script>

<template>
  <div ><WelcomePagePresenter :userModel="userModel"/></div>
</template>
