<script setup lang="ts">
import LeaderboardView from "~/views/LeaderboardView.vue";
import { getAllUserFromFirebase } from "~/model/FirebaseModel.js";
import { ref, onMounted } from 'vue';


const usersData = ref([]);
const user = useCurrentUser();
const loadData = async () => {
    getAllUserFromFirebase().then((data) => {
        const sortedUserData = data;
        if (user.value){
            sortedUserData.filter((item) => item.uid === user.value.uid).map((item) => item.class = 'border-solid border-2 border-primary');
        }
        usersData.value = sortedUserData;
    }).catch((err) => {
        console.log(err);
    });
};

onMounted(loadData);
</script>

<template>
    <LeaderboardView :usersData="usersData" :displayName="user?.displayName ?? ''"/>
</template>