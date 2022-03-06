<template>
  <div class="data-table">
    <table>
      <thead>
        <tr>
          <th v-for="it of headerList" :key="it">{{ it }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) of dataList" :key="index">
          <td v-for="it of headerList" :key="it">
            {{ data[it] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  state: {
    type: Object,
  },
})

const headerList = computed(() => {
  const data0 = props.state.tableData[0]
  if (!props.state.tableData[0]) {
    return []
  }
  return Object.keys(data0)
})

const dataList = computed(() => {
  return props.state.tableData
})
</script>
