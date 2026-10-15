<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" :unique-opened="true" mode="vertical" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
      <header class="layout-title">{{ title }}</header>
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import system from '@/config/app'

export default {
  components: { SidebarItem },
  data() {
    return {
      title: system.title
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.layout-title {
	line-height: 49px;
	height: 49px;
	border-bottom: 1px solid #e3e3e3;
	background-color: #000;
	color: #fff;
	font-size: 30px;
  text-transform: capitalize;
	text-align: center;
}
.hideSidebar {
	.layout-title::first-letter {
		font-size: 49px;
		text-transform: uppercase;
		overflow: hidden;
    letter-spacing:10px;
	}
}
</style>
