<template>
  <el-form ref="dataDetail" :model="dataDetail" :rules="rules" label-width="120px">
    <el-row :gutter="10" style="padding:10px 10px;">
      <el-col :span="24" >
        <el-form-item label="MessageName" prop="messageName">
          <el-input v-model="dataDetail.messageName" :placeholder="t('tip.pleaseInput')" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="24" >
        <el-form-item label="Description" prop="description">
          <el-input v-model="dataDetail.description" :placeholder="t('tip.pleaseInput')" clearable/>
        </el-form-item>
      </el-col>
      <el-col :span="24" >
        <el-form-item label="Stream" prop="stream">
          <el-input v-model="dataDetail.stream" placeholder="0" clearable/>
        </el-form-item>
      </el-col>
      <el-col :span="24" >
        <el-form-item label="Function" prop="function">
          <el-input v-model="dataDetail.function" placeholder="0" clearable/>
        </el-form-item>
      </el-col>
      <el-col :span="24" >
        <el-form-item label="Direction">
          <el-radio-group v-model="dataDetail.direction" class="secs-item-type">
            <el-radio v-for="(item,index) in secsMessageDirectionRadioList" :label="item.label" :key="index">
              {{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24" >
        <el-form-item label="Setting">
          <el-checkbox v-model="dataDetail.wait">Wait</el-checkbox>
          <el-checkbox v-model="dataDetail.noLogging">NoLogging</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="AutoReply" prop="replyName">
          <el-checkbox v-model="dataDetail.autoReply" :disabled="autoReplyDesiabled"/>
          <el-select
            v-model="dataDetail.replyName"
            :disabled="autoReplyDesiabled||!dataDetail.autoReply"
            clearable
            filterable
            class="filter-item"
            style="width:160px;">
            <el-option v-for="(item,index) in autoReplyList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="">
          <el-button :loading="loading" type="primary" @click="saveHandler('dataDetail')">
          <svg-icon :icon-class="'setting'" /> {{ t('btn.setting') }}</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
// import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'MessageForm',
  props: {
    dataDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    messageNameList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      autoReplyList: [],
      rules: {
        // messageName: [
        //   { required: true, message: this.t('tip.pleaseInput') },
        //   { pattern: /^S\d+F((\d+_?[A-Z]*\d+)|\d+)$/, message: 'MessageName必须符合格式S[x]F[y]或者S[x]F[x]_[y](x,y为大于0的整数)！' }
        // ],
        replyName: [
          { required: true, message: this.t('tip.pleaseSelect') }
        ],
        stream: [
          { required: true, message: this.t('tip.pleaseInput') }
        ],
        function: [
          { required: true, message: this.t('tip.pleaseInput') }
        ]
      },
      secsMessageDirectionRadioList: [
        { value: 'H->E', label: 'H->E' },
        { value: 'E->H', label: 'E->H' }
      ]
    }
  },
  computed: {
    autoReplyDesiabled() {
      return this.dataDetail.function % 2 === 0
    }
  },
  watch: {
    'dataDetail.messageName'(messageName) {
      const tempArray = (messageName || '').match(/((S|F)?\d+|(_)?\S?)/g)
      if (tempArray) {
        const [tempStream, tempFunction] = tempArray.map(item => Number.parseInt(item.replace(/(S|F)?/, ''), 10))
        this.dataDetail.stream = tempStream
        this.dataDetail.function = tempFunction
        this.autoReplyList = this.messageNameList.filter(message => `${message}`.startsWith(`S${tempStream}F${tempFunction + 1}`))
      }
    },
    'dataDetail.stream'(stream) {
      const tempArray = (this.dataDetail.messageName || '').match(/((S|F)?\d+|(_)?\S?)/g)
      if (stream) {
        if (tempArray) {
          tempArray.splice(0, 1, `S${stream}`)
        }
      } else {
        if (tempArray) {
          tempArray.splice(0, 1, `S0`)
        }
      }
      this.dataDetail.messageName = tempArray.join('')
    },
    'dataDetail.function'(stream) {
      const tempArray = (this.dataDetail.messageName || '').match(/((S|F)?\d+|(_)?\S?)/g)
      if (stream) {
        if (tempArray) {
          tempArray.splice(1, 1, `F${stream}`)
        }
      } else {
        if (tempArray) {
          tempArray.splice(1, 1, `F0`)
        }
      }
      this.dataDetail.messageName = tempArray.join('')
    },
    'dataDetail.autoReply'() {
      this.updateAutoRelyValidRule()
    }
  },
  methods: {
    t,
    saveHandler(formName) {
      this.updateAutoRelyValidRule().then(() => {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // if (this.messageNameList.filter(messageName => messageName === this.dataDetail.messageName).length >= 1) {
            //   notice.error(`MessageName [${this.dataDetail.messageName}] is existenced !`)
            // } else {
            // }
            this.$emit('updateNodeEvent', this.dataDetail, 'button')
          }
        })
      })
    },
    updateAutoRelyValidRule() {
      return new Promise((resolve) => {
        if (this.dataDetail.autoReply) {
          this.rules = Object.assign({}, this.rules, {
            replyName: [
              { required: true, message: this.t('tip.pleaseSelect') }
            ]
          })
        } else {
          this.dataDetail.replyName = ''
          delete this.rules.replyName
          this.$refs.dataDetail.clearValidate(['replyName'])
        }
        resolve()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input {
    width:100%;
  }
</style>
