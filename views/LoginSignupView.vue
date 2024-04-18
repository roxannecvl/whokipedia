<script setup lang="ts">
import SignupView from "~/views/SignupView.vue";
import LoginView from "~/views/LoginView.vue";

//Props
const props = defineProps({
  isUserLoggedIn: {
    type : Boolean,
    required : true,
  },
  isLogInOpen: {
    type : Boolean,
    required : true,
  },

})

// Emits
const emit = defineEmits(['login-event-bis', 'signup-event-bis', 'logout-event', 'open-login', 'close-login'])
const isModalOpen = ref(false);

//watchers
watch(() => props.isLogInOpen, (newValue) => {
  isModalOpen.value = newValue;
});

watch(isModalOpen, () => {
  setTimeout(() => {
    if(!isModalOpen.value) {
      emit('close-login');
    }
  }, 50);
});

</script>

<template>
  <UButton v-if="isUserLoggedIn" label="Log out" @click="emit('logout-event')"/>
  <UButton v-else label="Log in" @click="emit('open-login')" />
  <UModal v-model="isModalOpen">
    <div class="p-4">
      <div class="flex justify-center">
        <div class="w-60 ">
          <UTabs :items="[{ key: 'login', label: 'Log in' },  { key: 'signup', label: 'Sign up' }]">
            <template #item="{ item }">
              <div v-if="item.key === 'login'">
                <LoginView @login-event="(email, password) => emit('login-event-bis', email, password)"/>
              </div>
              <div v-else-if="item.key === 'signup'">
                <SignupView @signup-event="
                (email, username, password) => emit('signup-event-bis', email, username, password)"/>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </div>
  </UModal>
</template>