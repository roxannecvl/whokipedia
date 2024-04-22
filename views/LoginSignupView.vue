<script setup lang="ts">
import SignupView from "~/views/SignupView.vue"
import LoginView from "~/views/LoginView.vue"

//Props
const props = defineProps({
  close: {
    type : Boolean,
    required : true,
  },
  error:{
    type : String,
    required :true,
  }
})

// Emits
const emit = defineEmits(['login-event-bis', 'signup-event-bis', 'logout-event'])

// Refs
const ready = ref(false)
const isModalOpen = ref(false)

// Constants
const user = useCurrentUser()
const toast = useToast()

// Functions
onMounted(() => { ready.value = true })

/**
 * Displays an error notification
 *
 * @param description - The description of the error
 */
function displayErrorNotification(description: string) {
  toast.remove('any')
  toast.add({ id:'any', title: 'Error', description: description, icon: 'i-heroicons-x-circle', color:"red"})
}

//watchers
watch(() => props.close, () => {
  if(props.close) isModalOpen.value = false
})

watch(() => props.error, (newValue) => {
  if(newValue !== "") displayErrorNotification(newValue)
})
</script>

<template>
  <div v-if="ready">
    <UButton v-if="user" icon="i-heroicons-arrow-left-start-on-rectangle-16-solid" @click="emit('logout-event')">
      <span class="hidden md:inline">Log out</span>
    </UButton>
    <UButton v-else icon="i-heroicons-arrow-right-end-on-rectangle-16-solid" @click="isModalOpen = true">
      <span class="hidden md:inline">Log in</span>
    </UButton>
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
  </div>
</template>