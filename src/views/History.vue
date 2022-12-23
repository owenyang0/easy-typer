<template>
  <div id="home">
    <el-container>
      <el-aside width="200px">
        <IndicatorSimple />
      </el-aside>
      <el-main id="home-main" :style="styles">
        <div>
          <el-row>
            <el-col :span="24">
              <Achievements />
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import IndicatorSimple from '@/components/IndicatorSimple.vue'
import Achievements from '@/components/Achievements.vue'
// import { namespace } from 'vuex-class'

// const setting = namespace('setting')

@Component({
  components: {
    IndicatorSimple,
    Achievements
  }
})
export default class History extends Vue {}
</script>
