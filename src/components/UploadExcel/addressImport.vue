<template>
  <div>
    <input ref="excel-upload-input" class="excel-upload-input" type="file" multiple @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Drop Excel file here or
      <el-button :loading="loading" style="margin-left:16px;" type="primary" @click="handleUpload">Browse</el-button>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        name: null,
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ name, header, results }) {
      this.excelData.name = name
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(name, header, results)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      if (!files[0]) return
      this.upload(files[0])
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const fixedData = this.fixData(data)
          const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
          const sheetName = workbook.SheetNames
          sheetName.forEach(sheet => {
            const worksheet = workbook.Sheets[sheet]
            let header = []
            const name = sheet
            const results = []
            let tableList = []
            if (name === 'Address') {
              header = ['Line Station Number', 'Equipment', 'Network No.', 'Station No.', 'Point1', 'Start_W', 'End_W', 'Point2', 'Start_B', 'End_B']
              tableList = XLSX.utils.sheet_to_json(worksheet)
              const column = (Object.keys(tableList[2]).map(prop => {
                return {
                  label: prop
                }
              }))
              for (let i = 2; i < tableList.length; i++) {
                const list = []
                for (let j = 0; j < column.length; j++) {
                  this.$set(list, header[j], tableList[i][column[j].label])
                }
                results.push(list)
              }
            } else {
              tableList = XLSX.utils.sheet_to_json(worksheet)
              const column = (Object.keys(tableList[2]).map(prop => {
                return {
                  label: prop,
                  prop: tableList[2][prop]
                }
              }))
              Object.keys(tableList[3]).map(prop => {
                column.forEach(curr => {
                  if (curr.label === prop) {
                    curr.prop = tableList[3][prop]
                  }
                })
              })
              column.filter(curr => { return curr.prop.indexOf('#') }).forEach(curr => header.push(curr.prop))
              for (let i = 4; i < tableList.length; i++) {
                const list = []
                for (let j = 0; j < column.length; j++) {
                  if (j === 0 && i >= 4 && !tableList[i][column[j].label]) {
                    tableList[i][column[j].label] = tableList[i - 1][column[j].label]
                  }
                  this.$set(list, column[j].prop, tableList[i][column[j].label])
                }
                results.push(list)
              }
            }
            this.generateData({ name, header, results })
          })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    fixData(data) {
      let o = ''
      let l = 0
      const w = 10240
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
