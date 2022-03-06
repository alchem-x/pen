<template>
  <button class="pen-button" :disabled="disabled" @click="onInternalClick">
    <slot></slot>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  onClick: {
    type: Function,
    default: () => undefined,
  },
})

const disabled = ref(false)

async function onInternalClick() {
  try {
    disabled.value = true
    await props.onClick?.()
  } finally {
    disabled.value = false
  }
}
</script>
