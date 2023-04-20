<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <el-form ref="form" :model="loginform" :rules="rules">
          <el-form-item prop="mobile">
            <el-input v-model="loginform.mobile" placeholder="请输入账号" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="loginform.password" type="password" placeholder="请输入密码" />
          </el-form-item>

          <el-form-item prop="ischecked">
            <el-checkbox v-model="loginform.ischecked">
              用户平台使用协议
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button style="width:350px" type="primary" @click="login">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      loginform: {
        // 判断开发环境是显示默认的账号和密码，生产环境不显示
        mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '',
        password: process.env.NODE_ENV === 'development' ? '123456' : '',
        ischecked: process.env.NODE_ENV === 'development'
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { pattern: /^1[3-8]\d{9}$/, message: '账号形式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度为5~10个字符', trigger: 'blur' }
        ],
        // required无法校验布尔值，使用自定义校验
        ischecked: {
          validator: (rule, value, callback) => {
            // 当value值为true时，就成功的回调，否则就错误回调
            value ? callback() : callback(new Error('请勾选用户协议'))
          }
        }
      }
    }
  },
  methods: {
    login() {
      // 点击登录按钮时，校验整个表单
      this.$refs.form.validate(async(isok) => {
        if (isok) {
          // 当校验成功以后，向user模块发送actions请求
          // 使用await修饰符是因为只有当login登录请求完成才会继续执行下一步
          await this.$store.dispatch('user/login', this.loginform)
          // 当登录成功以后，跳转首页
          this.$router.push('/')
        }
      })
    }
  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color:#606266;
    }
  }
}
</style>
