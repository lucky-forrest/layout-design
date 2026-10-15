<template>
  <div class="custom-field">
    <el-input v-if="['A','AS','BCD'].includes(field.type)" :disabled="['JobId'].includes(field.name)" v-model="value" clearable />
    <el-input-number
      v-if="['I','BIN'].includes(field.type)&&!Array.isArray(field.constantItems)"
      :disabled="['CassetteSequenceNo','JobSequenceNo'].includes(field.name)"
      v-model="value"
      :presicion="0"
      controls-position="right" />
    <el-input v-if="field.type==='B'" v-model="value" :maxlength="(field.points === 0) ? 1 : field.points * 16" :disabled="field.points !== '0'" clearable>
      <el-button v-if="field.points !== '0'" slot="append" icon="el-icon-edit" style="margin: 1px -22px 0px -22px;" @click="() => showDetailForTypeB = true"/>
    </el-input>
    <el-select v-if="Array.isArray(field.constantItems)" v-model="value">
      <el-option v-for="(sItem,sIndex) in field.constantItems" :key="sIndex" :value="sItem.key" >
        {{ `${sItem.key}: ${sItem.description}` }}
      </el-option>
    </el-select>
    <el-dialog
      :visible.sync="showDetailForTypeB"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="600px"
      top="10vh"
      title="Setting"
      append-to-body>
      <DetailForTypeB v-if="showDetailForTypeB" :data="field" @successEvent="successEvent" @cancelEvent="() => showDetailForTypeB = false"/>
    </el-dialog>
  </div>
</template>
<script>
import DetailForTypeB from './detailForTypeB'
export default {
  name: 'CustomField',
  components: { DetailForTypeB },
  props: {
    field: {
      type: Object,
      required: true
    },
    jobData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDetailForTypeB: false,
      minValueForZero: [
        'RTCFlag',
        'JobJudge',
        'RecipeGroupEndFlag',
        'MainEQInFlag',
        'FirstRunFlag',
        'LastGlassFlag',
        'OXRInformationRequestFlag',
        'SubstrateType',
        'SamplingSlotFlag',
        'CIMMode',
        'CSTOperationMode'
      ],
      maxValueForOne: {
        SamplingSlotFlag: 1,
        FirstRunFlag: 1,
        LastGlassFlag: 1,
        OXRInformationRequestFlag: 1,
        CIMMode: 1,
        RecipeGroupEndFlag: 1,
        MainEQInFlag: 1,
        CSTOperationMode: 1,
        SubstrateType: 3,
        JobType: 7,
        JobJudge: 14,
        RTCFlag: 1
      }
    }
  },
  computed: {
    value: {
      get() {
        return this.jobData[this.field.name]
      },
      set(val) {
        this.jobData[this.field.name] = `${val}`
      }
    }
  },
  methods: {
    successEvent($event) {
      this.jobData[this.field.name] = $event
      this.showDetailForTypeB = false
    }
  }
}
</script>
<style lang="scss">
  .custom-field{
    .el-input,
    .el-input-number,
    .el-select,
    .el-input-number--mini {
      width:100%;
    }
  }
</style>
