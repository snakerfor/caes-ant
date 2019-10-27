<template>
  <div>
    <div class="smallBar">欢迎进入郑州旅游职业学院创新创业服务网</div>
    <div class="titleBar">
      <div class="barContent">
        <img class="logo" src="../../assets/zztrc.png">
        <div class="rightContent">
          <a-input-search placeholder="输入关键字进行搜索" style="width: 240px;margin-right: 30px" />
          <div class="loginLink">
            <a href="/user/login">学生登录</a>
            <a-divider type="vertical" />
            <a href="/user/register">老师登录</a>
            <a-divider type="vertical" />
            <a href="#">用人单位登录</a>
          </div>
        </div>
      </div>
    </div>
    <a-layout>
      <a-layout-header style="height:46px">
        <a-menu theme="dark" v-model="current" mode="horizontal">
          <a-menu-item key="1">首页</a-menu-item>
          <a-menu-item key="2">就业日历</a-menu-item>
          <a-sub-menu>
            <span slot="title">就业指导</span>
            <a-menu-item-group title="Item 1">
              <a-menu-item key="3">就业流程</a-menu-item>
              <a-menu-item key="4">职业规划</a-menu-item>
            </a-menu-item-group>
            <a-menu-item-group title="Item 2">
              <a-menu-item key="5">政策法规</a-menu-item>
              <a-menu-item key="6">面试宝典</a-menu-item>
            </a-menu-item-group>
          </a-sub-menu>
          <a-menu-item key="7">最新招聘</a-menu-item>
          <a-menu-item key="8">就业日历</a-menu-item>
          <a-menu-item key="9">最新招聘</a-menu-item>
          <a-menu-item key="0">就业日历</a-menu-item>
          <a-menu-item key="01">最新招聘</a-menu-item>
          <a-menu-item key="02">就业日历</a-menu-item>
          <a-menu-item key="03">最新招聘</a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content>
        <swiper style="height:300px" :options="swiperOption">
          <swiper-slide style="background-color:#CC99090">Slide 1</swiper-slide>
          <swiper-slide style="background-color:#FFC0CB">Slide 2</swiper-slide>
          <swiper-slide style="background-color:#CC3300">Slide 3</swiper-slide>
          <swiper-slide style="background-color:#595959">Slide 4</swiper-slide>
          <swiper-slide style="background-color:#FFFFCC">Slide 5</swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

export default {
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      swiperOption: {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  }
}
</script>

<style scoped>
.smallBar {
  background-color:#f0f2f5;
  width:100%;
  height:20px;
  font-size:12px;
  display: none;
}

.titleBar {
  width: 100%;
  height: 120px;
  background-color:#fff;
}

.barContent {
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}

.rightContent {
  float:right;
  padding-top:40px;
}

.logo {
  margin-top: 20px;
  width: 520px;
  height: 80px;
}

.loginLink {
  display:inline;
}

@media only screen and (max-width: 1276px) {
.loginLink {
  display:block;
  margin-top:10px;
  }
}

@media only screen and (max-width: 988px) {
.logo {
  margin-top: 40px;
  width: 320px;
  height: 50px;
  }
}

@media only screen and (max-width: 738px) {
.logo {
  display: none;
  }
  .rightContent {
    float: left;
    padding-top: 10px;
  }
  .loginLink {
    display: inline;
  }
  .titleBar {
    height: 70px;
  }
  .smallBar {
    display: block;
  }
}
</style>
