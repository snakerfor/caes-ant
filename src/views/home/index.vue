<template>
  <div id="homeLayout" style="max-width:1200px;margin:auto">
    <div class="smallBar">欢迎进入郑州旅游职业学院创新创业服务网</div>
    <div class="titleBar">
      <div class="barContent">
        <img class="logo" src="../../assets/zztrc.png">
        <div class="rightContent">
          <a-input-search placeholder="输入关键字进行搜索" style="width: 240px;margin-right: 30px" />
          <div class="loginLink">
            <a href="/user/login">学生登录</a>
            <a-divider type="vertical" />
            <a href="/user/login">老师登录</a>
          </div>
        </div>
      </div>
    </div>
    <a-layout>
      <a-layout-header style="height:46px;padding:0px;">
        <a-menu style="width:85%;margin:auto" theme="dark" v-model="menuCurrent" mode="horizontal">
          <a-menu-item key="s:a">
            <a href="/index">首页</a>
          </a-menu-item>
          <a-menu-item key="s:2">
            </a>中心概况</a>
          </a-menu-item>
          <a-sub-menu>
            <span slot="title">就业指导</span>
            <a-menu-item-group title="Item 1">
              <a-menu-item key="s:3"><a href="/major/test">专业测评</a></a-menu-item>
              <a-menu-item key="s:4">职业规划</a-menu-item>
            </a-menu-item-group>
            <a-menu-item-group title="Item 2">
              <a-menu-item key="n:5">政策法规</a-menu-item>
              <a-menu-item key="n:6">面试宝典</a-menu-item>
            </a-menu-item-group>
          </a-sub-menu>
          <a-menu-item key="s:7">最新招聘</a-menu-item>
          <a-menu-item key="s:8">就业日历</a-menu-item>
          <a-menu-item key="s:9">最新招聘</a-menu-item>
          <a-menu-item key="s:0">就业日历</a-menu-item>
          <a-menu-item key="s:01">最新招聘</a-menu-item>
          <a-menu-item key="s:02">就业日历</a-menu-item>
          <a-menu-item key="s:03">最新招聘</a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content>
        <swiper style="height:300px" :options="swiperOption">
          <swiper-slide style=""><img style="width:100%" src="../../assets/1.jpg"></swiper-slide>
          <swiper-slide style=""><img style="width:100%" src="../../assets/2.jpg"></swiper-slide>
          <swiper-slide style=""><img style="width:100%" src="../../assets/3.png"></swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>

        <!-- 文章列表 -->
        <div class="contentWrap">
          <a-row :gutter="24">
            <a-col :md="8">
              <a-list :dataSource="listData">
                <a-list-item slot="renderItem" class="listItem" slot-scope="item, index" :id="index">
                  <a-icon style="margin-top:4px;margin-right:2px" type="caret-right" />
                  <div class="ttt"><a href="#">【综合】 {{ item }}</a></div>
                  <div class="listDate">10-01</div>
                </a-list-item>
                <div slot="header">
                  <span class="listTitle1"><a-icon type="inbox" />通知公告</span>
                  <span class="listTitle2">NOTICE</span>
                  <div class="listMore"><a href="#">更多 <a-icon type="right" /></a></div>
                </div>
                <div slot="footer"></div>
              </a-list>
            </a-col>
            <a-col :md="8">
              <a-list :dataSource="listData">
                <a-list-item slot="renderItem" class="listItem" slot-scope="item, index" :id="index">
                  <a-icon style="margin-top:4px;margin-right:2px" type="caret-right" />
                  <div class="ttt"><a href="#">【综合】 {{ item }}</a></div>
                  <div class="listDate">10-01</div>
                </a-list-item>
                <div slot="header">
                  <span class="listTitle1"><a-icon type="book" />招聘信息</span>
                  <span class="listTitle2">RECRUITMENT</span>
                  <div class="listMore"><a href="#">更多 <a-icon type="right" /></a></div>
                </div>
                <div slot="footer"></div>
              </a-list>
            </a-col>
            <a-col :md="8">
              <div style="padding-top:12px;padding-bottom:12px">
                <span class="listTitle1"><a-icon type="appstore" />快速导航</span>
                <span class="listTitle2">NAVIGATION</span>
                <div class="listMore"><a href="#">更多 <a-icon type="right" /></a></div>
              </div>
              <div class="listContent">
                <a-row :gutter="16">
                  <a-col :span="8">
                    <a href="#" style="background-color:#4489ca" class="navBlock">创客论道</a>
                  </a-col>
                  <a-col :span="8">
                    <a href="#" style="background-color:#ae5da0" class="navBlock">高层论坛</a>
                  </a-col>
                  <a-col :span="8">
                    <a href="#" style="background-color:#bf3b48" class="navBlock">课程培训</a>
                  </a-col>
                </a-row>
              </div>
              <div class="listContent">
                <a-row :gutter="16">
                  <a-col :span="8">
                    <a href="#" style="background-color:#00999b" class="navBlock">双创大赛</a>
                  </a-col>
                  <a-col :span="8">
                    <a href="#" style="background-color:#fabe10" class="navBlock">创客之星</a>
                  </a-col>
                  <a-col :span="8">
                    <a href="#" style="background-color:#03a9f4" class="navBlock">创客训练营</a>
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-layout-content>

      <a-layout-footer class="pageFooter">
        <a-divider dashed />

        郑州旅游职业学院创业服务网 版权所有 © 大学生就业创业指导服务中心<br>
        学校地址：河南省郑州市郑东新区金龙路188号（451464） 豫英校区：河南省郑州市管城回族区豫英路1号(450009)<br>
        网站备案：豫ICP备08106402号  郑公信备4101000000076号<br>
      </a-layout-footer>
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
      // 导航菜单 当前页
      menuCurrent: ['s:a'],

      listData: [
        'Racing car sprays burning fuel into crowd.',
        'Japanese princess to wed commoner.',
        'Australian walks 100km after outback crash.',
        'Man charged over missing wedding girl.',
        'Los Angeles battles huge wildfires.'
      ],

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

<style>
.smallBar {
  background-color:#f0f2f5;
  width: 100%;
  height: 20px;
  font-size: 12px;
  display: none;
}

.titleBar {
  width: 100%;
  height: 80px;
  margin:10px 0px;
  background-color:#fff;
}

.barContent {
  margin-left: auto;
  margin-right: auto;
  width: 85%;
}

.rightContent {
  float: right;
  padding-top: 40px;
}

.logo {
  /* margin-top: 20px; */
  width: 520px;
  height: 80px;
}

.loginLink {
  display: inline;
}

@media only screen and (max-width: 1276px) {
.loginLink {
  display: block;
  margin-top: 10px;
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

.contentWrap {
  margin: 20px auto 20px auto;
}

.listTitle1 {
  font-size:20px;
  color: #01478c;
}

.listTitle2 {
  font-size: 13px;
  margin-left: 8px;
}

.listMore {
  float: right;
  font-size: 14px;
  line-height:30px;
}

.listMore a {
  color:#999999;
}

.listMore a:hover {
  color:#01478c;
}

.listItem {
  font-size: 16px;
}

.listItem:hover {
  background-color: #ebeced;
}

.listDate {
  color:#999999;
  font-size:17px;
  width: 50px;
  margin-left: auto;
}

.listItem a {
  display: block;
  width: 320px;/* 响应式下宽度不能一直固定！！！ */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.65);
}

.listItem a:hover {
  color: #01478c;
}

.listContent {
  width: 100%;
  padding: 10px 10px;
}

.navBlock {
  display: block;
  width: 100%;
  height:100px;
  border:1px solid;
  border-radius: 4px;
  text-align: center;
  color: #ffffff;
  line-height: 100px;
  font-size: 17px;
  background-color: cornflowerblue;
}

.navBlock:hover {
  box-shadow: 3px 3px 3px #666;
}

.pageFooter {
  background-color: #01478c;
  text-align: center;
  height:200px;
  color:#ffffff;
}
</style>
