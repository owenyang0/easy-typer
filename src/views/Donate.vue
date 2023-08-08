<template>
  <div class="page-content pro-module-bd markdown-body" v-html="html"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import donate from '@/docs/donate.md'
import showdown from 'showdown'

const converter = new showdown.Converter()
converter.setOption('tables', true)
converter.setOption('tasklists', true)

@Component
export default class Setting extends Vue {
  get html (): string {
    return converter.makeHtml(donate)
  }
}
</script>

<style scoped>
.markdown-body table th {
  text-align: left;
}
</style>
