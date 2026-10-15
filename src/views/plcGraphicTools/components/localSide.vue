<template>
  <div class="local-side-container">
    <el-card :hoverable="false" class="box-card" shadow="hover">
      <div slot="header" class="box-header">
        <span class="header-title">
          <span :style="bitStyle" class="signal" />{{ `${block.type||''} [BitStartAddress:${block.eventBlock.bitStartAddress||''} WordStartAddress:${block.eventBlock.wordStartAddress||''}] BlockName:${block.eventBlock.name||''}` }}
        </span>
        <div class="header-action">
          <el-checkbox v-if="block.type==='Local Side'" :disabled="simulatorType==='bcEventList'" v-model="autoReply">Auto Reply</el-checkbox>
          <el-checkbox v-if="block.type==='Special'" :disabled="simulatorType==='bcEventList'" v-model="specialSend">Send</el-checkbox>
          <el-button-group>
            <el-button :disabled="simulatorType==='bcEventList'" type="primary" @click="initHandler">Init</el-button>
            <el-button :disabled="simulatorType==='bcEventList'" type="primary" @click="sendHandler">Send</el-button>
          </el-button-group>
        </div>
      </div>
      <el-row :gutter="10">
        <el-form
          :disabled="simulatorType==='bcEventList'"
          label-position="top">
          <el-col
            v-for="(item,index) in (block.eventBlock||{}).items||[]"
            :key="index"
            :lg="6"
            :md="8"
            :sm="12"
            style="height:74px;"
          >
            <div v-if="item.constantItems" :key="index">
              <component :is="'input-select'" :key="index" :data="item" @componentEvent="componentForSelectHandler" />
            </div>
            <div v-else :key="index">
              <component :key="index" :is="item.type" :data="item" @componentEvent="componentHandler"/>
            </div>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { updateitemvalueintoplc } from '@/api/plcGraphicTools'
import components from './property'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'LocalSide',
  components: { ...components },
  props: {
    simulatorType: {
      type: String,
      default: 'eqEventList'
    },
    block: {
      type: Object,
      default() {
        return {
          lineId: '',
          eqpName: '',
          name: '',
          type: '',
          eventBlock: {
            name: '',
            items: [],
            bitStartAddress: '',
            wordStartAddress: ''
          }
        }
      }
    },
    sendBlock: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      autoReply: false,
      specialSend: false,
      autoReplyFormServer: false,
      bitStyle: {
        'background-color': 'rgb(133, 128, 128)'
      }
    }
  },
  computed: {
    disabled() {
      return (
        this.simulatorType === 1 ||
        (((this.block || {}).eventBlock || {}).items || []).length === 0
      )
    },
    ...mapState({
      wordValueRead: state => state.socket.data.socket_publishWordValueRead,
      bitValueChanged: state => state.socket.data.socket_publishBitValueChanged
    })
  },
  watch: {
    specialSend() {
      if (this.specialSend) {
        this.$emit('localSideEvent', 'sendSpecialBlock')
      } else {
        this.$emit('localSideEvent', 'noSendSpecialBlock')
      }
    },
    block() {
      this.autoReplyFormServer = this.block.autoReply
      if (this.block.eventBlock && this.block.eventBlock.bitValue) {
        switch (this.block.eventBlock.bitValue) {
          case '1':
            this.bitStyle = {
              'background-color': 'rgb(61, 182, 5)'
            }
            break
          default:
            this.bitStyle = {
              'background-color': 'rgb(133, 128, 128)'
            }
        }
      } else {
        this.bitStyle = {
          'background-color': 'rgb(133, 128, 128)'
        }
      }
    },
    bitValueChanged() {
      if (
        this.bitValueChanged.equipmentNo === this.block.eqpName &&
        this.sendBlock.name === this.bitValueChanged.itemName &&
        this.autoReply && this.bitValueChanged.itemValue === '1' &&
        this.autoReplyFormServer && this.block.type === 'Local Side'
      ) {
        this.sendHandler()
      }
      if (
        this.bitValueChanged.blockName === this.block.bitBlock &&
        this.bitValueChanged.itemName === this.block.bitItem &&
        this.bitValueChanged.equipmentNo === this.block.eqpName
      ) {
        switch (this.bitValueChanged.itemValue) {
          case '1':
            this.bitStyle = {
              'background-color': 'rgb(61, 182, 5)'
            }
            break
          default:
            this.bitStyle = {
              'background-color': 'rgb(133, 128, 128)'
            }
        }
      }
    },
    wordValueRead() {
      if (
        this.block.eqpName === this.wordValueRead.eqpName &&
        this.block.eventBlock.name === this.wordValueRead.name
      ) {
        if (this.wordValueRead.items) {
          if (this.wordValueRead.items.length === 1 && this.wordValueRead.items[0].type === 'BIT') {
            if (this.wordValueRead.items[0].name === this.block.eventBlock.items[0].name) {
              this.block.eventBlock.items = this.wordValueRead.items
            }
          } else {
            this.block.eventBlock.items.forEach(blockItem => {
              this.wordValueRead.items.forEach(wordItem => {
                if (blockItem.name === wordItem.name) {
                  blockItem = Object.assign(blockItem, {
                    offset: wordItem.offset,
                    points: wordItem.points,
                    type: wordItem.type,
                    value: wordItem.value
                  })
                }
              })
            })
          }
        } else {
          this.block.eventBlock = { items: [] }
        }
      }
    }
  },
  created() {
    this.autoReply = this.specialSend = this.simulatorType === 'eqEventList'
    if (this.specialSend) {
      this.$emit('localSideEvent', 'sendSpecialBlock')
    } else {
      this.$emit('localSideEvent', 'noSendSpecialBlock')
    }
  },
  methods: {
    initHandler() {
      this.block.eventBlock.items.forEach(item => {
        if (item.constantItems) {
          item.value = `${item.constantItems[0].key}`
        } else {
          switch (item.type) {
            case 'BCD':
              item.value = dayjs().format('MMYYHHDDssmm')
              break
            case 'I':
              item.value = 0
              break
            case 'BIT':
              item.value = '0'
              break
            default:
              item.value = '1'
              break
          }
        }
      })
    },
    sendHandler() {
      this.$emit('localSideEvent', 'sendHandler')
      const temp = []
      const isEqSimulator = this.simulatorType === 'eqEventList' ? '0' : '1'
      this.block.eventBlock.items.forEach(item => {
        temp.push({
          privateName: item.name,
          strValue: item.value
        })
      })
      return updateitemvalueintoplc({
        lineName: this.block.lineId,
        isEqSimulator: isEqSimulator,
        plcBlockBean: {
          eqpNo: this.block.eqpName,
          blocks: [
            {
              prefix: this.block.eventBlock.prefix,
              privateName: this.block.eventBlock.name,
              privateEQPName: this.block.eqpName,
              itemCollection: temp
            }
          ]
        }
      }).then(res => {})
    },
    componentHandler($event) {
      this.sendHandler()
    },
    componentForSelectHandler($event) {
      this.block.eventBlock.items.forEach(item => {
        if (item.name === 'CassetteControlCommand' && item.value === '11') {
          this.$emit('localSideEvent', 'localSide')
        }
      })
    }
  }
}
</script>
<style lang="scss">
.local-side-container {
  padding:10px;
  .el-input,
  .el-input-number,
  .el-select {
    width: 100%;
  }
  .el-form-item__label{
    padding:0;
  }
  .el-card__header {
    padding: 10px;
  }

  .box-card {
    .box-header {
      line-height: 35px;
      overflow: hidden;

      .header-title {
        float: left;
        padding: 0 15px;
      }

      .header-action {
        float: right;
        padding: 0 15px;
        text-align: right;
      }
    }

    .signal {
      display: inline-block;
      width: 25px;
      height: 25px;
      margin-right: 10px;
      vertical-align: -7px;
      border: 5px double #e3e3e3;
      border-radius: 50%;
    }
  }
}
</style>
