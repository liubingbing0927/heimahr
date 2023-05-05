<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 当头像为空时，显示用户名字的第一个字并设置样式 -->
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <!-- 为了避免name为空时报错，使用？ -->
          <span v-else class="span">{{ name?.charAt(0) }}</span>
          <!-- 添加用户名称 -->
          <span class="name">{{ name }}</span>
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a
            target="_blank"
            href="https://github.com/PanJiaChen/vue-admin-template/"
          >
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <a
            target="_blank"
            @click.prevent="updatepassword"
          >
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 当点X，关闭弹框时，不会重置表单 -->
    <el-dialog title="修改密码" :visible.sync="ishow" @close="delbtn">
      <!-- 修改密码表单结构 -->
      <el-form ref="form" label-width="200px" :model="passform" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passform.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passform.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input v-model="passform.confirmPassword" show-password size="small" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="confirmbtn">确认修改</el-button>
          <el-button size="mini" @click="delbtn">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { changepassword } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      ishow: false,
      passform: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 5, max: 10, message: '长度要求在5~10个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          //  使用自定义校验判断新密码和重复密码是否相等,使用箭头函数的形式 ，this才指向实例
          // value是写入的重复密码的值
          { trigger: 'blur', validator: (rule, value, callback) => {
            if (this.passform.newPassword === value) {
              callback()
            } else {
              callback(new Error('新密码和重复密码不一致，请重新输入'))
            }
          } }
        ]
      }
    }
  },
  computed: {
    // 获取头像地址和用户名称
    ...mapGetters(['sidebar', 'avatar', 'name'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    updatepassword() {
      this.ishow = true
    },
    confirmbtn() {
      // 先校验表单是否成功
      this.$refs.form.validate(async(isok) => {
        if (isok) {
          // 调用修改密码接口
          await changepassword(this.passform)
          // 修改密码成功以后重置表单并提示修改成功,直接调用delbtn函数
          // this.$refs.form.resetFields()
          this.$message.success('修改成功')
          // 弹框隐藏
          // this.ishow = false
          this.delbtn()
        }
      })
    },
    delbtn() {
      // 点击取消是，重置表单，弹框隐藏
      this.$refs.form.resetFields()
      this.ishow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .name {
          margin-right: 15px;

          font-size: 16px;
        }
        .span{
          width: 30px;
          height: 30px;
          background-color: #04c9be;
          color: #fff;
          border-radius: 50%;
          text-align: center;
          line-height: 30px;
          margin-right: 10px;
        }
        .user-avatar {
          // 图片设置大小样式等
          cursor: pointer;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .el-icon-setting {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
