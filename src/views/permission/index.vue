<template v-slot="{row}">
  <div class="container">
    <div class="app-container">
      <el-button type="primary" size="mini" @click="addpermission(0,1)">添加权限</el-button>
      <!--  row-key绑定一个独特的值，展示树形 -->
      <el-table default-expand-all :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type === 1" type="text" size="mini" @click="addpermission(row.id,2)">添加</el-button>
            <el-button type="text" size="mini" @click="editpermissiondetail(row.id)">编辑</el-button>
            <el-button type="text" size="mini" @click="removebtn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="showtitle" :visible.sync="showdialog" width="500px" @close="close">
      <el-form ref="form" label-width="120px" :model="dialogform" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="dialogform.name" size="mini" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="dialogform.code" size="mini" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="dialogform.description" type="textarea" :rows="2" size="mini" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch v-model="dialogform.enVisible" active-value="1" inactive-value="0" size="mini" />
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-button type="primary" size="mini" @click="btnok">确定</el-button>
          <el-button size="mini" @click="delbtn">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getpermissonData, addpermission, updatepermission, getpermissiondetail, removepermission } from '@/api/permission'
import { transfer } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showdialog: false,
      dialogform: {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        pid: '',
        type: ''
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '权限描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    showtitle() {
      return this.dialogform.id ? '编辑权限' : '新增权限'
    }

  },
  // 初始化时就调用接口，转换为树形，将数据传给表格
  created() {
    this.getpermission()
  },
  methods: {
    async getpermission() {
      // 调用接口
      const res = await getpermissonData()
      // console.log(res)// 每一行大数据，转换为树形
      const data = transfer(res, 0)
      this.list = data
    },
    btnok() {
      this.$refs.form.validate(async isok => {
        // 表单校验成功以后，调用新增接口
        if (isok) {
          if (this.dialogform.id) {
            // 编辑模式
            await updatepermission(this.dialogform)
            this.$message.success('编辑权限成功')
          } else {
            // 点击确定时调用获取新增接口
          // addform中的pid就是父组件传入的id
            await addpermission(this.dialogform)
            // 提示新增成功信息
            this.$message.success('新增权限成功')
          }
          this.getpermission()
          this.$refs.form.resetFields()
          this.showdialog = false
        }
      })
    },
    addpermission(pid, type) {
      this.dialogform.pid = pid
      this.dialogform.type = type
      this.showdialog = true
    },
    async editpermissiondetail(id) {
      this.dialogform = await getpermissiondetail(id)
      this.showdialog = true
    },
    close() {
      this.dialogform = {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        pid: '',
        type: ''
      }
    },
    delbtn() {
      this.close()
      this.showdialog = false
      this.$refs.form.resetFields()
    },
    async removebtn(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await removepermission(id)
        this.getpermission()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.app-container{
  padding: 10px;
}
</style>
