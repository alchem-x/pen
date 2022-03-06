<template>
  <header class="header">
    <div class="title">
      <a class="no-underline whitespace-nowrap" :href="indexUrl">
        <strong class="color-black select-none text-base">Pen</strong>
      </a>
      <a class="no-underline whitespace-nowrap" :href="ghUrl" target="_blank">
        <strong class="color-black select-none text-base">GitHub</strong>
      </a>
    </div>
    <div class="flex items-center" style="gap: 8px">
      <UrlInput v-if="isQueryMode" :value="state.sqlQueryUrl" :on-input="onSqlQueryUrlInput" />
      <Button v-if="showOpenFileButton" style="width: 60px" :on-click="openFile">打开</Button>
      <Button v-if="showRunButton" style="width: 60px" :on-click="run">运行</Button>
      <Button v-if="showSaveButton" style="width: 60px" :on-click="saveToFile">保存</Button>
      <Select style="width: 100px" :value="state.language" :options="languageOptions" :on-change="onLanguageChange" />
    </div>
  </header>
</template>

<script setup>
import { getFileExtension, LANGUAGE_TYPE, languageOptions } from './language.js'
import { changeLanguage } from './urlSearchParams.js'
import runJs from './runJs.js'
import Select from './Select.vue'
import Button from './Button.vue'
import UrlInput from './UrlInput.vue'
import { querySql } from './sql.js'
import { readAsText } from './file.js'
import { computed } from 'vue'
import { saveAs } from 'file-saver'

const props = defineProps({
  state: {
    type: Object,
  },
  isQueryMode: {
    type: Boolean,
    default: () => false,
  },
})

function onSqlQueryUrlInput(ev) {
  props.state.sqlQueryUrl = ev.trim()
}

const showOpenFileButton = computed(() => {
  return !props.state.contentValue
})

const showSaveButton = computed(() => {
  return props.state.contentValue
})

const showRunButton = computed(() => {
  if (!props.state.contentValue) {
    return false
  }
  if (props.isQueryMode) {
    return true
  }
  return [LANGUAGE_TYPE.JAVASCRIPT].includes(props.state.language)
})

function onLanguageChange(ev) {
  if (ev !== props.state.language) {
    changeLanguage(ev)
  }
}

function openFile(ev) {
  const inputRef = document.createElement('input')
  inputRef.type = 'file'
  inputRef.addEventListener('change', async (ev) => {
    const file = ev.target.files[0]
    if (!file) {
      return
    }
    props.state.contentValue = await readAsText(file)
    inputRef.remove()
  })
  document.body.appendChild(inputRef)
  inputRef.click()
}

function runJavaScript() {
  runJs(props.state.contentValue, true)
}

async function runSqlQuery() {
  try {
    props.state.tableData = [
      {
        ['提示']: '<查询中...>',
      },
    ]
    const result = await querySql(props.state.sqlQueryUrl, props.state.selectedContentValue || props.state.contentValue)
    if (!result || !result.length) {
      props.state.tableData = [
        {
          ['结果']: '<空>',
        },
      ]
    } else {
      props.state.tableData = result
    }
  } catch (err) {
    props.state.tableData = [
      {
        ['错误']: err.message,
      },
    ]
  }
}

function run() {
  switch (props.state.language) {
    case LANGUAGE_TYPE.JAVASCRIPT:
      return runJavaScript()
    case LANGUAGE_TYPE.SQL:
      return runSqlQuery()
    default:
      return
  }
}

function saveToFile() {
  const content = props.state.contentValue?.toString()
  const fileBlob = new Blob([content])
  const filename = `${new Date().toISOString()}.${getFileExtension(props.state.language)}`
  saveAs(fileBlob, filename)
}

const indexUrl = location.pathname.startsWith('/pen/') ? '/pen/' : '/'
const ghUrl = 'https://github.com/alchem-x/pen'
</script>
