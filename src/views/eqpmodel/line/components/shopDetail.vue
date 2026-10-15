<template>
  <div>
    <el-table
      key="lineTable"
      :data="dataList"
      stripe
      border>
      <el-table-column min-width="120px" label="LineId" prop="lineId" fixed />
      <el-table-column min-width="120px" label="LineName" prop="lineName" />
      <el-table-column min-width="120px" label="LineType" prop="lineType" />
      <el-table-column min-width="120px" label="ServerName" prop="serverName" />
      <el-table-column min-width="120px" label="ShopName" prop="shopName" />
      <el-table-column min-width="120px" label="ServerIp" prop="ip" />
      <el-table-column min-width="120px" label="Port1" prop="port" />
      <el-table-column min-width="120px" label="Port2" prop="port2" />
      <el-table-column min-width="240px" label="Description" prop="info" />
      <el-table-column :label="t('column.actions')" width="150" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button
            v-authorize="'update'"
            type="primary"
            icon="el-icon-edit"
            @click="editHandler(curr.row)"/>
          <el-button
            v-authorize="'remove'"
            type="danger"
            icon="el-icon-delete"
            @click="removeHandler(curr.row)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { t } from '@/utils'
export default {
  name: 'ShopDetail',
  props: {
    dataList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    t,
    editHandler(row) {
      this.$emit('editEvent', { eventType: 'line', target: row })
    },
    removeHandler(row) {
      this.$emit('removeEvent', { eventType: 'line', target: row })
    }
  }
}
</script>

