<script setup lang="ts">

import { type UserStore, useUserStore } from "~/model/UserModel";
import StatisticsPresenter from "~/presenters/StatisticsPresenter.vue";

const store: UserStore = useUserStore()

</script>

<template>
    <StatisticsPresenter :model="store" />
</template>