<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input v-model="requestform.keyword" style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" placeholder="输入员工姓名全员搜索" @input="changeinput" />
        <!-- 树形组件 -->
        <el-tree ref="tree" node-key="id" :expand-on-click-node="false" :default-expand-all="true" :highlight-current="true" :data="treeform" :props="defaultProps" @current-change="changeid" />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button v-permission="'add-employee'" size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportrole">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{row}">
              <el-avatar v-if="row.staffPhoto" :size="30" :src="row.staffPhoto" />
              <span v-else class="username">{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{row}">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column width="280px" label="操作">
            <template v-slot="{row}">
              <!-- type="text" 表示链接形式 -->
              <el-button type="text" size="mini" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="mini" @click="rolebtn(row.id)">角色</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="confirmdel(row.id)">
                <el-button slot="reference" style="marginLeft:15px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="end">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :current-page="requestform.page"
            :page-size="requestform.pagesize"
            @current-change="changepage"
          />
        </el-row>
      </div>
    </div>
    <ImportExcel :show-excel-dialog.sync="showExcelDialog" @updatesuccess="emplyeedatalist" />
    <!-- 点击角色显示的弹层 -->
    <el-dialog :visible.sync="showcheckbox" title="分配角色">
      <!-- 弹层里面是checkbox复选框结构 -->
      <el-checkbox-group v-model="roleIds">
        <!-- :label表示动态设置了点击复选框时，存储的是id -->
        <el-checkbox v-for="item in checklist" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
        <!-- 使用插槽，使按钮位于尾部 -->
      </el-checkbox-group>

      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="handleconfirm">确定</el-button>
          <el-button size="mini" @click="showcheckbox = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { departmentDetail } from '@/api/department'
import { transfer } from '@/utils/index'
import { delemployee, exportexcel, getemployeedata, getenableRole, getemployeedetail, assignrole } from '@/api/employee'
import FileSaver from 'file-saver'
import ImportExcel from '@/views/employee/component/import-excel.vue'
export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      treeform: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      requestform: {
        departmentId: null,
        // 添加页面参数
        page: 1,
        pagesize: 10,
        keyword: ''
      },
      total: 0,
      list: [],
      showExcelDialog: false,
      showcheckbox: false,
      checklist: [],
      roleIds: [], // 用于存储选择的复选框存储的label的值
      currentid: null
    }
  },
  created() {
    this.getemployeelist()
  },
  methods: {
    // 获取员工列表
    async getemployeelist() {
      const res = await departmentDetail()
      // console.log(res)
      // 获得第一个数据的id，用于默认选择
      this.requestform.departmentId = res[0].id
      // 调用转为树状结构的函数
      this.treeform = transfer(res, 0)
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.requestform.employyid)
      })
      // 当id数据更新完成后调用函数
      this.emplyeedatalist()
    },
    // 点击的部门切换时
    changeid(data) {
      // 当前点击的节点的数据
      // console.log(data)
      this.requestform.departmentId = data.id
      // 把当前的page变为1，点击部门的第一页数据
      this.requestform.page = 1
      this.emplyeedatalist()
    },
    // 获取右侧表格列表数据
    async emplyeedatalist() {
      const { rows, total } = await getemployeedata(this.requestform)
      this.list = rows
      this.total = total
    },
    changepage(newpage) {
      // console.log(newpage)
      this.requestform.page = newpage
      // 重新获取数据
      this.emplyeedatalist()
    },
    changeinput() {
      clearTimeout(this.timer) // 清理上一次的定时器
      this.timer = setTimeout(() => {
        this.requestform.page = 1
        this.emplyeedatalist()
      }, 300)
    },
    async exportrole() {
      // 调用导出接口
      const res = await exportexcel()// 结果是数据流
      //  通过下载file-saver,下载数据流
      FileSaver.saveAs(res, '员工导出表.xlsx')
    },
    async confirmdel(id) {
      await delemployee(id)
      // 判断如果是当前页数据的最后一条数据并且不是第一页，则page减1，跳到前一页
      if (this.list.length === 1 && this.requestform.page > 1) this.requestform.page--
      // 重新渲染
      this.emplyeedatalist()
      this.$message.success('删除员工成功')
    },
    async rolebtn(id) {
      this.checklist = await getenableRole()
      this.currentid = id
      // 调用获取员工详情接口，得到roleIds
      const res = await getemployeedetail(id)
      this.roleIds = res.roleIds
      // 将弹层显示放在后面，为了接口数据都执行完了，在显示
      this.showcheckbox = true
    },
    async handleconfirm() {
      // 调用分配角色接口
      await assignrole({
        id: this.currentid,
        roleIds: this.roleIds
      })
      this.$message.success('分配员工角色成功')
      this.showcheckbox = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>
