<template>
  <div class="local-side-container">
    <fieldset class="fieldset">
      <legend v-if="legendString==='Alive Auto Change'" style="padding:0px 10px">
        <el-tooltip content="EquipmentAlive" placement="top-start" >
          <el-switch
            v-model="equipmentAlive"
            :disabled="simulatorType==='bcEventList'"
            :active-value="1"
            :inactive-value="0"
            active-color="green"
            inactive-color="red"
            @change="changeHandler"/>
        </el-tooltip>&nbsp;{{ legendString }}
      </legend>
      <legend v-else>&nbsp;{{ legendString }}</legend>
      <div class="fieldset-content">
        <div v-for="(item,index) in block" v-show="item.eventBlock&&item.eventBlock.items?true:false" :key="index" class="switch-item">
          <el-switch
            v-model="(((item.eventBlock||{}).items||[])[0]||{}).value"
            :disabled="simulatorType==='bcEventList'"
            :active-value="'1'"
            :inactive-value="'0'"
            active-color="green"
            inactive-color="red"
            @change="sendHandler(item)"/>&nbsp;{{ (((item.eventBlock||{}).items||[])[0]||{}).name }}
        </div>
      </div>
    </fieldset>
  </div>
</template>
<script>
import { startEquipmentAlive } from '@/api/plcSimulator'
import { sendPlcCommand } from '@/api/plcSimulator'
import { mapState } from 'vuex'
export default {
  name: 'EquipmentStatusSide',
  props: {
    simulatorType: {
      type: String,
      default: 'eqEventList'
    },
    shopFilter: {
      type: Object,
      default() {
        return {}
      }
    },
    block: {
      type: Array,
      default() {
        return []
      }
    },
    legendString: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      equipmentAlive: 1
    }
  },
  computed: {
    ...mapState({
      bitValueChanged: state => state.socket.data.socket_publishBitValueChanged
    })
  },
  watch: {
    bitValueChanged() {
      if (this.bitValueChanged.equipmentNo === this.shopFilter.equipmentNo) {
        (((((this.block || []).find(({ name }) => name === this.bitValueChanged.itemName) || {}).eventBlock || {}).items || [])[0] || {}).value = this.bitValueChanged.itemValue
      }
    },
    'shopFilter.equipmentNo'() {
      if (this.legendString === 'Alive Auto Change') {
        this.changeHandler()
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      if (this.legendString === 'Alive Auto Change') {
        this.changeHandler()
      }
    })
  },
  methods: {
    changeHandler() {
      const isEqSimulator = this.simulatorType === 'eqEventList' ? '0' : '1'
      return startEquipmentAlive({
        lineName: this.shopFilter.lineId,
        localNo: this.shopFilter.equipmentNo,
        equipmentAlive: this.equipmentAlive,
        isEqSimulator: isEqSimulator
      }).then(() => {
        if (this.equipmentAlive === 1) {
          this.$message({
            message: 'Equipment Alive Auto Change is Open!',
            type: 'success'
          })
        } else {
          this.$message({
            message: 'Equipment Alive Auto Change is Close!',
            type: 'info'
          })
        }
      })
    },
    sendHandler(item) {
      const temp = []
      const isEqSimulator = this.legendString === 'BC Bit Status' ? '1' : '0'
      item.eventBlock.items.forEach(element => {
        temp.push({
          privateName: element.name,
          strValue: element.value
        })
      })
      return sendPlcCommand({
        lineName: this.shopFilter.lineId,
        isEqSimulator: isEqSimulator,
        plcBlockBean: {
          eqpNo: this.shopFilter.equipmentNo,
          blocks: [
            {
              prefix: item.eventBlock.prefix,
              privateName: item.eventBlock.name,
              privateEQPName: this.shopFilter.equipmentNo,
              itemCollection: temp
            }
          ]
        }
      }).then(res => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.local-side-container {
  padding: 10px;
  border-bottom:1px solid #e3e3e3;
  .fieldset{
    border:1px solid #e3e3e3;
    border-radius: 5px;
    padding: 10px;
    .fieldset-content{
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      .switch-item{
        width:33%;
        min-width: 205px;
        height:30px;
        line-height: 30px;
      }
    }
  }
}
</style>
