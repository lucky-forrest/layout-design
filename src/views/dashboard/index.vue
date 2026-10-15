<template>
  <div class="landing">
    <!-- ================= 顶部浮层导航 ================= -->
    <header class="nav">
      <div class="nav__logo">
        <svg-icon icon-class="design" className="i-24 i-teal"/>
        <span>CSOT-Tools</span>
      </div>
      <button class="nav__cta" @click="goDesign">
        进入 Layout 设计
        <svg-icon icon-class="arrow_right" className="i-16"/>
      </button>
    </header>

    <!-- ================= Hero · 案例轮播 ================= -->
    <section class="hero">
      <div class="hero__glow"/>
      <div class="hero__grid"/>
      <div class="hero__inner">
        <div class="hero__copy">
          <div class="hero__badge">
            <span class="hero__badge-dot"/>
            半导体产线布局设计工具
          </div>
          <h1 class="hero__title">
            产线布局设计，<br/><span class="hero__title-accent">所见即所得</span>
          </h1>
          <p class="hero__desc">
            面向半导体工厂的可视化产线布局设计器：从元件库拖入设备模型，
            自由摆放、连线与配置，一站式完成产线方案设计、评审与工程沉淀。
          </p>
          <div class="hero__actions">
            <button class="btn btn--primary" @click="goDesign">
              快速开始 · 进入 Layout 设计
              <svg-icon icon-class="arrow_right" className="i-18"/>
            </button>
          </div>
          <div class="hero__stats">
            <div class="hero__stat"><span class="hero__stat-num">16</span>布局元件</div>
            <div class="hero__stat"><span class="hero__stat-num">拖拽式</span>可视化建模</div>
            <div class="hero__stat"><span class="hero__stat-num">.gg</span>工程保存/加载</div>
          </div>
        </div>

        <!-- 案例轮播 -->
        <div class="showcase" @mouseenter="pauseAuto()" @mouseleave="resumeAuto()">
          <div class="showcase__stage">
            <div
              class="showcase__track"
              :style="{ transform: 'translateX(-' + current * 100 + '%)' }">
              <div
                class="slide"
                v-for="(c, i) in cases"
                :key="c.src"
                @click="openLightbox(i)">
                <video
                  ref="caseVideos"
                  class="slide__video"
                  :src="c.src"
                  :muted="true"
                  loop
                  playsinline
                  preload="metadata"/>
                <div class="slide__shade"/>
                <div class="slide__cap">
                  <div class="slide__tag">{{ c.tag }}</div>
                  <div class="slide__title">{{ c.title }}</div>
                </div>
                <div class="slide__play">
                  <svg-icon icon-class="preview" className="i-22"/>
                  <span>点击单独查看</span>
                </div>
              </div>
            </div>
            <button class="showcase__arrow showcase__arrow--prev" title="上一个案例" @click="go(-1)">
              <svg-icon icon-class="arrow_left" className="i-20 i-light"/>
            </button>
            <button class="showcase__arrow showcase__arrow--next" title="下一个案例" @click="go(1)">
              <svg-icon icon-class="arrow_right" className="i-20 i-light"/>
            </button>
            <div class="showcase__dots">
              <button
                v-for="(c, i) in cases"
                :key="'dot' + i"
                class="dot"
                :class="{ 'dot--on': i === current }"
                :title="'案例 ' + (i + 1)"
                @click="current = i"/>
            </div>
          </div>
        </div>
      </div>
      <div class="hero__hint">
        <svg-icon icon-class="arrow_down" className="i-18"/>
        <span>向下浏览更多</span>
      </div>
    </section>

    <!-- ================= 核心功能 · Bento ================= -->
    <section class="sec">
      <div class="sec__head">
        <h2 class="sec__title">核心功能</h2>
        <p class="sec__sub">它都能做什么</p>
      </div>
      <div class="bento">
          <div class="bento__item bento__item--wide" v-for="f in features" :key="f.title" :class="'bento__item--' + f.key">
          <div class="bento__icon"><svg-icon :icon-class="f.icon" className="i-26 i-teal"/></div>
          <div class="bento__title">{{ f.title }}</div>
          <div class="bento__desc">{{ f.desc }}</div>
        </div>
        <div class="bento__item bento__item--full" v-for="f in featuresFull" :key="f.title">
          <div class="bento__icon"><svg-icon :icon-class="f.icon" className="i-26 i-teal"/></div>
          <div class="bento__title">{{ f.title }}</div>
          <div class="bento__desc">{{ f.desc }}</div>
        </div>
      </div>
    </section>

    <!-- ================= 应用场景 ================= -->
    <section class="sec sec--alt">
      <div class="sec__head">
        <h2 class="sec__title">应用场景</h2>
        <p class="sec__sub">在哪些环节使用它</p>
      </div>
      <div class="scenes">
        <div class="scene" v-for="s in scenarios" :key="s.title">
          <div class="scene__icon"><svg-icon :icon-class="s.icon" className="i-24 i-teal"/></div>
          <div class="scene__body">
            <div class="scene__title">{{ s.title }}</div>
            <div class="scene__desc">{{ s.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 设计价值 ================= -->
    <section class="sec">
      <div class="sec__head">
        <h2 class="sec__title">设计价值</h2>
        <p class="sec__sub">用它解决什么问题</p>
      </div>
      <div class="values">
        <div class="value" v-for="(v, i) in values" :key="v">
          <div class="value__num">0{{ i + 1 }}</div>
          <div class="value__text">{{ v }}</div>
        </div>
      </div>
    </section>

    <!-- ================= 元件库 ================= -->
    <section class="sec sec--alt">
      <div class="sec__head">
        <h2 class="sec__title">元件库</h2>
        <p class="sec__sub">内置 16 种产线布局元件，按类别组织</p>
      </div>
      <div class="comps">
        <div class="comp" v-for="g in compGroups" :key="g.name">
          <div class="comp__name">{{ g.name }}</div>
          <div class="comp__items">
            <span class="chip" v-for="c in g.items" :key="c">{{ c }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= CTA ================= -->
    <section class="cta">
      <h2 class="cta__title">开始搭建你的产线布局</h2>
      <p class="cta__desc">打开设计器，从元件库拖入第一个设备，几分钟内完成整线方案。</p>
      <button class="btn btn--primary btn--lg" @click="goDesign">
        进入 Layout 设计
        <svg-icon icon-class="arrow_right" className="i-20"/>
      </button>
    </section>

    <footer class="foot">
      <span>CSOT-Tools · 产线设计与仿真工具集</span>
      <span class="foot__sep">|</span>
      <span>当前版本聚焦 Layout 布局设计器</span>
    </footer>

    <!-- ================= 案例单独查看 · 灯箱 ================= -->
    <transition name="fade">
      <div v-if="lightboxIndex !== null" class="lightbox" @click.self="closeLightbox">
        <button class="lightbox__close" title="关闭" @click="closeLightbox">
          <svg-icon icon-class="close" className="i-22 i-light"/>
        </button>
        <div class="lightbox__video">
          <video
            v-if="lightboxIndex !== null"
            :src="cases[lightboxIndex] ? cases[lightboxIndex].src : ''"
            :muted="true"
            autoplay
            loop
            controls
            playsinline/>
        </div>
        <div class="lightbox__cap">
          <span class="lightbox__tag">{{ lightboxCase ? lightboxCase.tag : '' }}</span>
          {{ lightboxCase ? lightboxCase.title : '' }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: function() {
    return {
      current: 0,
      timer: null,
      lightboxIndex: null,
      reduceMotion: false,
      cases: [
        { src: '/static/videos/case1.mov', title: '案例 01 · 产线布局设计', tag: 'LAYOUT DESIGN' },
        { src: '/static/videos/case2.mov', title: '案例 02 · 工具操作演示', tag: 'EDITOR DEMO' }
      ],
      features: [
        { key: 'drag', icon: 'design', title: '可视化拖拽建模', desc: '从元件库直接拖入设备模型，自由移动、缩放与旋转，所见即所得地搭建产线结构。' },
        { key: 'lib', icon: 'component', title: '设备元件库', desc: '内置设备、炉子、Unit（机械手）、Port、VCR（读卡器）等半导体产线常用元件。' },
        { key: 'link', icon: 'link', title: '连线与路径规划', desc: 'LinkSignal 信号连线表达设备联动关系，路径规划描述物料流转走向。' },
        { key: 'conf', icon: 'setting', title: '属性精细化配置', desc: '每个元件支持位置、尺寸、层级、样式等属性面板配置，精细控制布局细节。' },
        { key: 'zoom', icon: 'size', title: '多级缩放画布', desc: '画布自由缩放浏览，大产线可全局总览，也可局部精修每一个设备细节。' }
      ],
      featuresFull: [
        { icon: 'save', title: '工程保存与加载', desc: '工程以 .gg 文件保存、打开与下载，支持撤销/重做，布局成果可复用沉淀。' }
      ],
      scenarios: [
        { icon: 'factory', title: '产线方案设计', desc: '新产线规划或设备导入前，拖拽式快速搭建整线布局方案，直观看到设备摆位与空间关系。' },
        { icon: 'preview', title: '布局预演与评审', desc: '以可视化布局图开展方案评审，设备位置、物流路径一目了然，沟通效率大幅提升。' },
        { icon: 'connection', title: '联调与仿真前置', desc: '布局图可作为 PLC 配置、信号连线与产线模拟仿真的可视化输入，支撑调试准备。' },
        { icon: 'documentation', title: '培训与演示', desc: '沉淀标准布局模板，用于产线介绍、新人培训与客户演示，统一团队认知。' }
      ],
      values: [
        '所见即所得，方案沟通零误差',
        '大幅缩短产线布局设计与评审周期',
        '降低设备导入阶段的布局返工成本',
        '沉淀标准布局模板，支持复用与传承'
      ],
      compGroups: [
        { name: '设备组件', items: ['设备', '炉子', 'Unit 机械手', 'Port', 'VCR 读卡器'] },
        { name: '载具与物流', items: ['载板', '花篮', '小车 AGV', '路径规划'] },
        { name: '基础组件', items: ['容器', '文字', 'Button', 'Image', '动态标签', '数据组'] },
        { name: '联动与路径', items: ['LinkSignal 信号连线', '路径规划'] }
      ]
    }
  },
  computed: {
    lightboxCase: function() {
      return this.lightboxIndex !== null ? this.cases[this.lightboxIndex] : null
    }
  },
  mounted: function() {
    this.reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!this.reduceMotion) {
      this.timer = setInterval(this.next, 6000)
    }
  },
  beforeDestroy: function() {
    this.clearTimer()
  },
  watch: {
    current: function(val) {
      this.syncVideos()
    },
    lightboxIndex: function(val) {
      if (val !== null) {
        this.clearTimer()
      } else {
        this.resumeAuto()
      }
    }
  },
  methods: {
    goDesign: function() {
      this.$router.push('/design')
    },
    go: function(step) {
      const n = this.cases.length
      this.current = (this.current + step + n) % n
    },
    next: function() {
      if (this.lightboxIndex !== null) return
      this.go(1)
    },
    clearTimer: function() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    pauseAuto: function() {
      this.clearTimer()
    },
    resumeAuto: function() {
      if (this.reduceMotion || this.lightboxIndex !== null) return
      if (!this.timer) {
        this.timer = setInterval(this.next, 6000)
      }
    },
    syncVideos: function() {
      const vids = this.$refs.caseVideos || []
      vids.forEach((v, i) => {
        if (i === this.current) {
          const p = v.play()
          if (p && p.catch) p.catch(function() {})
        } else {
          v.pause()
        }
      })
    },
    openLightbox: function(i) {
      this.lightboxIndex = i
    },
    closeLightbox: function() {
      this.lightboxIndex = null
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/* ============ 基础 ============ */
.landing {
  min-height: 100vh;
  background: #0a1114;
  color: #e8f1f3;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  overflow-x: hidden;
}
button {
  cursor: pointer;
  font-family: inherit;
}

/* ============ 顶部浮层导航 ============ */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 40px;
  box-sizing: border-box;
  background: rgba(10, 17, 20, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(148, 190, 196, 0.10);
}
.nav__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: #e8f1f3;
}
.nav__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #43c9d1 0%, #2eafb8 100%);
  color: #0b1417;
  font-size: 14px;
  font-weight: 700;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  box-shadow: 0 2px 12px rgba(46, 175, 184, 0.35);
}
.nav__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(46, 175, 184, 0.45);
}
.nav__cta:focus-visible,
.showcase__arrow:focus-visible,
.dot:focus-visible,
.lightbox__close:focus-visible {
  outline: 2px solid #38c0c9;
  outline-offset: 2px;
}

/* ============ Hero ============ */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background:
    radial-gradient(1100px 620px at 78% 12%, rgba(56, 192, 201, 0.16), transparent 62%),
    radial-gradient(900px 560px at 8% 88%, rgba(56, 192, 201, 0.08), transparent 60%),
    linear-gradient(180deg, #0c1518 0%, #0a1114 58%, #0b1316 100%);
  padding: 96px 40px 64px;
}
.hero__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hero__grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
  background-image:
    linear-gradient(rgba(148, 190, 196, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 190, 196, 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, black 30%, transparent 75%);
  mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, black 30%, transparent 75%);
}
.hero__inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 56px;
  align-items: center;
}
.hero__copy {
  animation: riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(56, 192, 201, 0.35);
  background: rgba(56, 192, 201, 0.10);
  color: #8fdfe4;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.hero__badge-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #38c0c9;
  box-shadow: 0 0 10px #38c0c9;
}
.hero__title {
  margin: 22px 0 18px;
  font-size: 46px;
  line-height: 1.22;
  font-weight: 800;
  letter-spacing: 1px;
  color: #eef6f7;
}
.hero__title-accent {
  color: #38c0c9;
}
.hero__desc {
  max-width: 520px;
  font-size: 16px;
  line-height: 1.9;
  color: #a7bcc2;
}
.hero__actions {
  margin-top: 30px;
}
.hero__stats {
  display: flex;
  gap: 40px;
  margin-top: 40px;
}
.hero__stat {
  font-size: 13px;
  color: #6e868d;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hero__stat-num {
  font-size: 22px;
  font-weight: 800;
  color: #cfe6e9;
  letter-spacing: 0.4px;
}
.hero__hint {
  position: absolute;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6e868d;
  font-size: 12.5px;
  animation: bob 2.2s ease-in-out infinite;
}

/* ============ 案例轮播 ============ */
.showcase {
  animation: riseIn 0.7s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.showcase__stage {
  position: relative;
  height: 62vh;
  max-height: 540px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(148, 190, 196, 0.16);
  background: #0d171b;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 60px rgba(56, 192, 201, 0.08);
}
.showcase__track {
  display: flex;
  height: 100%;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide {
  position: relative;
  flex: 0 0 100%;
  height: 100%;
  cursor: pointer;
}
.slide__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #0d171b;
}
.slide__shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(6, 10, 12, 0) 55%, rgba(6, 10, 12, 0.72) 100%);
}
.slide__cap {
  position: absolute;
  left: 24px;
  bottom: 22px;
  right: 24px;
  color: #fff;
  pointer-events: none;
}
.slide__tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(56, 192, 201, 0.5);
  background: rgba(10, 17, 20, 0.6);
  color: #8fdfe4;
  font-size: 11px;
  letter-spacing: 1.4px;
  font-weight: 700;
  margin-bottom: 8px;
}
.slide__title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.3px;
}
.slide__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 999px;
  background: rgba(10, 17, 20, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  backdrop-filter: blur(4px);
}
.slide:hover .slide__play {
  opacity: 1;
}
.showcase__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(10, 17, 20, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s ease, transform 0.18s ease;
  z-index: 5;
}
.showcase__arrow:hover {
  background: rgba(56, 192, 201, 0.35);
}
.showcase__arrow--prev { left: 16px; }
.showcase__arrow--next { right: 16px; }
.showcase__dots {
  position: absolute;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 5;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.35);
  padding: 0;
  transition: all 0.25s ease;
}
.dot--on {
  width: 22px;
  border-radius: 999px;
  background: #38c0c9;
}

/* ============ 通用区块 ============ */
.sec {
  padding: 88px 40px 16px;
}
.sec--alt {
  background: rgba(148, 190, 196, 0.03);
  border-top: 1px solid rgba(148, 190, 196, 0.07);
  border-bottom: 1px solid rgba(148, 190, 196, 0.07);
}
.sec__head {
  max-width: 1280px;
  margin: 0 auto 44px;
}
.sec__title {
  margin: 0 0 10px;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: #eef6f7;
}
.sec__sub {
  margin: 0;
  font-size: 14.5px;
  color: #6e868d;
}

/* ============ Bento 功能 ============ */
.bento {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.bento__item {
  background: rgba(148, 190, 196, 0.05);
  border: 1px solid rgba(148, 190, 196, 0.12);
  border-radius: 16px;
  padding: 26px 24px;
  transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.bento__item:hover {
  border-color: rgba(56, 192, 201, 0.4);
  transform: translateY(-2px);
  background: rgba(148, 190, 196, 0.08);
}
.bento__item--drag { grid-column: span 2; }
.bento__item--full { grid-column: span 3; display: flex; align-items: center; gap: 20px; }
.bento__item--full .bento__desc { flex: 1; margin: 0; }
.bento__icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(56, 192, 201, 0.12);
  border: 1px solid rgba(56, 192, 201, 0.25);
  margin-bottom: 16px;
}
.bento__item--full .bento__icon { margin-bottom: 0; }
.bento__title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #e8f1f3;
}
.bento__desc {
  font-size: 13.5px;
  line-height: 1.75;
  color: #9fb4ba;
}

/* ============ 场景 ============ */
.scenes {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.scene {
  display: flex;
  gap: 14px;
  padding: 22px 18px;
  border-radius: 14px;
  background: rgba(148, 190, 196, 0.04);
  border: 1px solid rgba(148, 190, 196, 0.10);
  transition: all 0.22s ease;
}
.scene:hover {
  border-color: rgba(56, 192, 201, 0.4);
  transform: translateY(-2px);
}
.scene__icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(56, 192, 201, 0.10);
}
.scene__title {
  font-size: 15px;
  font-weight: 700;
  color: #e8f1f3;
  margin-bottom: 6px;
}
.scene__desc {
  font-size: 12.5px;
  line-height: 1.7;
  color: #93a9af;
}

/* ============ 价值 ============ */
.values {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.value {
  padding: 24px 20px;
  border-radius: 14px;
  background: linear-gradient(160deg, rgba(56, 192, 201, 0.08), rgba(148, 190, 196, 0.03));
  border: 1px solid rgba(56, 192, 201, 0.16);
}
.value__num {
  font-size: 26px;
  font-weight: 800;
  color: #38c0c9;
  margin-bottom: 10px;
  letter-spacing: 1px;
}
.value__text {
  font-size: 14px;
  line-height: 1.6;
  color: #c3d6da;
}

/* ============ 元件库 ============ */
.comps {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.comp {
  padding: 22px 18px;
  border-radius: 14px;
  background: rgba(148, 190, 196, 0.04);
  border: 1px solid rgba(148, 190, 196, 0.10);
}
.comp__name {
  font-size: 14px;
  font-weight: 800;
  color: #38c0c9;
  margin-bottom: 14px;
  letter-spacing: 0.5px;
}
.comp__items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(56, 192, 201, 0.08);
  border: 1px solid rgba(56, 192, 201, 0.20);
  font-size: 12.5px;
  color: #bcd2d6;
}

/* ============ CTA ============ */
.cta {
  max-width: 1280px;
  margin: 88px auto 56px;
  text-align: center;
  padding: 64px 32px;
  border-radius: 22px;
  background:
    radial-gradient(760px 300px at 50% 0%, rgba(56, 192, 201, 0.16), transparent 70%),
    rgba(148, 190, 196, 0.04);
  border: 1px solid rgba(148, 190, 196, 0.14);
}
.cta__title {
  margin: 0 0 12px;
  font-size: 30px;
  font-weight: 800;
  color: #eef6f7;
  letter-spacing: 0.5px;
}
.cta__desc {
  margin: 0 auto 28px;
  max-width: 460px;
  font-size: 14.5px;
  color: #93a9af;
  line-height: 1.7;
}

/* ============ 按钮 / 页脚 ============ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.btn--primary {
  padding: 14px 32px;
  background: linear-gradient(135deg, #43c9d1 0%, #2eafb8 55%, #1f7f88 100%);
  color: #ffffff;
  box-shadow: 0 6px 22px rgba(46, 175, 184, 0.35);
}
.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(46, 175, 184, 0.45);
}
.btn--primary:focus-visible {
  outline: 2px solid #8fdfe4;
  outline-offset: 3px;
}
.btn--lg {
  padding: 16px 40px;
  font-size: 16px;
}
.foot {
  text-align: center;
  padding: 26px 0 40px;
  font-size: 12.5px;
  color: #5d737a;
}
.foot__sep {
  margin: 0 10px;
}

/* ============ 灯箱 ============ */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(6, 10, 12, 0.88);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  box-sizing: border-box;
}
.lightbox__close {
  position: absolute;
  top: 24px;
  right: 28px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(10, 17, 20, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s ease;
}
.lightbox__close:hover {
  background: rgba(56, 192, 201, 0.35);
}
.lightbox__video {
  width: 92vw;
  max-width: 1080px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(148, 190, 196, 0.2);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}
.lightbox__video video {
  display: block;
  width: 100%;
  max-height: 78vh;
  background: #000;
}
.lightbox__cap {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #cfe6e9;
  font-size: 14.5px;
  font-weight: 600;
}
.lightbox__tag {
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(56, 192, 201, 0.45);
  color: #8fdfe4;
  font-size: 11px;
  letter-spacing: 1.2px;
  font-weight: 700;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* ============ 动画 ============ */
@keyframes riseIn {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes bob {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 6px); }
}

/* ============ 响应式 ============ */
@media screen and (max-width: 1024px) {
  .hero__inner {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .showcase__stage { height: 46vh; }
  .sec { padding: 64px 24px 8px; }
  .nav { padding: 16px 24px; }
  .hero { padding: 84px 24px 64px; }
  .scenes, .values, .comps { grid-template-columns: repeat(2, 1fr); }
}
@media screen and (max-width: 640px) {
  .hero__title { font-size: 34px; }
  .hero__stats { gap: 24px; flex-wrap: wrap; }
  .bento { grid-template-columns: 1fr; }
  .bento__item--drag { grid-column: span 1; }
  .bento__item--full { grid-column: span 1; flex-direction: column; align-items: flex-start; }
  .scenes, .values, .comps { grid-template-columns: 1fr; }
  .showcase__stage { height: 40vh; }
  .nav__cta span { display: none; }
  .lightbox { padding: 16px; }
}

/* ============ 减弱动效 ============ */
@media (prefers-reduced-motion: reduce) {
  .hero__copy, .showcase { animation: none; }
  .showcase__track { transition: none; }
  .hero__hint { animation: none; }
}
</style>

<style lang="scss">
/* 介绍页图标工具类（svg-icon 组件：尺寸=font-size，填充=currentColor） */
.i-16 { font-size: 16px; }
.i-18 { font-size: 18px; }
.i-20 { font-size: 20px; }
.i-22 { font-size: 22px; }
.i-24 { font-size: 24px; }
.i-26 { font-size: 26px; }
.i-teal { color: #38c0c9; }
.i-light { color: #cfe6e9; }
.i-dim { color: #6e868d; }
</style>
