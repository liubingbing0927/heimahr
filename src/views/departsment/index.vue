<template>
  <div class="container">
    <div class="app-container">
      <!-- default-expand-all设置为true表示自动展开 -->
      <!-- expand-on-click-node使点击的时候不会收缩，默认为true -->
      <el-tree :expand-on-click-node="false" default-expand-all :data="datas" :props="defaultProps">
        <template v-slot="{data}">
          <!-- 结构 -->
          <el-row
            style="width: 100%; height: 40px"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="manager">{{ data.managerName }}</span>
              <!-- $event代表传入的实参，add,edit和del -->
              <el-dropdown @command="handleCommand($event,data.id)">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 当点击时，将id传给子组件 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="update">修改部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除部门</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 把showdialog属性传给子组件 -->
    <!-- 使用ref属性，调用子组件的方法 -->
    <ShowDialog ref="showdialog" :showdialog.sync="showdialog" :addid="addid" @updateData="getdepartment" />
  </div>
</template>

<script>
import { deldepartment, departmentDetail } from '@/api/department'
import { transfer } from '@/utils/index'
import ShowDialog from '@/views/departsment/component/show-component.vue'
export default {
  name: 'Departments',
  components: {
    ShowDialog
  },
  data() {
    return {
      datas: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showdialog: false,
      // 存id
      addid: null
    }
  },
  created() {
    this.getdepartment()
  },
  methods: {
    async getdepartment() {
      // 调用请求接口
      const res = await departmentDetail()
      this.datas = transfer(res, 0)
    },
    handleCommand(type, id) {
      if (type === 'add') {
        this.showdialog = true
        this.addid = id
      } else if (type === 'update') {
        this.showdialog = true
        this.addid = id
        // 等数据更新之后，再调用函数
        this.$nextTick(() => {
          this.$refs.showdialog.getdepartmentDetail()
        })
      } else {
        // 写一个是否删除模块
        this.$confirm('确认删除这个部门吗').then(async() => {
          await deldepartment(id)
          this.$message.success('删除成功')
          // 重新渲染数据
          this.getdepartment()
        }).catch(() => {

        })
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}
.manager{
  width: 50px;
  display: inline-block;
  margin: 10px;
}
</style>
