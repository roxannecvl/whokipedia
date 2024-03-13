<template>
  <div>
    {{ message }}
    {{ average }}
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { Utils } from "~/utilities/Utils";

export default defineComponent({
  props: {
    message: String,
    n1: Number,
    n2: Number
  },
  setup(props) {
    const average = computed(() => Utils.getAverage(props.n1, props.n2));
    return { average };
  }
})
</script>