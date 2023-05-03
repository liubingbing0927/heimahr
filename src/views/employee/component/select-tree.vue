<template>
  <!-- separator	选项分隔符 -->
  <!-- 将传过来的数据动态给级联 -->
  <el-cascader :value="value" size="mini" :options="treeData" :props="props" separator="-" @change="changeid" />
</template>

<script>
import { departmentDetail } from '@/api/department'
import { transfer } from '@/utils/index'
export default {
  // 接受父传子的数据
  props: {
    value: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      treeData: [],
      props: {
        label: 'name',
        value: 'id'
      }
    }
  },
  created() {
    this.getdepartmentDetail()
  },
  methods: {
    async getdepartmentDetail() {
      const res = await departmentDetail()
      const data = await transfer(res, 0)
      this.treeData = data
      // 需要注意的是，在transfer中，如果没有children，也会有一个空数组
      // 需要判断children是否有
    },
    changeid(data) {
      // console.log(data)
      if (data.length) {
        this.$emit('input', data[data.length - 1])
      } else {
        this.$emit('input', null)
      }
    }
  }
}
</script>

