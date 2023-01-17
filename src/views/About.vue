<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import about from '@/docs/about.md'
import showdown from 'showdown'
import { Getter } from 'vuex-class'

const converter = new showdown.Converter()
converter.setOption('tables', true)
converter.setOption('tasklists', true)

@Component
export default class Setting extends Vue {
  @Getter('version')
  private version!: string

  // private version = process.env.VUE_APP_WEB_VERSION

  get html (): string {
    return converter.makeHtml(about.replace('{{ version }}', this.version))
  }

  created () {
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLLinkElement
      if (target && target?.tagName === 'A') {
        e.preventDefault()
        window.open(target.href, '_blank')
      }
    })
  }

  destroyed () {
    document.removeEventListener('click', () => null)
  }
}
</script>
