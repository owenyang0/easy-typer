<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import changelog from '@/docs/changelog.md'
import showdown from 'showdown'

const converter = new showdown.Converter()
converter.setOption('tables', true)
converter.setOption('tasklists', true)

@Component
export default class Setting extends Vue {
  get html (): string {
    return converter.makeHtml(changelog)
  }
}
</script>
