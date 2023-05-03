<template>
  <!-- action属性用于自动上传，show-file-list用于展示上传列表，不需要只需要一个文件即可 -->
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadimage"
  >

    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {

    beforeAvatarUpload(file) {
      // 将可选的类型放于一个数组中，判断file.type是否在这个数组中

      const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5 // 小于5MB

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG  PNG GIF BMP格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    uploadimage(datas) {
      // console.log(data)// 得到关于文件上传的信息
      const cos = new COS({
        SecretId: 'AKIDpX4MRwEKBArNhneKo34spa6E8rMgnfLs',
        SecretKey: 'Pp9C3g5KMgmeMs9D7pIVUJwJTZVEgz98'
      })
      cos.putObject({
        Bucket: 'hubeidaxue-1318008818', // 存储桶名称
        Region: 'ap-nanjing', // 地域名称
        Key: datas.file.name, // 文件名称
        StorageClass: 'STANDARD', // 固定值
        Body: datas.file // 文件对象
      }, (err, data) => {
        if (data.statusCode === 200 && data.Location) {
          // 拿到了腾讯云返回的地址
          // 通过input自定义事件将地址传出去
          this.$emit('input', 'http://' + data.Location) // 将地址返回了
        } else {
          this.$message.error(err.Message) // 上传失败提示消息
        }
      })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
