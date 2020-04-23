<template>
  <div class="footer">
    <div class="links">
      <a
        href="http://www.zztrc.edu.cn/"
        target="_blank"
      >郑州旅游职业学院</a>
      <a href="/">创新创业孵化平台</a>
      <a href="https://gitee.com/zhangmrit/ruoyi-cloud">RuoYi Cloud</a>
    </div>
    <div class="copyright">
      Copyright
      <a-icon type="copyright" /> 2019 <span>郑州旅游职业学院</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
