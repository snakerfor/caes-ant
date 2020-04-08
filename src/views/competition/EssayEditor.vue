<template>
  <a-card
    :body-style="{padding: '24px 32px'}"
    :bordered="false">
    <tinymce v-model="value"></tinymce>
    {{ value }}
  </a-card>
</template>

<script>
import Tinymce from '@/components/Editor/Tinymce'
export default {
  components: {
    Tinymce
  },
  data () {
    return {
      description: '文章编辑与发布管理',
      value: ''
    }
  }
}
</script>
