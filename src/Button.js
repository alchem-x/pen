import { ref } from 'vue'

export default {
    template: `
      <button class="pen-button" :disabled="disabled" @click="onInternalClick">
      <slot></slot>
      </button>
    `,
    props: {
        onClick: {
            type: Function,
            default: () => undefined,
        }
    },
    setup(props) {
        const disabled = ref(false)

        async function onInternalClick() {
            try {
                disabled.value = true
                await props.onClick?.()
            } finally {
                disabled.value = false
            }
        }

        return {
            disabled,
            onInternalClick,
        }
    }
}