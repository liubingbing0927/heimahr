<template>
  <!-- showdialog是由父组件传给子组件的 -->
  <!-- 添加close事件，使弹框关闭，需要子传父修改 -->
  <el-dialog :title="showtitle" :visible="showdialog" @close="close">
    <el-form ref="form" label-width="120px" :model="addform" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="addform.name"
          placeholder="2~10个字符"
          size="mini"
          style="width: 80%"
        />
      </el-form-item>

      <el-form-item prop="code" label="部门编码">
        <el-input
          v-model="addform.code"
          placeholder="2~10个字符"
          size="mini"
          style="width: 80%"
        />
      </el-form-item>

      <el-form-item prop="managerId" label="部门负责人">
        <el-select
          v-model="addform.managerId"
          placeholder="请选择负责人"
          size="mini"
          style="width: 80%"
        >
          <el-option
            v-for="item in managerlist"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="introduce" label="部门介绍">
        <el-input
          v-model="addform.introduce"
          :rows="4"
          placeholder="1~100个字符"
          type="textarea"
          size="mini"
          style="width: 80%"
        />
      </el-form-item>

      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button
              size="mini"
              type="primary"
              @click="confirmbtn"
            >确认</el-button>
            <el-button size="mini" @click="delbtn">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { departmentDetail, managerDetail, updateData, getdepartmentDetail, updatedepartment } from '@/api/department'
export default {
  name: 'ShowDialog',
  props: {
    showdialog: {
      type: Boolean,
      default: false
    },
    addid: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      addform: {
        name: '', // 部门名称
        code: '', // 部门编码
        managerId: '', // 部门负责人
        introduce: '', // 部门介绍
        pid: ''// 父级部门的id
      },
      // 使用自定义校验去校验部门名称和部门编码，看是否与已经存在的一样，一样则校验失败
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '长度为2~10个字符', trigger: 'blur' },
          { trigger: 'blur',
            validator: async(rule, value, callback) => {
              // 调用获取部门详情的函数
              let res = await departmentDetail()
              // 在编辑的情况下，需要排除res中与自己一样的数据，再进行判断
              if (this.addform.id) {
                res = res.filter(item => item.id !== this.addform.id)
              }
              if (res.some(item => item.name === value)) {
                callback(new Error('输入的部门名称已存在'))
              } else {
                callback()
              }
            } }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '长度为2~10个字符', trigger: 'blur' },
          { trigger: 'blur',
            validator: async(rule, value, callback) => {
              // 调用获取部门详情的函数
              let res = await departmentDetail()
              if (this.addform.id) {
                res = res.filter(item => item.id !== this.addform.id)
              }
              if (res.some(item => item.code === value)) {
                callback(new Error('输入的部门编码已存在'))
              } else {
                callback()
              }
            } }
        ],
        managerId: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '长度为1~100个字符', trigger: 'blur' }
        ]
      },
      managerlist: []
    }
  },
  computed: {
    showtitle() {
      return this.addform.id ? '修改部门' : '新增部门'
    }
  },
  created() {
    this.getmanager()
  },
  methods: {
    close() {
      // 当重置表单时，只会重置表单原始有的数据，处于编辑状态切换到新增状态时，id无法重置，需要手动清空
      this.addform = {
        name: '', // 部门名称
        code: '', // 部门编码
        managerId: '', // 部门负责人
        introduce: '', // 部门介绍
        pid: ''// 父级部门的id
      }
      this.$refs.form.resetFields()
      this.$emit('update:showdialog', false)
    },
    // 封装成函数，方便后面调用
    async getmanager() {
      const res = await managerDetail()
      // console.log(res)
      this.managerlist = res
    },
    confirmbtn() {
      // 先校验表单
      this.$refs.form.validate(async(isok) => {
        if (isok) {
          // 判断是否时编辑或新增模式
          let msg = '新增'// 默认新增的提示
          if (this.addform.id) {
            // 编辑模式
            msg = '编辑'
            await updatedepartment(this.addform)
          } else {
            // 点击确定时调用获取新增接口
          // addform中的pid就是父组件传入的id
            await updateData({ ...this.addform, pid: this.addid })
          }

          // 提示新增成功信息
          this.$message.success(`${msg}成功`)
          // 子传父通知父组件更新数据
          this.$emit('updateData')
          // 重置表单，关闭弹框，使用close事件
          this.close()
        }
      })
    },
    delbtn() {
      // 点击取消时重置表单，关闭弹框
      this.close()
    },
    // 调用获取部门详情的
    async getdepartmentDetail() {
      const res = await getdepartmentDetail(this.addid)
      // console.log(res)
      this.addform = res
    }
  }
}
</script>

<style></style>
