<template>
  <div class="authority-container">
    <el-row :gutter="20">
      <ul class="menu-container">
        <li v-for="(item,index) in menuList" :key="index" class="menu-item">
          <el-checkbox v-model="item.checked" @change="menuHandler(item)">
            <svg-icon :icon-class="item.icon" />&nbsp;&nbsp;&nbsp;{{ generateTitle(item.title) }}
          </el-checkbox>
          <ul class="page-container">
            <li v-for="(page,index) in item.pageList" :key="index" class="page-item">
              <el-checkbox v-model="page.checked" :disabled="!item.checked" class="page-item-title" @change="pageHandler(page)">
                <svg-icon :icon-class="page.icon" />&nbsp;&nbsp;&nbsp;{{ generateTitle(page.title) }}
              </el-checkbox>
              <el-checkbox-group v-model="page.checkActionList" :disabled="!item.checked||!page.checked">
                <ul class="action-container">
                  <li v-for="(act,actIndex) in page.actionList" :key="actIndex" class="action-item">
                    <el-checkbox :label="act" @change="actionHandler(act)">{{ t(`btn.${act}`) }}</el-checkbox>
                  </li>
                </ul>
              </el-checkbox-group>
            </li>
          </ul>
        </li>
      </ul>
    </el-row>
  </div>
</template>
<script>
import { generateTitle } from '@/utils/i18n'
import { asyncRouterMap } from '@/router'
import { t } from '@/utils'

export default {
  name: 'Authority',
  props: {
    authorityList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      menuList: []
    }
  },
  watch: {
    authorityList() {
      const menuAuthorityObj = this.$lodash.chain(this.authorityList).groupBy('menuName').value()
      this.menuList.forEach(item => {
        if (Array.isArray(menuAuthorityObj[item.title])) {
          item.checked = true
          const pageAuthorityObj = this.$lodash.chain(menuAuthorityObj[item.title]).groupBy('pageName').value()
          item.pageList.forEach(page => {
            if (Array.isArray(pageAuthorityObj[page.title])) {
              page.checked = true
              page.checkActionList = this.$lodash.map(pageAuthorityObj[page.title], 'action')
            }
          })
        }
      })
    }
  },
  created() {
    const menuList = this.$lodash.chain(asyncRouterMap)
      .map(item => {
        return {
          title: (item.meta || {}).title || '',
          icon: (item.meta || {}).icon || '',
          pageList: (item.children || []).map(cItem => {
            return {
              title: (cItem.meta || {}).title,
              icon: (cItem.meta || {}).icon,
              actionList: (cItem.meta || {}).actionList
            }
          })
        }
      }).filter(item => item.title).value()
    this.menuList = menuList
  },
  mounted() {
    this.$nextTick().then(() => {
      this.menuList.forEach(item => {
        this.$set(item, 'checked', false)
        item.pageList.forEach(page => {
          this.$set(page, 'checked', false)
          this.$set(page, 'checkActionList', [])
        })
      })
    })
  },
  methods: {
    t,
    generateTitle,
    updateAuthority() {
      this.loading = true
      return new Promise((resolve) => {
        const tempPageList = []
        for (const { title, pageList } of this.menuList.filter(item => { return item.checked })) {
          pageList.filter(page => { return page.checked }).forEach(page => {
            if (Array.isArray(page.actionList) && page.actionList.length > 0) {
              page.actionList.forEach(authority => {
                tempPageList.push({
                  groupId: '',
                  menuName: title,
                  pageName: page.title,
                  action: authority
                })
              })
            } else {
              tempPageList.push({
                groupId: '',
                menuName: title,
                pageName: page.title,
                action: ''
              })
            }
          })
        }
        resolve(tempPageList)
      }).then(res => {
        this.$emit('updateEvent', res)
      })
    },
    menuHandler(item) {
      if (item.checked) {
        item.pageList.forEach(page => {
          page.checked = true
          page.checkActionList = Array.from(page.actionList || [])
        })
      } else {
        item.pageList.forEach(page => {
          page.checked = false
          page.checkActionList.splice(0, page.checkActionList.length)
        })
      }
      this.updateAuthority()
    },
    pageHandler(item) {
      if (item.checked) {
        item.checkActionList = Array.from(item.actionList)
      } else {
        item.checkActionList.splice(0, item.checkActionList.length)
      }
      this.updateAuthority()
    },
    actionHandler(item) {
      this.updateAuthority()
    }
  }
}
</script>
<style lang="scss" scoped>
  .authority-container {
  padding: 10px;
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .menu-container {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    margin: 0;
    padding: 0;
    list-style: none;
    .menu-item {
      width: 100%;
      padding-bottom:10px;
      border-bottom:1px solid #e3e3e3;
      .page-container {
        display: flex;
        flex-flow: row wrap;
        .page-item {
          display: flex;
          flex-flow: row nowrap;
          width: 100%;
          margin-left: 25px;
          line-height: 20px;
          .page-item-title {
            width: 240px;
          }
          .el-checkbox-group {
            flex: 1;
            .action-container {
              width: 100%;
              display: flex;
              flex-flow: row wrap;
              flex: 1;
              .action-item {
                width: 20%;
                height: 20px;
                line-height: 20px;
              }
            }
          }
        }
      }
    }
    .menu-item:last-child{
      border-bottom:none;
    }
  }
}
</style>
