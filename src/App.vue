<template>
  <div class="container" :class="state.ready ? 'opacity-100' : 'opacity-0'">
    <Header :state="state" :is-query-mode="isQueryMode" />
    <main class="main" ref="mainRef">
      <Editor :state="state" />
      <template v-if="isQueryMode">
        <div @mousedown="startResize" class="divider"></div>
        <DataTable :state="state" />
      </template>
    </main>
  </div>
</template>

<script setup>
import { reactive, watch, computed, ref, onMounted } from 'vue'
import { getContentValue, getLanguage, updateContentValue } from './urlSearchParams.js'
import Editor from './Editor.vue'
import Header from './Header.vue'
import DataTable from './DataTable.vue'
import { LANGUAGE_TYPE } from './language.js'
import { getSqlQueryUrl, saveSqlQueryUrl } from './sql.js'
import { debounce } from './schedule.js'
import { isMobile } from './ua.js'

const state = reactive({
  ready: false,
  language: getLanguage(),
  contentValue: getContentValue(),
  selectedContentValue: '',
  sqlQueryUrl: getSqlQueryUrl(),
  tableData: [],
})

const mainRef = ref()

const isQueryMode = computed(() => {
  if (isMobile()) {
    return false
  }
  return state.language === LANGUAGE_TYPE.SQL
})

function initializeEditorContainerHeight() {
  const mainClientHeight = mainRef.value.clientHeight
  if (isQueryMode.value) {
    const editorContainerHeight = mainClientHeight * 0.6
    mainRef.value.style.setProperty('--editor-container-height', editorContainerHeight + 'px')
  } else {
    mainRef.value.style.setProperty('--editor-container-height', mainClientHeight + 'px')
  }
}

onMounted(() => {
  initializeEditorContainerHeight()
  window.addEventListener('resize', initializeEditorContainerHeight)
})

watch(
  () => state.contentValue,
  debounce((val) => {
    updateContentValue(val)
  }, 100),
)

watch(
  () => state.sqlQueryUrl,
  debounce((val) => {
    saveSqlQueryUrl(val)
  }, 100),
)

function startResize(ev) {
  const prevY = ev.y
  const editorContainerHeight = parseFloat(mainRef.value.style.getPropertyValue('--editor-container-height'))

  const MARGIN = 36

  function mousemove(ev) {
    const newY = prevY - ev.y
    const newEditorContainerHeight = editorContainerHeight - newY
    if (newEditorContainerHeight < MARGIN || newEditorContainerHeight + MARGIN > mainRef.value.clientHeight) {
      return
    }
    mainRef.value.style.setProperty('--editor-container-height', newEditorContainerHeight + 'px')
  }

  function mouseup() {
    window.removeEventListener('mousemove', mousemove)
    window.removeEventListener('mouseup', mouseup)
  }

  window.addEventListener('mousemove', mousemove)
  window.addEventListener('mouseup', mouseup)
}
</script>
