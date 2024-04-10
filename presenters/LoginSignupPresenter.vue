<script setup lang="ts">
import { UserModel } from "~/model/UserModel";
import LoginSignupView from "~/views/LoginSignupView.vue";

const props = defineProps({
  userModel: {
      type: UserModel,
      required: true,
  },
})
</script>

<template>
  <LoginSignupView :userModel=props.userModel />
</template>
