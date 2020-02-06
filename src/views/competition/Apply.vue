<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item label="作品名称" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input v-decorator="['name', {rules: [{ required: true, message: '请输入作品名称' }]}]" name="name" placeholder="请输入作品名称" />
      </a-form-item>
      <a-form-item label="作品领域" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-select v-decorator="['domain', {rules: [{ required: true, message: '请输入作品领域' }]}]" placeholder="请输入作品领域">
          <a-select-option value="计算机">
            计算机
          </a-select-option>
          <a-select-option value="旅游">
            旅游
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="作品介绍" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea v-decorator="['desc', {rules: [{ required: true, message: '请输入作品介绍' }]}]" name="desc" placeholder="请输入作品介绍" :rows="4" />
      </a-form-item>
      <a-form-item label="作品负责人" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input v-decorator="['leader', {rules: [{ required: true, message: '请输入作品负责人' }]}]" name="leader" placeholder="请输入作品负责人" />
      </a-form-item>
      <a-form-item label="作品团队" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input v-decorator="['team', {rules: [{ required: true, message: '请输入作品团队' }]}]" name="team" placeholder="请输入作品团队" />
      </a-form-item>
      <a-form-item label="团队描述" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea v-decorator="['teamDesc', {rules: [{ required: true, message: '请输入团队描述' }]}]" name="teamDesc" placeholder="请输入团队描述" :rows="4" />
      </a-form-item>
      <a-form-item label="目前阶段描述" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea v-decorator="['currentDesc', {rules: [{ required: true, message: '请输入目前团队描述' }]}]" name="currentDesc" placeholder="请输入目前团队描述" :rows="4" />
      </a-form-item>
      <a-form-item label="未来达成描述" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea v-decorator="['futureDesc', {rules: [{ required: true, message: '请输入未来达成描述' }]}]" name="futureDesc" placeholder="请输入未来达成描述" :rows="4" />
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
        <a-button htmlType="submit" type="primary">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
// 导入接口函数
import { competitionSumbit } from '@/api/competition'
export default {
  components: {
  },
  data () {
    var pageData = {
      // 页面描述
      description: '参赛作品申报，填写作品信息并提交',
      form: this.$form.createForm(this)
    }
    return pageData
  },
  methods: {
    // 提交
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values)
          this.confirmLoading = true
          competitionSumbit(values).then(res => {
            if (res.code === 0) {
              this.$message.success('作品申报信息提交成功')
            } else {
              this.$message.error('作品申报信息提交失败，检查信息有效性后重试')
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    }
  }
}
</script>
