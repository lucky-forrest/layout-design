<template>
  <div class="upload-container">
    <div class="file-upload-component">
      <file-upload
        ref="upload"
        v-bind="uploadConfig"
        v-model="files"
        @input-filter="inputFilter"
        @input-file="inputFile"/>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="onAddFolader">{{ t('btn.addFolder') }}</el-button>
      </div>
    </div>
    <el-table
      :data="files"
      :default-sort="{prop:'createtime',order:'descending'}"
      stripe
      border
      style="margin-top:10px;">
      <el-table-column type="index" align="center" fixed>#</el-table-column>
      <el-table-column label="FileName" min-width="100">
        <template slot-scope="curr">
          <el-tooltip :content="curr.row.name" placement="top-start">
            <span>{{ curr.row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120" align="center">
        <template slot-scope="curr">
          <el-progress :percentage="Math.floor(curr.row.progress)">{{ `${Math.floor(curr.row.progress)}%` }}
          </el-progress>
        </template>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="120" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button
            v-authorize="'remove'"
            :loading="loading"
            type="danger"
            icon="el-icon-delete"
            @click="deleteHandler(curr.$index)">
            {{ t('btn.remove') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form ref="updateVersionForm" :model="updateVersionForm" label-width="120px" label-position="right" style="margin-top:10px;">
      <el-form-item label="Latest Version" prop="latestVersion">
        <el-input v-model="updateVersionForm.latestVersion" disabled/>
      </el-form-item>
      <el-form-item :rules="[{required:true,message:'Version is required'}]" label="Version" prop="version">
        <el-input v-model="updateVersionForm.version" placeholder="Please Input" />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="updateVersionForm.description" type="textarea"/>
      </el-form-item>
    </el-form>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click.prevent="uploadHandler('updateVersionForm')">
        <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="cancelHandler">
        <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  // uploadfile,
  getConfVersionFileList
} from '@/api/deployMent'
import FileUpload from 'vue-upload-component'
import notice from '@/utils/notice'
import { t } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  components: {
    FileUpload
  },

  data() {
    return {
      loading: false,
      files: [],
      updateVersionForm: {
        version: '',
        latestVersion: '',
        description: ''
      },
      uploadConfig: {
        postAction: `http://${window.config.serverIp}:${window.config.serverPort}/blockcontroller/uploadfile`,
        data: {
          type: 'BC',
          userName: '',
          version: '',
          content: ''
        },
        extensions: /\.(xml|gg|properties|bpmn|jar|png)$/i,
        multiple: true,
        directory: true, // 允许文件夹上传
        timeout: 600 * 1000
      }
    }
  },
  computed: {
    ...mapGetters([
      'userName'
    ]),
    uploaded() {
      let file
      for (let i = 0; i < this.files.length; i++) {
        file = this.files[i]
        if (file.fileObject && !file.error && !file.success) {
          return false
        }
      }
      return true
    }
  },
  watch: {
    uploaded() {
      if (this.uploaded) {
        this.files.forEach((file) => {
          file.progress = '100'
        })
        this.loading = false
        notice.success('上传成功！', () => {
          this.$emit('successEvent', 'upload')
        })
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getConfVersionFileList()
    })
  },
  methods: {
    t,
    getConfVersionFileList() {
      this.loading = true
      return getConfVersionFileList({ type: 'BC', name: 'BC' }).then(res => {
        this.updateVersionForm.latestVersion = Array.isArray(res.body) ? (res.body[0] || {}).version : ''
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onAddFolader() {
      if (!this.$refs.upload.features.directory) {
        this.alert('Your browser does not support')
        return
      }
      const input = this.$refs.upload.$el.querySelector('input')
      input.directory = true
      input.webkitdirectory = true
      this.directory = true
      input.onclick = null
      input.click()
      input.onclick = (e) => {
        this.directory = false
        input.directory = false
        input.webkitdirectory = false
      }
    },
    cancelHandler() {
      this.$emit('cancelEvent', 'upload')
    },
    deleteHandler(index) {
      this.files.splice(index, 1)
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前

        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }

        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
    },
    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // 校验文件是否已存在相同的文件
        const objFiles = {}
        for (const [index, file] of Object.entries(this.files)) {
          if (!objFiles.hasOwnProperty(file.name)) {
            Object.assign(objFiles, { [file.name]: index })
          } else {
            this.$message.error(`文件${newFile.name}已存在!`)
            this.files.splice(index, 1)
            break
          }
        }
      }
      if (newFile && oldFile) {
        // update
        console.log('update', newFile)
      }

      if (!newFile && oldFile) {
        // remove
        console.log('remove', oldFile)
      }
    },
    uploadHandler(formName) {
      let errMsg = ''
      if (this.files.length === 0) {
        errMsg = 'Please select file !'
      }
      if (errMsg) {
        notice.error(errMsg)
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.files.forEach(item => {
              item.data = Object.assign(item.data, {
                userName: this.userName,
                version: this.updateVersionForm.version,
                content: this.updateVersionForm.description
              })
            })
            this.$refs.upload.active = true
            this.loading = true
          }
        })
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  .file-upload-component {
    .upload-tip {
      display: inline-block;
      vertical-align: top;
      height: 36px;
      line-height: 36px;
    }
  }

</style>
