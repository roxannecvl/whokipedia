<script
    setup
    lang="tsx">

import StatisticsView
  from "~/views/statisticsView.vue";
import {
  UserModel
} from "~/model/UserModel";
import { useCurrentUser } from "vuefire";

const user = useCurrentUser()
const userModel = user.value ? new UserModel(user.value.uid) : null

</script>

<template>
  <div class="flex justify-between">
    <div>
      <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
        <ULink
            to="/">
          Go to home
        </ULink>
      </div>
    </div>
        <StatisticsView
          :userModel
      />
    </div>
</template>