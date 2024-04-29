<script setup lang="ts">
import WelcomePagePresenter from "~/presenters/WelcomePagePresenter.vue"
import { type UserStore, useUserStore } from "~/model/UserModel";


// Props
const props = defineProps({
  userModel: {
    type: Object as () => UserStore,
    required: true,
  },
})

</script>

<template>
  <div ><WelcomePagePresenter :userModel="userModel"/></div>
</template>
