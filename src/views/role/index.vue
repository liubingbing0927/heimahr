<template>
  <div class="container">
    <div class="app-container">
      <div class="role">
        <el-button size="mini" type="primary" @click="showdialog = true">添加角色</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="list">
        <el-table-column label="角色" align="center" width="200px" prop="name">
          <template v-slot="{row}">
            <!-- 当isedit变为true就显示表单，否则文本内容 -->
            <el-input v-if="row.isedit" v-model="row.editrow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用" align="center" width="200px" prop="state">
          <!-- 使用插槽 -->
          <template v-slot="{row}">
            <el-switch v-if="row.isedit" v-model="row.editrow.state" :active-value="1" :inactive-value="0" />
            <span v-else>{{ row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="description">
          <template v-slot="{row}">
            <el-input v-if="row.isedit" v-model="row.editrow.description" size="mini" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{row}">
            <template v-if="row.isedit">
              <el-button size="mini" type="primary" @click="btnconfirmrole(row)">确定</el-button>
              <el-button size="mini" @click="row.isedit = false">取消</el-button>
            </template>
            <template v-else>
              <el-button size="mini" type="text" @click="assignpermission(row.id)">分配权限</el-button>
              <!-- 点击编辑时，改变isedit ,将行数据传入函数-->
              <el-button size="mini" type="text" @click="editbtn(row)">编辑</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="confirmdel(row.id)">
                <el-button slot="reference" style="marginLeft:15px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页数 -->
      <el-row type="flex" justify="end" style="height: 40px" align="center">
        <!-- current-change改变页数时触发，会传回一个当前新的页数 -->
        <el-pagination :total="pageobj.total" :page-size="pageobj.pagesize" :current-page="pageobj.page" layout="prev,pager,next" @current-change="changepage" />
      </el-row>
    </div>
    <!-- 弹框 -->
    <!-- 当点X号关闭弹框时，无法重置启用按钮，需要close事件 -->
    <el-dialog width="500px" title="新增角色" :visible.sync="showdialog" @close="delbtn">
      <el-form ref="form" label-width="120px" :model="roleform" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleform.name" size="mini" style="width:300px" />
        </el-form-item>
        <!-- 如果不需要校验，就不需要prop,但是需要v-model,数据双向绑定 -->
        <!-- 当重置表单时，需要prop才能重置 -->
        <el-form-item label="启用" prop="state">
          <!-- active-value	switch 打开时的值  inactive-value	switch 关闭时的值 -->
          <el-switch v-model="roleform.state" size="mini" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleform.description" type="textarea" :rows="3" size="mini " style="width:300px" />
        </el-form-item>

        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="16">
              <el-button type="primary" size="mini" @click="confirmbtn">确定</el-button>
              <el-button size="mini" @click="delbtn">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="showroledialog" title="分配权限">
      <!-- check-strictly	在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false -->
      <el-tree ref="tree" check-strictly node-key="id" :default-checked-keys="permIds" :data="permissionform" :props="{label:'name'}" default-expand-all show-checkbox />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="handleconfirm">确定</el-button>
          <el-button size="mini" @click="showroledialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { addrole, changerole, delrole, getroleList, getroleDetail, assignrolepermission } from '@/api/role'
import { getpermissonData } from '@/api/permission'
import { transfer } from '@/utils/index'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      // 存切换页数的对象
      pageobj: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      showdialog: false,
      roleform: {
        name: '',
        description: '',
        state: 0 // 默认未启用状态
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      showroledialog: false,
      permissionform: [],
      currentid: null,
      permIds: []
    }
  },
  created() {
    this.getrole()
  },
  methods: {
    async getrole() {
      // 调用获取列表接口
      const { rows, total } = await getroleList(this.pageobj)
      this.list = rows
      this.pageobj.total = total
      this.list.forEach(item => {
        // this.$set()可以让动态添加的属性具备响应式
        this.$set(item, 'isedit', false)
        // 动态生成一个对象，存储name，description，及state
        this.$set(item, 'editrow', {
          name: item.name,
          description: item.description,
          state: item.state
        })
      }
      )
    },
    changepage(newPage) {
      // console.log(newpage)
      this.pageobj.page = newPage
      this.getrole()
    },
    confirmbtn() {
      // 表单校验成功后，调用新增角色接口
      this.$refs.form.validate(async(isok) => {
        if (isok) {
          await addrole(this.roleform)
          // 新增成功提示
          this.$message.success('新增成功')
          // 重置表单及关闭弹框
          this.delbtn()
        }
      })
    },
    delbtn() {
      // 重置表单及关闭弹框
      this.$refs.form.resetFields()
      this.showdialog = false
    },
    editbtn(row) {
      row.isedit = true
      // 当点击编辑时，将editrow里面的数据更新
      row.editrow.name = row.name
      row.editrow.description = row.description
      row.editrow.state = row.state
    },
    async btnconfirmrole(row) {
      // 判断name和description是否为空
      if (row.editrow.name && row.editrow.description) {
        // 调用修改角色接口
        await changerole({ ...row.editrow, id: row.id })
        // 修改成功提示
        this.$message.success('修改角色成功')
        // 将row的数据更改为row.editrow的数据，不能直接修改，使用浅拷贝的方法
        Object.assign(row, {
          ...row.editrow,
          // 并且将编辑状态变为false
          isedit: false
        })
      } else {
        this.$message.warning('用户名称和描述不能为空')
      }
    },
    async confirmdel(id) {
      // 调用删除角色接口
      await delrole(id)
      // 提示成功
      this.$message.success('删除角色成功')
      // 如果删除的是当前页的最后一个数据，则页面减1，重新渲染
      if (this.list.length === 1) this.pageobj.page--
      this.getrole()
    },
    async assignpermission(id) {
      const res = await getpermissonData()
      // 将数据转为树形
      this.currentid = id // 存id
      this.permissionform = transfer(res, 0)
      const { permIds } = await getroleDetail(id)
      this.permIds = permIds
      this.showroledialog = true
    },
    async handleconfirm() {
      // 调用分配权限接口
      await assignrolepermission({
        id: this.currentid,
        permIds: this.$refs.tree.getCheckedKeys()// 因为permIds没有双向绑定，所以无法根据视图更新
      })
      this.$message.success('分配角色权限成功')
      this.showroledialog = false
    }
  }
}
</script>
<style scoped>
.role {
  padding: 20px;
}
</style>
