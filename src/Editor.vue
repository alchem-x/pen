<template>
  <div ref="editorContainerRef" class="editor-container" />
</template>

<script setup>
import { editor as MonacoEditor } from 'monaco-editor'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  state: {
    type: Object,
  },
})

const editorContainerRef = ref()

let editor

watch(
  () => props.state.contentValue,
  (val) => {
    if (!editor || editor.getModel().getValue() === val) {
      return
    }
    editor.getModel().setValue(val)
  },
)

onMounted(() => {
  editor = MonacoEditor.create(editorContainerRef.value, {
    value: props.state.contentValue,
    language: props.state.language,
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    unicodeHighlight: {
      ambiguousCharacters: false,
    },
  })

  editor.getModel().onDidChangeContent((ev) => {
    const newVal = editor.getModel().getValue() || ''
    if (props.state.contentValue !== newVal) {
      props.state.contentValue = newVal
    }
  })

  editor.onDidChangeCursorSelection((ev) => {
    props.state.selectedContentValue = editor.getModel().getValueInRange(ev.selection)
  })

  props.state.ready = true
})
</script>
