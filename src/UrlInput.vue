<template>
  <input
    type="text"
    class="pen-input"
    :style="style"
    placeholder="输入查询URL"
    :value="value"
    :title="value"
    @input="onInput($event.target.value)"
    @focus="inputting = true"
    @blur="inputting = false"
  />
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  value: {
    type: String,
  },
  onInput: {
    type: Function,
    default: () => undefined,
  },
})

const inputting = ref(false)
const style = computed(() => {
  if (inputting.value) {
    return 'width: 240px;'
  } else {
    return 'width: 120px;'
  }
})
</script>
