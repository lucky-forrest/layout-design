<template>
  <div class="app-container">
    <Split v-model="splitValue" style="height:calc(100vh - 124px);border:1px solid #dcdee2;">
      <div slot="left">
        <div class="box-container">
          <div style="padding:10px;">
            <el-input v-model="treeFilter" suffix-icon="el-icon-search" clearable/>
          </div>
          <el-tree ref="tree" :data="treeList" :expand-on-click-node="false" :filter-node-method="filterNode" highlight-current default-expand-all accordion node-key="label" @node-click="nodeClickHandler">
            <span slot-scope="{ node, data }">
              <span>
              <svg-icon :icon-class="data.type" />&nbsp;&nbsp;{{ node.label }}</span>
              <span v-if="data.type ==='lineType'||data.type ==='linePanel'||data.type==='port'||data.type==='unit'">
                <el-button v-authorize="'add'" :loading="loading" type="text" @click.stop="appendHandler(data, node)">
                  <svg-icon :icon-class="'plus'" /> Add
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div slot="right" class="right-container">
        <component :is="componentType" :data-list="componentDataList" :data-detail="dataDetail" @editEvent="editHandler" @removeEvent="removeHandler" @updateEvent="updateHandler" />
      </div>
    </Split>
  </div>
</template>
<script>
import { getEquipmentList, saveEquipmentInfo, deleteEquipmentInfo } from '@/api/eqpmodel/equipment'
import { getLineList, saveLineInfo, deleteLineInfo } from '@/api/eqpmodel/line'
import { getUnitList, saveUnitInfo, deleteUnitInfo } from '@/api/eqpmodel/unit'
import { getPortList, savePortInfo, deletePortInfo } from '@/api/eqpmodel/port'
import { getLineTypeList } from '@/api/eqpmodel/lineType'
import components from './components'
import notice from '@/utils/notice'
import { shopList } from '@/config'
import { t } from '@/utils'
import axios from 'axios'

export default {
  name: 'CreateLine',
  components: {
    ...components
  },
  data() {
    return {
      loading: false,
      splitValue: 0.2,
      treeFilter: '',
      componentType: 'shop',
      componentDataList: [],
      dataDetail: {},
      shopList: shopList,
      lineTypeList: [],
      lineList: [],
      equipmentList: [],
      portList: [],
      unitList: [],
      treeList: []
    }
  },
  watch: {
    treeFilter(currValue) {
      this.$refs.tree.filter(currValue)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.componentType = 'shop'
      axios.all([
        this.getLineTypeList(),
        this.getLineList(), this.getEquipmentList(), this.getPortList(), this.getUnitList()]).then(axios.spread(() => {
        this.shopList.forEach(shop => {
          // 生成shop节点
          const shopNode = { label: shop.label, type: 'shop', children: [] }
          const tempShopLineList = this.lineList.filter(({ shopName }) => shopName === shop.label)

          // 生成lineType节点
          this.lineTypeList.filter(({ shopName }) => shopName === shop.label).forEach(({ lineTypeId }) => {
            const lineTypeNode = { label: lineTypeId, type: 'lineType', children: [] }
            const tempLineTypeLineList = tempShopLineList.filter(({ lineType }) => lineTypeId === lineType)

            // 生成line节点
            tempLineTypeLineList.forEach(line => {
              const lineNode = { label: line.lineId, type: 'linePanel', children: [] }
              lineTypeNode.children.push(lineNode)
            })

            shopNode.children.push(lineTypeNode)
          })
          this.treeList.push(shopNode)
        })
      }))
    })
  },
  methods: {
    t,
    filterNode(value, data) {
      if (!value) return true
      return data.label.toUpperCase().includes(value.toUpperCase())
    },
    editHandler({ eventType, target }) {
      switch (eventType) {
        case 'line':
          this.$refs.tree.setCurrentKey(target.lineId)
          break
        case 'equipment':
          this.$refs.tree.setCurrentKey(target.equipmentNo)
          break
        case 'portInfo':
          this.$refs.tree.setCurrentKey(`Port${target.portNo}`)
          break
        case 'unitInfo':
          this.$refs.tree.setCurrentKey(`Unit${target.unitNo}`)
          break
      }
      const data = this.$refs.tree.getCurrentNode()
      const node = this.$refs.tree.getNode(data)
      this.nodeClickHandler(data, node)
    },
    updateHandler({ eventType, target }) {
      return new Promise((resolve, reject) => {
        this.loading = true
        switch (eventType) {
          case 'lineType':
            return saveLineInfo(this.dataDetail.lineInfo).then(res => {
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          case 'line':
            return saveEquipmentInfo(this.dataDetail.eqpInfo).then(res => {
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          case 'port':
            return savePortInfo(this.dataDetail.portInfo).then(res => {
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          case 'unit':
            return saveUnitInfo(this.dataDetail.unitInfo).then(res => {
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
        }
      }).then(message => {
        notice.success(message, () => {
          this.updateTree(eventType)
        })
      })
    },
    removeHandler({ eventType, target }) {
      return new Promise((resolve) => {
        notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
          switch (eventType) {
            case 'line':
              return deleteLineInfo(target).then(() => {
                notice.success(this.t('tip.removeSuccess'))
                this.lineList = this.lineList.filter(({ objectId }) => objectId !== target.objectId)
                this.componentDataList = this.componentDataList.filter(({ objectId }) => objectId !== target.objectId)
                resolve(eventType)
              })
            case 'equipment':
              return deleteEquipmentInfo(target).then(() => {
                notice.success(this.t('tip.removeSuccess'))
                this.equipmentList = this.equipmentList.filter(({ objectId }) => objectId !== target.objectId)
                this.componentDataList = this.componentDataList.filter(({ objectId }) => objectId !== target.objectId)
                resolve(eventType)
              })
            case 'port':
              return deletePortInfo(target).then(() => {
                notice.success(this.t('tip.removeSuccess'))
                this.portList = this.portList.filter(({ objectId }) => objectId !== target.objectId)
                this.dataDetail.portList = this.dataDetail.portList.filter(({ objectId }) => objectId !== target.objectId)
                resolve(eventType)
              })
            case 'unit':
              return deleteUnitInfo(target).then(() => {
                notice.success(this.t('tip.removeSuccess'))
                this.unitList = this.unitList.filter(({ objectId }) => objectId !== target.objectId)
                this.dataDetail.unitList = this.dataDetail.unitList.filter(({ objectId }) => objectId !== target.objectId)
                resolve(eventType)
              })
          }
        })
      }).then(eventType => {
        this.updateTree()
      })
    },
    appendHandler(data, node) {
      return this.nodeClickHandler(data, node).then(() => {
        switch (data.type) {
          case 'shop':
            this.appendLineType(data, node)
            break
          case 'lineType':
            this.appendLine(data, node)
            break
          case 'linePanel':
            this.appendEquipment(data, node)
            break
          case 'port':
            this.appendPort(data, node)
            break
          case 'unit':
            this.appendUnit(data, node)
            break
        }
      })
    },
    getUniqLabel({ children }, { startSeqNo = 1, prefix = '', suffix = '' } = {}) {
      let tempSeqNo = startSeqNo
      let tempLabel = `${prefix}${tempSeqNo}${suffix}`
      while (this.$lodash.map(children, 'label').map(item => item.replace(/Port|Unit/, '')).includes(tempLabel)) {
        tempLabel = `${prefix}${tempSeqNo++}${suffix}`
      }
      return tempLabel
    },
    appendLineType(data, node) {
      data.children.push({ label: this.getUniqLabel(data, { prefix: data.label }), type: 'lineType', children: [] })
    },
    appendLine(data, node) {
      const shop = node.parent.data.label
      const lineId = this.getUniqLabel(data, { prefix: data.label, suffix: '00' })
      this.loading = true
      return saveLineInfo({
        shopName: shop,
        lineType: data.label,
        lineId: lineId,
        serverName: lineId,
        lineName: lineId,
        ip: '127.0.0.1',
        port: '8081',
        port2: '8085'
      }).then(res => {
        data.children.push({ label: lineId, type: 'linePanel', children: [] })
        this.getLineList().then(() => {
          if (this.componentType === 'lineType') {
            this.componentDataList = this.lineList.filter(({ shopName, lineType }) => {
              return shopName === shop && lineType === data.label
            })
          }
        })
      }).catch(() => {
        this.loading = false
      })
    },
    appendEquipment(data, node) {
      let equipmentNo = ''
      if (data.children.length > 7) {
        equipmentNo = this.getUniqLabel(data, { startSeqNo: '10', prefix: 'L' })
      } else {
        equipmentNo = this.getUniqLabel(data, { startSeqNo: 2, prefix: 'L0' })
      }
      this.loading = true
      saveEquipmentInfo({
        lineId: data.label,
        equipmentNo: equipmentNo,
        name: equipmentNo,
        reportMode: 'PLC',
        serverName: data.label,
        processdateSource: 'PLC',
        vcrType: 'A',
        recipeSequence: '0'
      }).then(res => {
        data.children.push(
          {
            label: equipmentNo,
            type: 'equipment',
            children: [
              { label: 'Port', type: 'port', children: [] },
              { label: 'Unit', type: 'unit', children: [] }
            ]
          })
        this.getEquipmentList().then(() => {
          if (this.componentType === 'linePanel') {
            this.componentDataList = this.equipmentList.filter(({ lineId }) => {
              return lineId === data.label
            })
          }
        })
      }).catch(() => {
        this.loading = false
      })
    },
    appendPort(data, node) {
      const portNo = this.getUniqLabel(data)
      const lineId = node.parent.parent.data.label
      this.loading = true
      savePortInfo({
        portNo: portNo,
        portId: portNo,
        lineId: lineId,
        serverName: lineId,
        equipmentNo: node.parent.data.label,
        equipmentId: node.parent.data.label
      }).then(() => {
        data.children.push({ label: `Port${portNo}`, type: 'portInfo', children: [] })
        this.getPortList().then(() => {
          this.dataDetail.portList = this.portList.filter(({ lineId, equipmentNo }) => equipmentNo === node.parent.data.label && lineId === node.parent.parent.data.label)
        })
      }).catch(() => {
        this.loading = false
      })
    },
    appendUnit(data, node) {
      const unitNo = this.getUniqLabel(data)
      const lineId = node.parent.parent.data.label
      this.loading = true
      saveUnitInfo({
        unitNo: unitNo,
        unitId: unitNo,
        lineId: lineId,
        serverName: lineId,
        equipmentNo: node.parent.data.label,
        equipmentId: node.parent.data.label
      }).then(() => {
        data.children.push({ label: `Unit${unitNo}`, type: 'unitInfo', children: [] })
        this.getUnitList().then(() => {
          this.dataDetail.unitList = this.unitList.filter(({ lineId, equipmentNo }) => equipmentNo === node.parent.data.label && lineId === node.parent.parent.data.label)
        })
      }).catch(() => {
        this.loading = false
      })
    },
    getLineTypeList() {
      this.loading = true
      return getLineTypeList({
        condition: {
          shopName: this.shopName,
          lineTypeId: ''
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.lineTypeList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getLineList() {
      this.loading = true
      return getLineList({ condition: {}, pageNo: 1, pageSize: Number.MAX_VALUE }).then(res => {
        this.lineList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getEquipmentList() {
      this.loading = true
      return getEquipmentList({
        condition: {},
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.equipmentList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getPortList() {
      this.loading = true
      return getPortList({
        condition: {},
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.portList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getUnitList() {
      this.loading = true
      return getUnitList({
        condition: {},
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.unitList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    nodeClickHandler(data, node) {
      return new Promise((resolve, reject) => {
        try {
          this.componentType = data.type
          switch (data.type) {
            case 'shop':
              {
                this.componentDataList = this.lineList.filter(({ shopName }) => { return shopName === data.label })
                const lineTypeList = this.$lodash.chain(this.componentDataList).map('lineType').uniq().value()
                data.children.splice(0, data.children.length)
                lineTypeList.forEach(lineType => {
                  data.children.push({
                    label: lineType,
                    type: 'lineType',
                    children: this.componentDataList.filter((item) => item.lineType === lineType).map(({ lineId }) => {
                      return {
                        label: lineId,
                        type: 'linePanel',
                        children: []
                      }
                    })
                  })
                })
              }
              break
            case 'lineType':
              this.componentDataList = this.lineList.filter(({ shopName, lineType }) => {
                return shopName === node.parent.data.label && lineType === data.label
              })
              data.children.splice(0, data.children.length)
              this.componentDataList.forEach(({ lineId }) => {
                data.children.push({
                  label: lineId,
                  type: 'linePanel',
                  children: []
                })
              })
              break
            case 'linePanel':
              this.dataDetail = Object.assign({}, this.dataDetail, { lineInfo: this.lineList.find(({ lineId }) => { return lineId === data.label }) })
              this.componentDataList = this.equipmentList.filter(({ lineId }) => { return lineId === data.label })
              data.children.splice(0, data.children.length)
              this.componentDataList.forEach(({ equipmentNo }, index) => {
                data.children.push({
                  label: `${equipmentNo}`,
                  type: 'equipment',
                  children: []
                })
              })
              break
            case 'equipment':
              {
                const tempLineId = node.parent.data.label
                const tempEquipmentNo = data.label
                this.getEquipmentDataDetail({ tempLineId, tempEquipmentNo })
                this.dataDetail = Object.assign({}, this.dataDetail, { activeTab: 'portList' })
                data.children.splice(0, data.children.length)
                data.children.push(
                  { label: 'Port',
                    type: 'port',
                    children: this.dataDetail.portList.map(({ portNo }) => {
                      return {
                        label: `Port${portNo}`,
                        type: 'portInfo',
                        children: []
                      }
                    })
                  },
                  {
                    label: 'Unit',
                    type: 'unit',
                    children: this.dataDetail.unitList.map(({ unitNo }) => {
                      return {
                        label: `Unit${unitNo}`,
                        type: 'unitInfo',
                        children: []
                      }
                    })
                  }
                )
              }
              break
            case 'port':
              if (!this.dataDetail.hasOwnProperty('portList')) {
                const tempLineId = node.parent.parent.data.label
                const tempEquipmentNo = node.parent.data.label
                this.getEquipmentDataDetail({ tempLineId, tempEquipmentNo })
              }
              this.dataDetail = Object.assign({}, this.dataDetail, { activeTab: 'portList' })
              data.children.splice(0, data.children.length)
              data.children = this.dataDetail.portList.map(({ portNo }) => {
                return {
                  label: `Port${portNo}`,
                  type: 'portInfo',
                  children: []
                }
              })
              break
            case 'unit':
              if (!this.dataDetail.hasOwnProperty('unitList')) {
                const tempLineId = node.parent.parent.data.label
                const tempEquipmentNo = node.parent.data.label
                this.getEquipmentDataDetail({ tempLineId, tempEquipmentNo })
              }
              this.dataDetail = Object.assign({}, this.dataDetail, { activeTab: 'unitList' })
              data.children.splice(0, data.children.length)
              data.children = this.dataDetail.unitList.map(({ unitNo }) => {
                return {
                  label: `Unit${unitNo}`,
                  type: 'unitInfo',
                  children: []
                }
              })
              break
            case 'portInfo':
              {
                const tempLineId = node.parent.parent.parent.data.label
                const tempEquipmentNo = node.parent.parent.data.label
                const tempPortNo = Number.parseInt(data.label.replace(/^Port/, ''), 10)
                const portInfo = this.portList.find(({ lineId, equipmentNo, portNo }) => {
                  return (lineId === tempLineId) && (equipmentNo === tempEquipmentNo) && (Number.parseInt(portNo, 10) === tempPortNo)
                })
                this.dataDetail = Object.assign({}, this.dataDetail, { portInfo })
              }
              break
            case 'unitInfo':
              {
                const tempLineId = node.parent.parent.parent.data.label
                const tempEquipmentNo = node.parent.parent.data.label
                const tempUnitNo = Number.parseInt(data.label.replace(/^Unit/, ''), 10)
                const unitInfo = this.unitList.find(({ lineId, equipmentNo, unitNo }) => {
                  return (lineId === tempLineId) && (equipmentNo === tempEquipmentNo) && (Number.parseInt(unitNo, 10) === tempUnitNo)
                })
                this.dataDetail = Object.assign({}, this.dataDetail, { unitInfo })
              }
              break
          }
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    getEquipmentDataDetail({ tempLineId, tempEquipmentNo }) {
      const portList = this.portList.filter(({ lineId, equipmentNo }) => { return lineId === tempLineId && equipmentNo === tempEquipmentNo })
      const unitList = this.unitList.filter(({ lineId, equipmentNo }) => { return lineId === tempLineId && equipmentNo === tempEquipmentNo })
      this.dataDetail = Object.assign({}, this.dataDetail,
        {
          eqpInfo: this.equipmentList.find(({ lineId, equipmentNo }) => { return lineId === tempLineId && equipmentNo === tempEquipmentNo }),
          portList,
          unitList
        }
      )
    },
    updateTree(eventType) {
      const data = this.$refs.tree.getCurrentNode()
      const node = this.$refs.tree.getNode(data)
      switch (eventType) {
        case 'port':
          if (this.dataDetail.portList.length === 0) {
            this.nodeClickHandler(node.parent.data, this.$refs.tree.getNode(node.parent.data))
          } else {
            this.nodeClickHandler(data, node)
          }
          break
        case 'unit':
          if (this.dataDetail.unitList.length === 0) {
            this.nodeClickHandler(node.parent.data, this.$refs.tree.getNode(node.parent.data))
          } else {
            this.nodeClickHandler(data, node)
          }
          break
        default:
          if (this.componentDataList.length === 0) {
            this.nodeClickHandler(node.parent.data, this.$refs.tree.getNode(node.parent.data))
          } else {
            this.nodeClickHandler(data, node)
          }
          break
      }
    }
  }
}

</script>
<style lang="scss" scoped>
  .box-container {
    .el-tree {
      height: calc(100vh - 186px);
      overflow-y: auto;
    }
  }

  .right-container {
    height: 100%;
    overflow-y: auto;
  }
</style>
