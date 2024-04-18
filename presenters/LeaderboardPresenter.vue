<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllUserFromFirebase, type UserPersistence } from "~/model/FirebaseModel.js"
import LeaderboardView from "~/views/LeaderboardView.vue"

// Refs
const usersData = ref([] as UserPersistence[])

// Constants
const user = useCurrentUser()

// Functions
async function loadData () {
    getAllUserFromFirebase().then((data) => {
        const sortedUserData = data.sort((a: UserPersistence, b: UserPersistence) => (a.averageRank - b.averageRank))
        sortedUserData
            .filter((item: UserPersistence) => item.username === user.value?.displayName)
            .map((item: UserPersistence) => item.class = 'border-solid border-2 border-primary')
        usersData.value = sortedUserData
    }).catch(err => console.log(err))
}

onMounted(loadData)
</script>

<template>
    <LeaderboardView :usersData="usersData" :displayName="user?.displayName ?? ''"/>
</template>