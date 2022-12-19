<template>
  <div class="markdown-body" v-html="html"></div>
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
  private version = process.env.VUE_APP_VERSION

  get html (): string {
    return converter.makeHtml(help.replace('{{ version }}', this.version))
  }
}
</script>
