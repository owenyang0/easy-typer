<template>
  <div class="page-content pro-module-bd markdown-body" v-html="html"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import help from '@/docs/help.md'
import showdown from 'showdown'

const converter = new showdown.Converter()
converter.setOption('tables', true)
converter.setOption('tasklists', true)

@Component
export default class Setting extends Vue {
  get html (): string {
    return converter.makeHtml(help)
  }
}
</script>
